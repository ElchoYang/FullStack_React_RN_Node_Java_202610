# React Week 1：React 基础与 CRUD 实战 Demo 指南

本指南专为 **Week 1 (React 基础与 CRUD Demo)** 制定，涵盖技术选型、环境准备、完整安装命令与注释、生产级项目目录架构以及核心模块骨架设计。

---

## 目录
1. [Week 1 学习目标与交付物](#1-week-1-学习目标与交付物)
2. [技术栈选型](#2-技术栈选型)
3. [环境准备与检查](#3-环境准备与检查)
4. [项目初始化与依赖安装（含命令与注释）](#4-项目初始化与依赖安装含命令与注释)
5. [项目架构与完整目录结构](#5-项目架构与完整目录结构)
6. [配置文件与脚本配置](#6-配置文件与脚本配置)
7. [核心模块骨架设计与代码示例](#7-核心模块骨架设计与代码示例)
8. [运行与调试步骤](#8-运行与调试步骤)
9. [Week 1 核心能力达标自测清单](#9-week-1-核心能力达标自测清单)

---

## 1. Week 1 学习目标与交付物

- **学习重点**：
  - JavaScript ES6+（解构、展开运算符、箭头函数、Promise、Async/Await）
  - TypeScript 核心（类型注解、接口 Interface、泛型 Generics、联合类型）
  - React 核心概念（JSX、组件化、Props 传递、State 状态管理）
  - 常用 Hook 实践（`useState` 管理数据、`useEffect` 副作用与请求）
  - 表单与事件处理（受控组件 Controlled Components、表单校验）
  - 路由管理（React Router v6/v7 多页面单页应用导航）
  - REST API 联调（Axios 封装、GET/POST/PUT/DELETE 完整请求闭环）
- **交付物**：**用户管理系统 (React CRUD Demo)**
  - 支持用户列表展示、分页/搜索筛选、新增用户、编辑用户、删除确认、详情查看。

---

## 2. 技术栈选型

| 角色 | 技术选型 | 说明 |
| :--- | :--- | :--- |
| **构建工具** | Vite 6.x / 5.x | 秒级冷启动与 HMR 热更新，现代 React 开发标准 |
| **核心框架** | React 18+ / 19 | 现代化函数式组件与 Hooks |
| **开发语言** | TypeScript 5.x | 类型安全，提高大型项目可维护性 |
| **路由管理** | React Router v6 / v7 | 业界主流 SPA 客户端路由方案 |
| **网络请求** | Axios | 拦截器封装、类型支持良好的 HTTP 客户端 |
| **UI 样式** | Tailwind CSS 3.x / 4.x | 原子化 CSS，快速构建响应式美观界面 |
| **图标库** | Lucide React | 轻量、现代、优雅的 SVG 图标库 |
| **Mock 后端** | JSON Server | 零代码快速搭建标准 RESTful API (CRUD) 接口 |
| **并发运行** | Concurrently | 一键同时启动前端开发服务器与 Mock 后端服务 |

---

## 3. 环境准备与检查

在终端运行以下命令，确保开发环境具备 Node.js（推荐 v18+ 或 v20+ LTS）：

```bash
# 检查 Node.js 版本（建议 >= 18.0.0）
node -v

# 检查 npm 版本（建议 >= 9.0.0）
npm -v
```

---

## 4. 项目初始化与依赖安装（含命令与注释）

### 第一步：创建 Vite + React + TypeScript 项目

在当前工作区根目录执行以下命令：

```bash
# 使用 Vite 模板创建名为 react-crud-demo 的前端工程
# --template react-ts 指定使用 React + TypeScript 模板
npm create vite@latest react-crud-demo -- --template react-ts

# 进入项目目录
cd react-crud-demo
```

### 第二步：安装生产依赖 (Dependencies)

```bash
# 1. react-router-dom: 官方客户端路由库，用于页面切换与路由传参
npm install react-router-dom

# 2. axios: 用于发送 HTTP 请求，与后端/Mock 接口进行 CRUD 交互
npm install axios

# 3. lucide-react: 常用图标库（包含编辑、删除、新增、搜索等图标）
npm install lucide-react
```

### 第三步：安装开发依赖 (DevDependencies)

> **💡 注意**：Tailwind CSS 目前默认安装的是最新 **v4 版本**（推荐），它使用 Vite 专属插件 `@tailwindcss/vite`，**不再需要 `npx tailwindcss init -p` 和配置文件**！
> 我们提供 **方案 A（推荐，Tailwind v4 极简配置）** 与 **方案 B（传统 Tailwind v3 配置）**。

#### 方案 A（推荐）：使用最新 Tailwind CSS v4（零配置文件，速度更快）

```bash
# 1. 安装 Tailwind CSS v4 及其 Vite 插件
npm install -D tailwindcss @tailwindcss/vite

# 2. json-server: 本地 Mock RESTful API 服务（支持 GET/POST/PUT/PATCH/DELETE）
npm install -D json-server@^0.17.4

# 3. concurrently: 跨平台同时运行多个 npm 脚本（同时启动前端与 Mock 接口）
npm install -D concurrently
```

---

#### 方案 B：使用经典 Tailwind CSS v3（传统 PostCSS 配置）

如果希望使用传统的 `tailwind.config.js` 模式，必须锁定 v3 版本安装：

```bash
# 1. 明确指定安装 v3 版本
npm install -D tailwindcss@^3.4.17 postcss autoprefixer

# 2. 初始化 Tailwind 配置文件（生成 tailwind.config.js 与 postcss.config.js）
npx tailwindcss init -p

# 3. 安装 json-server 与 concurrently
npm install -D json-server@^0.17.4 concurrently
```

---

## 5. 项目架构与完整目录结构

### 5.1 分层架构设计理念

本项目采用 **职责分离 (Separation of Concerns)** 的现代前端分层架构，将界面、业务逻辑、网络请求与数据类型彻底解耦：

```text
┌────────────────────────────────────────────────────────┐
│                   页面路由层 (Pages)                    │
│   UserListPage  /  UserDetailPage  /  UserFormPage    │
└───────────────────────────┬────────────────────────────┘
                            │ 组织组件 & 绑定路由
┌───────────────────────────▼────────────────────────────┐
│                   组件展现层 (Components)               │
│   UserTable / UserSearch / Button / Modal / Input ...  │
└───────────────────────────┬────────────────────────────┘
                            │ 触发动作 & 消费数据
┌───────────────────────────▼────────────────────────────┐
│                 业务逻辑层 (Custom Hooks)               │
│        useUsers (状态/操作)   useDebounce (防抖)        │
└───────────────────────────┬────────────────────────────┘
                            │ 调用接口
┌───────────────────────────▼────────────────────────────┐
│                    数据服务层 (API)                     │
│      userService.ts  ───►  request.ts (Axios 拦截器)    │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP (RESTful CRUD)
┌───────────────────────────▼────────────────────────────┐
│                  后端/Mock 服务 (JSON Server)          │
│                    mock/db.json (:4000)                │
└────────────────────────────────────────────────────────┘
```

- **类型驱动 (Type-Driven)**：全局数据结构由 `src/types/` 定义，贯穿 API、Hooks、组件全流程，确保编译期类型安全。
- **关注点分离 (SoC)**：
  - `pages/`：只负责路由承载与各模块组合，不写复杂的表格渲染或 Axios 请求。
  - `components/`：纯粹的 UI 展示与用户交互，通过 Props 接收数据，通过事件回调通知父级。
  - `hooks/`：抽取复用状态与业务逻辑（如列表加载、增删改查刷新逻辑），让组件代码极简。
  - `api/`：统一管理网络请求与错误拦截，隔离具体的 HTTP 请求细节。

---

### 5.2 完整工程目录结构树

```text
react-crud-demo/
├── .vscode/                     # VSCode 编辑器推荐配置
│   └── settings.json            # 保存自动格式化等工程配置
├── mock/                        # Mock 数据与本地接口配置
│   └── db.json                  # JSON Server 数据库文件（存放用户初始 Mock 数据）
├── public/                      # 纯静态资源（不经过 Vite 打包编译）
│   └── vite.svg
├── src/                         # 源代码核心目录
│   ├── api/                     # 【数据服务层】统一接口请求管理
│   │   ├── request.ts           # Axios 实例封装（BaseURL、请求拦截、统一错误拦截）
│   │   └── userService.ts       # 用户模块 CRUD 接口（GET/POST/PATCH/DELETE）
│   ├── assets/                  # 【静态资源层】图片、SVG、字体等
│   │   └── react.svg
│   ├── components/              # 【UI 组件层】可复用的界面组件
│   │   ├── common/              # 通用原子级 UI 组件（跨业务通用）
│   │   │   ├── Button.tsx       # 通用按钮（支持 primary/danger/secondary/ghost 多种变体与 loading 状态）
│   │   │   ├── Input.tsx        # 通用输入框（带 label、error 校验信息展示）
│   │   │   ├── Modal.tsx        # 通用模态对话框（用于删除确认、轻量表单弹窗）
│   │   │   └── Pagination.tsx   # 通用分页条组件
│   │   ├── layout/              # 页面骨架与布局组件
│   │   │   ├── Navbar.tsx       # 顶部导航栏（Logo、导航链接、快速操作）
│   │   │   └── MainLayout.tsx   # 主布局容器（包含 Navbar 与 <Outlet /> 路由插槽）
│   │   └── user/                # 用户业务专属组件
│   │       ├── UserTable.tsx    # 用户列表表格（渲染行数据、操作按钮组、空状态）
│   │       ├── UserSearch.tsx   # 搜索筛选栏（姓名/邮箱搜索输入、角色状态下拉过滤）
│   │       └── UserCard.tsx     # 用户卡片（详情展示视窗）
│   ├── hooks/                   # 【业务逻辑层】自定义 Hooks（复用状态与交互）
│   │   ├── useUsers.ts          # 封装用户列表获取、分页、删除、刷新等核心逻辑
│   │   └── useDebounce.ts       # 搜索关键词防抖 Hook（优化高频输入请求）
│   ├── pages/                   # 【视图页面层】对应路由的顶层页面组件
│   │   ├── UserListPage.tsx     # 用户列表页（核心页面：聚合搜索、表格、分页与删除操作）
│   │   ├── UserDetailPage.tsx   # 用户详情页（按 ID 查询展示单个用户画像与操作日志）
│   │   ├── UserFormPage.tsx     # 用户新增/编辑表单页（复用同一个表单逻辑与校验）
│   │   └── NotFoundPage.tsx     # 404 页面未找到缺省页
│   ├── router/                  # 【路由层】客户端 SPA 路由配置
│   │   └── index.tsx            # 基于 createBrowserRouter 的声明式路由表定义
│   ├── types/                   # 【类型契约层】全局 TypeScript 类型定义
│   │   ├── user.ts              # 用户数据模型接口（User, UserFormData, UserRole 等）
│   │   └── api.ts               # 通用 API 响应包裹类型、分页请求参数接口
│   ├── utils/                   # 【工具函数层】无状态纯函数工具库
│   │   ├── format.ts            # 日期时间格式化 (formatDate)、状态标签颜色映射等
│   │   └── validate.ts          # 基础邮箱、手机号正则与表单字段校验规则
│   ├── App.tsx                  # 应用顶层根组件（注入 RouterProvider 路由上下文）
│   ├── index.css                # 全局样式入口文件（引入 Tailwind CSS 指令）
│   └── main.tsx                 # React 项目根入口（创建 ReactDOM Root 并挂载）
├── .gitignore                   # Git 忽略配置
├── index.html                   # 单页应用（SPA）根 HTML 模板
├── package.json                 # 项目依赖配置清单与 npm scripts 启动命令
├── tsconfig.json                # TypeScript 顶层配置文件
├── tsconfig.app.json            # 针对浏览器端源码的 TypeScript 编译配置
├── tsconfig.node.json           # 针对 Vite Node 构建环境的 TypeScript 编译配置
└── vite.config.ts               # Vite 构建工具配置（集成 React、Tailwind 插件）
```

---

### 5.3 核心目录与文件职责明细表

| 目录/文件 | 核心职责 | 依赖与调用关系 | 典型代码示例/输出 |
| :--- | :--- | :--- | :--- |
| **`src/types/`** | 统一管理数据模型，充当模块间的数据契约 | 被 `api/`, `hooks/`, `components/`, `pages/` 引用 | `interface User { id: string; name: string; ... }` |
| **`src/api/`** | 对接 Mock 或真实后端接口，负责请求/响应/错误拦截 | 调用 `request.ts`，返回带类型的 Promise | `userService.getUsers(params)` |
| **`src/hooks/`** | 沉淀可复用的状态逻辑（UI-agnostic） | 调用 `api/`，被 `pages/` 调用 | `const { users, loading, deleteUser } = useUsers();` |
| **`src/components/common/`** | 无业务属性的纯 UI 基础原子组件 | 被各业务组件及页面使用，通过 Props 传参 | `<Button variant="danger" onClick={handleDelete}>` |
| **`src/components/user/`** | 与用户业务强相关的 UI 展示组件 | 组合原子组件，接收用户领域数据 | `<UserTable data={users} onEdit={...} onDelete={...} />` |
| **`src/pages/`** | 路由页面，装配 Components 与 Hooks | 由 `router/` 调度渲染 | 组合 `<UserSearch />`、`<UserTable />` 与 `<Pagination />` |
| **`src/router/`** | 定义应用路由表及页面嵌套布局 | 挂载各 Page 组件，包裹在 `MainLayout` 中 | `createBrowserRouter([{ path: '/users', element: ... }])` |
| **`mock/`** | 提供本地免后端全功能 CRUD RESTful API | 由 `json-server` 读取并提供 HTTP 服务 | `GET /users`, `POST /users`, `DELETE /users/:id` |

---

## 6. 配置文件与脚本配置

### 6.1 配置 Tailwind CSS（两种方案二选一）

#### 若使用【方案 A：Tailwind v4（推荐）】：
1. **修改 `vite.config.ts`**：
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
});
```

2. **修改 `src/index.css`**（只需单行）：
```css
@import "tailwindcss";
```
*(Tailwind v4 不需要 `tailwind.config.js` 和 `postcss.config.js` 配置文件)*

---

#### 若使用【方案 B：Tailwind v3】：
1. **配置 `tailwind.config.js`**：
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

2. **修改 `src/index.css`**：
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### 6.2 配置 Mock 数据 (`mock/db.json`)
在项目根目录新建 `mock/db.json`，提供初始数据：

```json
{
  "users": [
    {
      "id": "1",
      "name": "张三",
      "email": "zhangsan@example.com",
      "role": "Admin",
      "department": "技术部",
      "status": "Active",
      "createdAt": "2026-03-01T08:00:00.000Z"
    },
    {
      "id": "2",
      "name": "李四",
      "email": "lisi@example.com",
      "role": "Developer",
      "department": "技术部",
      "status": "Active",
      "createdAt": "2026-03-05T09:30:00.000Z"
    },
    {
      "id": "3",
      "name": "王五",
      "email": "wangwu@example.com",
      "role": "Tester",
      "department": "测试部",
      "status": "Inactive",
      "createdAt": "2026-03-10T14:15:00.000Z"
    }
  ]
}
```

### 6.4 配置 `package.json` 中的执行脚本
修改 `package.json` 的 `scripts` 字段，方便一键联调：

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "mock": "json-server --watch mock/db.json --port 4000",
  "start": "concurrently -n \"MOCK,VITE\" -c \"blue,green\" \"npm run mock\" \"npm run dev\""
}
```

---

## 7. 核心模块骨架设计与代码示例

### 7.1 类型定义 (`src/types/user.ts`)

```typescript
// 用户核心数据模型
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Developer' | 'Tester' | 'Product Manager';
  department: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

// 表单提交用数据结构（创建时无 id 与 createdAt）
export type UserFormData = Omit<User, 'id' | 'createdAt'>;

// 列表查询过滤参数
export interface UserQueryParams {
  search?: string;
  role?: string;
  status?: string;
  _page?: number;
  _limit?: number;
}
```

### 7.2 Axios 客户端封装 (`src/api/request.ts`)

```typescript
import axios from 'axios';

// 创建 Axios 实例
const request = axios.create({
  baseURL: 'http://localhost:4000', // Mock 服务地址
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 后续进阶：可在此处统一附加 Authorization Token
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 统一错误处理
    const message = error.response?.data?.message || error.message || '网络请求错误';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export default request;
```

### 7.3 用户 API 服务层 (`src/api/userService.ts`)

```typescript
import request from './request';
import { User, UserFormData, UserQueryParams } from '../types/user';

export const userService = {
  // 获取用户列表（支持筛选）
  getUsers: (params?: UserQueryParams): Promise<User[]> => {
    return request.get('/users', { params });
  },

  // 根据 ID 获取用户详情
  getUserById: (id: string): Promise<User> => {
    return request.get(`/users/${id}`);
  },

  // 创建新用户
  createUser: (data: UserFormData): Promise<User> => {
    const newUser = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    return request.post('/users', newUser);
  },

  // 更新用户信息
  updateUser: (id: string, data: Partial<UserFormData>): Promise<User> => {
    return request.patch(`/users/${id}`, data);
  },

  // 删除用户
  deleteUser: (id: string): Promise<void> => {
    return request.delete(`/users/${id}`);
  },
};
```

### 7.4 自定义 Hook：用户列表状态管理 (`src/hooks/useUsers.ts`)

```typescript
import { useState, useEffect, useCallback } from 'react';
import { User, UserQueryParams } from '../types/user';
import { userService } from '../api/userService';

export function useUsers(initialParams?: UserQueryParams) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<UserQueryParams>(initialParams || {});

  // 加载用户列表
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers(params);
      setUsers(data);
    } catch (err: any) {
      setError(err.message || '获取用户列表失败');
    } finally {
      setLoading(false);
    }
  }, [params]);

  // 依赖 params 改变触发自动加载
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 删除用户
  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      await userService.deleteUser(id);
      // 前端乐观更新或重新拉取
      setUsers((prev) => prev.filter((user) => user.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || '删除用户失败');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    params,
    setParams,
    refresh: fetchUsers,
    deleteUser,
  };
}
```

### 7.5 通用原子组件：按钮与确认弹窗

#### 1. 通用按钮 (`src/components/common/Button.tsx`)
```tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
};
```

#### 2. 通用确认弹窗 (`src/components/common/Modal.tsx`)
```tsx
import React from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
```

---

### 7.6 路由与主框架配置

#### 1. 顶部导航与主布局 (`src/components/layout/MainLayout.tsx`)
```tsx
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Users, PlusCircle } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              R
            </div>
            <span className="font-bold text-gray-900 text-lg">React Week 1 - CRUD System</span>
          </div>

          <nav className="flex items-center space-x-4">
            <Link
              to="/users"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                location.pathname === '/users'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>用户列表</span>
            </Link>
            <Link
              to="/users/new"
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>新增用户</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* 页面内容区域 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        CPA FSD Reskill Program - Week 1 React Fundamentals
      </footer>
    </div>
  );
};
```

#### 2. 路由表配置 (`src/router/index.tsx`)
```typescript
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import UserListPage from '../pages/UserListPage';
import UserDetailPage from '../pages/UserDetailPage';
import UserFormPage from '../pages/UserFormPage';
import NotFoundPage from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/users" replace />,
      },
      {
        path: 'users',
        element: <UserListPage />,
      },
      {
        path: 'users/new',
        element: <UserFormPage />,
      },
      {
        path: 'users/:id',
        element: <UserDetailPage />,
      },
      {
        path: 'users/:id/edit',
        element: <UserFormPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
```

#### 3. 应用根挂载 (`src/App.tsx`)
```typescript
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
```

---

## 8. 运行与调试步骤

在项目根目录 `react-crud-demo` 下运行：

```bash
# 方式 1：一键同时启动 Mock 后端 (端口 4000) 和 Vite 前端 (端口 5173)
npm run start

# 方式 2：分窗口启动
# 终端窗口 1（启动 Mock 服务）：
npm run mock

# 终端窗口 2（启动 Vite 前端）：
npm run dev
```

启动成功后：
- 前端页面访问：`http://localhost:5173/`
- Mock API 地址：`http://localhost:4000/users`

---

## 9. Week 1 核心能力达标自测清单

完成本项目后，应对照检查是否掌握以下核心能力：

- [ ] **TS + React 构建**：熟练在 JSX/TSX 中定义 Props 接口、State 泛型与事件处理函数类型。
- [ ] **Hooks 状态管理**：能熟练运用 `useState` 管理表单与列表，运用 `useEffect` 发起网络请求与清理副作用。
- [ ] **组件通信**：掌握父子组件通过 Props 传参、回调函数传参通知父组件刷新列表。
- [ ] **受控组件与表单**：实现表单项的双向绑定与提交前非空/格式校验。
- [ ] **REST 接口对接**：使用 Axios 完整实现列表获取(GET)、新增(POST)、编辑(PATCH/PUT)、删除(DELETE)。
- [ ] **SPA 路由导航**：熟练使用 `useNavigate` 进行页面跳转、`useParams` 获取 URL 参数。
- [ ] **加载与异常体验**：在页面中处理 Loading 加载态、Empty 空数据态与 Error 异常提示。
