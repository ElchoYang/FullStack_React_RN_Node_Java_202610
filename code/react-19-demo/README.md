# React 19 `use(promise)` + Ant Design 企业级架构工程示例

本项目基于 **React 19** + **Axios** + **MSW 3 (Mock Service Worker)** + **Ant Design 5** + **Zustand 5** + **TypeScript** + **Vite** + **Tailwind CSS v4** + **React Router v7** 构建，完整落地了 React 19 全新的声明式异步数据获取架构：`use(promise) + Suspense + ErrorBoundary`，由 MSW 在浏览器网络层无侵入拦截 Axios 请求并与 Zustand 状态中心联动，结合 Ant Design 大幅简化骨架屏与 UI 交互成本。

---

## 🛠️ 从零初始化与安装命令 (Full Setup Guide)

如果您希望复刻或在全新环境中从零搭建该项目，请按以下步骤依次执行：

### 1. 使用 Vite 创建 React 19 + TypeScript 脚手架
```bash
# 在项目存放目录下执行
npm create vite@latest react-19-demo -- --template react-ts

# 进入工程目录
cd react-19-demo
```

### 2. 安装项目运行时核心依赖
包含 React Router、UI 组件库、状态管理与网络请求客户端：
```bash
npm install antd @ant-design/icons axios zustand react-router-dom lucide-react
```

### 3. 安装开发与样式依赖
包含 Tailwind CSS v4 及 Vite 官方插件、Mock Service Worker：
```bash
npm install -D tailwindcss @tailwindcss/vite msw
```

### 4. 初始化 MSW (Mock Service Worker) 浏览器端脚本
```bash
# 将 mockServiceWorker.js 注入到 public/ 目录中并保存配置
npx msw init public/ --save
```

---

## 🚀 启动与调试命令

现成项目拉取后，仅需以下命令即可启动：

```bash
# 1. 安装已有依赖
npm install

# 2. 启动本地开发服务 (默认开启 MSW Mock，端口 5173)
npm run dev

# 3. 启动直连真实后端模式 (暂停 MSW 拦截，所有接口穿透直连实际服务器)
npm run dev:no-mock

# 4. 生产环境打包构建 (严格 TypeScript 类型检查 + 生产构建优化)
npm run build

# 5. 本地预览打包产物
npm run preview
```

---

## 🌟 核心设计理念

### 1. 为什么结合 Ant Design？
在原生开发中，为了给每个页面写高保真骨架屏，通常需要手动手写大量 DOM 占位块；引入 Ant Design 后：
- **骨架屏一行开箱即用**：利用 `Skeleton.Input`、`Skeleton.Button`、`Skeleton` 封装通用版式骨架（`AntdTableSkeleton`、`AntdCardSkeleton`、`AntdDashboardSkeleton`）；
- **容错降级极简**：`ErrorBoundary` 降级卡片直接结合 Ant Design 的 `<Result status="error">`，自带企业级视觉与一键重试按钮；
- **全站中文环境与主题**：`App.tsx` 统一包裹 `ConfigProvider` 配置 `zhCN` 本地化与现代蓝主色调。

### 2. 传统模式 vs React 19 `use(promise)` 模式

| 维度 | 传统模式 (React 16~18) | React 19 `use(promise)` + Ant Design 范式 |
| :--- | :--- | :--- |
| **状态管理** | 需要手写 `isLoading`, `data`, `error` 3个状态 | **仅需传递 Promise**，`const data = use(promise)` 直接解包 |
| **异步捕获** | `useEffect(() => { ... }, [])` + 防抖/竞争检查 | 依赖 React 调度机制原生挂起 (Suspense) |
| **加载骨架屏** | 堆砌 `if (loading) return <Spin />` 或手动写几十行占位 DOM | **外层 `<Suspense fallback={<AntdTableSkeleton />}>` 一行接管** |
| **异常降级** | `try / catch` + 手写错误展示分支 | **外层 `<ErrorBoundary>` 拦截，渲染 `<Result status="error" />`** |
| **重试与刷新** | 重新调用 fetch 并手动更新状态 | 结合 `startTransition` 更新 Promise，无全屏白屏闪烁 |

---

## 📐 页面架构规范

以 **DashboardPage** 为例，每个模块遵循严格的三层架构分离：

