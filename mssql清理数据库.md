# MSSQL 数据库空间查询、日志瘦身与日志表清理指南

本文档记录了在 SQL Server (MSSQL) 中针对数据库（特别是 `OEFCBC` 数据库）进行容量排查、日志文件瘦身以及历史日志表清理的完整操作步骤与 SQL 脚本。

---

## 目录
1. [查看数据库与日志文件大小](#1-查看数据库与日志文件大小)
2. [查看特定数据库中各表的大小](#2-查看特定数据库中各表的大小)
3. [清理与收缩过大的日志文件 (.ldf)](#3-清理与收缩过大的日志文件-ldf)
4. [清理日志与审计表数据](#4-清理日志与审计表数据)
5. [释放磁盘空间（数据文件收缩）](#5-释放磁盘空间数据文件收缩)

---

## 1. 查看数据库与日志文件大小

使用以下 SQL 查询当前服务器上所有数据库的总大小、数据文件大小及日志文件大小：

```sql
SELECT 
    Databases.name AS [数据库名称],
    CAST(SUM(CAST(Files.size AS BIGINT) * 8 / 1024) AS DECIMAL(18, 2)) AS [总大小 (MB)],
    CAST(SUM(CASE WHEN Files.type = 0 THEN CAST(Files.size AS BIGINT) * 8 / 1024 ELSE 0 END) AS DECIMAL(18, 2)) AS [数据文件大小 (MB)],
    CAST(SUM(CASE WHEN Files.type = 1 THEN CAST(Files.size AS BIGINT) * 8 / 1024 ELSE 0 END) AS DECIMAL(18, 2)) AS [日志文件大小 (MB)]
FROM 
    sys.master_files Files
INNER JOIN 
    sys.databases Databases ON Files.database_id = Databases.database_id
GROUP BY 
    Databases.name
ORDER BY 
    [总大小 (MB)] DESC;
```

---

## 2. 查看特定数据库中各表的大小

切换上下文至 `OEFCBC` 数据库，查询库内各业务表的数据量和空间占用情况：

```sql
USE OEFCBC;
GO

SELECT 
    t.NAME AS [表名],
    s.name AS [模式名],
    p.rows AS [行数],
    CAST(ROUND(((SUM(a.total_pages) * 8) / 1024.0), 2) AS NUMERIC(18, 2)) AS [总空间 (MB)],
    CAST(ROUND(((SUM(a.data_pages) * 8) / 1024.0), 2) AS NUMERIC(18, 2)) AS [数据空间 (MB)],
    CAST(ROUND(((SUM(a.total_pages) - SUM(a.data_pages)) * 8) / 1024.0, 2) AS NUMERIC(18, 2)) AS [索引空间 (MB)]
FROM 
    sys.tables t
INNER JOIN 
    sys.indexes i ON t.object_id = i.object_id
INNER JOIN 
    sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
INNER JOIN 
    sys.allocation_units a ON p.partition_id = a.container_id
LEFT JOIN 
    sys.schemas s ON t.schema_id = s.schema_id
WHERE 
    t.is_ms_shipped = 0 -- 过滤掉系统自带表
GROUP BY 
    t.NAME, s.name, p.rows
ORDER BY 
    [总空间 (MB)] DESC;
```

---

## 3. 清理与收缩过大的日志文件 (.ldf)

> **⚠️ 注意**：切勿直接在操作系统中强行删除 `.ldf` 物理文件，否则会导致数据库损坏。

### 步骤 1：查询日志文件的逻辑名称
```sql
USE OEFCBC;
GO

SELECT name, type_desc FROM sys.database_files;
```
*(假设查询出的日志文件逻辑名称为 `OEFCBC_log`)*

### 步骤 2：切换恢复模式并执行日志收缩
```sql
USE OEFCBC;
GO

-- 1. 将恢复模式临时更改为简单模式，截断事务日志
ALTER DATABASE OEFCBC SET RECOVERY SIMPLE;
GO

-- 2. 收缩日志文件至指定大小（如 500 MB）
DBCC SHRINKFILE (OEFCBC_log, 500);
GO

-- 3. （可选）根据生产需求将恢复模式改回完整模式
ALTER DATABASE OEFCBC SET RECOVERY FULL;
GO
```

---

## 4. 清理日志与审计表数据

针对数据量较大的系统日志表（如 `LOG_INFO_UserActions`、`LOG_INFO_EmailNotify`、`AuditTrail`），可选择按时间清理或完全清空。

### 方案 A：保留近期数据（推荐）
假设表中有时间标识字段（如 `CreateTime`），只删除 1 年以前的历史记录：

```sql
USE OEFCBC;
GO

-- 清理用户行为日志表
DELETE FROM dbo.LOG_INFO_UserActions 
WHERE CreateTime < DATEADD(year, -1, GETDATE());

-- 清理邮件通知日志表
DELETE FROM dbo.LOG_INFO_EmailNotify 
WHERE CreateTime < DATEADD(year, -1, GETDATE());

-- 清理审计日志表
DELETE FROM dbo.AuditTrail 
WHERE CreateTime < DATEADD(year, -1, GETDATE());
```

### 方案 B：彻底清空表数据（快速清理）
若历史日志无保留价值，直接通过 `TRUNCATE` 清空表，执行速度快且不占用额外事务日志：

```sql
USE OEFCBC;
GO

TRUNCATE TABLE dbo.LOG_INFO_UserActions;
TRUNCATE TABLE dbo.LOG_INFO_EmailNotify;
TRUNCATE TABLE dbo.AuditTrail;
```

---

## 5. 释放磁盘空间（数据文件收缩）

删除大量表数据后，数据库的数据文件（`.mdf` / `.ndf`）占用的磁盘空间不会自动释放给操作系统，需要手动进行数据文件收缩：

```sql
USE OEFCBC;
GO

-- 将数据文件中的空闲空间释放给操作系统
DBCC SHRINKDATABASE (OEFCBC);
GO
```

也可在 SSMS 图形化界面操作：
- 右键数据库 `OEFCBC` $\rightarrow$ **任务 (Tasks)** $\rightarrow$ **收缩 (Shrink)** $\rightarrow$ **文件 (Files)** $\rightarrow$ 选择文件类型为 `Data` $\rightarrow$ 点击 **确定**。