```tsx
export function DashboardPage() {
  // 1. 统一的大模块 Promise 集合 (单次渲染引用稳定)
  const [dashboardDataPromise, setDashboardDataPromise] = useState<Promise<DashboardData>>(() =>
    fetchDashboardData()
  );
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    // 2. startTransition 刷新：平滑更新 Promise，不导致整个页面闪烁骨架屏
    startTransition(() => {
      setDashboardDataPromise(fetchDashboardData());
    });
  };

  return (
    <ErrorBoundary fallback={<DashboardErrorFallback onRetry={handleRefresh} />}>
      {/* 3. 整个 Dashboard 下的十几个小组件，共用 Ant Design 封装的大盘骨架屏 */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent promise={dashboardDataPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

```tsx
export function DashboardContent({ promise }: { promise: Promise<DashboardData> }) {
  // 4. React 19 核心：直接解包获取数据，数据必达
  const data = use(promise);

  return (
    <div className="space-y-6">
      <StatCards metrics={data.metrics} />
      <RevenueChart trends={data.trends} />
      <ActivityList activities={data.recentActivities} />
    </div>
  );
}
```

---

## 🗂️ 模块划分

工程涵盖完整的 6 大企业级业务与架构模块：

1. **仪表盘大屏 (`/dashboard` - `DashboardPage`)**
   - 包含 4 项关键运营指标卡片、6个月走势柱状图、Ant Design `Timeline` 实时动态流。
   - 使用统一的大盘骨架屏 `AntdDashboardSkeleton`。
2. **用户与组织架构 (`/user` - `UserPage`)**
   - 包含员工状态统计、Ant Design 标准 `Table`（分页/搜索/筛选/头像）、角色彩色徽章。
   - 复用通用表格骨架屏 `AntdTableSkeleton`。
3. **商品与库存中心 (`/product` - `ProductPage`)**
   - 包含 SKU 资产估值、`Segmented` 分类切换、Ant Design `Badge.Ribbon` 缎带卡片网格、评分 `Rate`。
   - 复用通用卡片网格骨架屏 `AntdCardSkeleton`。
4. **运维与集群监控 (`/maintenance` - `MaintenancePage`)**
   - 包含系统可用性仪表盘环形进度 `Progress`、跨可用区节点 CPU/内存进度条、Ant Design `List` 审计告警流。
5. **报表与决算中心 (`/report` - `ReportPage`)**
   - 包含财报收入/支出核算、全财年目标进度条、Ant Design `Table` 异步导出队列与历史记录。
6. **项目架构解析 (`/architecture` - `ArchitecturePage`)**
   - 包含 Ant Design `Steps` 展示 React 19 异步执行全生命周期时间线、工程 4 层分层架构、3 种模式多维横评与黄金避坑法则。

---

## 🧪 交互式验证与 UI 动态 Mock 控制

顶部导航栏（Header）内置了 Ant Design 交互控制面板：
- **Mock 服务开关 (`Switch`)**：随时在界面上开启/暂停 MSW 拦截服务；开启时返回 Mock 模拟数据，暂停时所有请求基于 MSW `passthrough()` 自动放行直连后端。
- **模拟延迟调节器 (`Select`)**：可在 `300ms (极速)`、`800ms (平滑)`、`1500ms (慢速)`、`2500ms (超长)` 间即时切换，体验 Ant Design 骨架屏的动态波纹与过渡效果。
- **模拟接口报错开关 (`Switch`)**：一键开启后，点击页面上的任意“刷新”或切换路由，将立刻触发各模块的 `ErrorBoundary`，展示标准 `Result` 错误降级卡片与一键重试。

---

## ⚙️ Mock 环境变量配置 (开启 / 暂停)

支持环境变量（构建级）与 UI 界面（运行时）双层控制：

- **`.env.development`**：本地开发环境（默认 `VITE_ENABLE_MOCK=true`，开启 Mock）
- **`.env.production`**：生产打包环境（默认 `VITE_ENABLE_MOCK=false`，自动关闭 Mock 直连后端）
- **`.env.no-mock`**：无 Mock 直连模式（配置 `VITE_ENABLE_MOCK=false`）
- **`.env`**：基础环境配置文件（默认 `VITE_API_BASE_URL=/api`）
