import { http, HttpResponse, delay, passthrough } from 'msw';
import { useAppConfigStore } from '@/store';
import type { DashboardData } from '@/api/dashboard.api';
import type { UserModuleData, UserItem } from '@/api/user.api';
import type { ProductModuleData, ProductItem } from '@/api/product.api';
import type { MaintenanceModuleData } from '@/api/maintenance.api';
import type { ReportModuleData } from '@/api/report.api';
import type { ArchitectureData } from '@/api/architecture.api';

// 检查是否在 UI 中动态暂停了 Mock
function isMockDisabled() {
  const { enableMock } = useAppConfigStore.getState();
  return !enableMock;
}

// 帮助函数：应用 Zustand 中的实时延迟与模拟错误开关
async function handleConfig() {
  const { networkDelay, simulateError } = useAppConfigStore.getState();
  await delay(networkDelay);

  if (simulateError) {
    throw new HttpResponse(
      JSON.stringify({
        code: 500,
        message: '【MSW Service Worker 模拟 500】后端网关超时或数据库宕机',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// 初始假数据定义
const dashboardMockData: DashboardData = {
  metrics: [
    {
      id: '1',
      title: '总营业额 (GMV)',
      value: '¥ 1,284,520',
      change: '+18.2%',
      isPositive: true,
      description: '较上月增长',
    },
    {
      id: '2',
      title: '活跃用户数 (DAU)',
      value: '42,890',
      change: '+8.4%',
      isPositive: true,
      description: '较昨日增长',
    },
    {
      id: '3',
      title: '总订单量 (Orders)',
      value: '12,408',
      change: '-2.1%',
      isPositive: false,
      description: '较昨日略降',
    },
    {
      id: '4',
      title: '系统可用率 (SLA)',
      value: '99.98%',
      change: '+0.03%',
      isPositive: true,
      description: '近30天平均',
    },
  ],
  trends: [
    { month: '1月', revenue: 780000, orders: 8400 },
    { month: '2月', revenue: 920000, orders: 9800 },
    { month: '3月', revenue: 1100000, orders: 1200 },
    { month: '4月', revenue: 1040000, orders: 10500 },
    { month: '5月', revenue: 1180000, orders: 11800 },
    { month: '6月', revenue: 1284520, orders: 12408 },
  ],
  recentActivities: [
    { id: 'a1', user: '张伟', action: '提交了采购单 #PO-20250301-01', time: '5分钟前', type: 'order' },
    { id: 'a2', user: '系统告警', action: '边缘节点 Node-03 触发 CPU 负载预警 (88%)', time: '14分钟前', type: 'alert' },
    { id: 'a3', user: '李晓丽', action: '更新了企业管理员权限列表', time: '35分钟前', type: 'user' },
    { id: 'a4', user: '王建国', action: '导出了 2025Q1 财务综合汇总明细', time: '1小时前', type: 'system' },
    { id: 'a5', user: '陈浩', action: '上线了「限时折扣」营销活动', time: '2小时前', type: 'order' },
  ],
  systemLoad: 42,
  lastUpdated: new Date().toLocaleTimeString(),
};

const userMockData: UserModuleData = {
  stats: {
    totalUsers: 148,
    activeUsers: 132,
    pendingInvites: 9,
    suspendedUsers: 7,
  },
  departments: ['全部', '技术研发部', '产品运营部', '市场商务部', '财务风控部', '综合人事部'],
  users: [
    {
      id: 'u-101',
      name: '张三丰',
      email: 'zhang.sf@company.com',
      role: '超级管理员',
      department: '技术研发部',
      status: 'active',
      lastLogin: '2025-05-18 10:23',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 'u-102',
      name: '李莫愁',
      email: 'li.mc@company.com',
      role: '部门主管',
      department: '产品运营部',
      status: 'active',
      lastLogin: '2025-05-18 09:12',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 'u-103',
      name: '令狐冲',
      email: 'linghu.c@company.com',
      role: '普通员工',
      department: '市场商务部',
      status: 'active',
      lastLogin: '2025-05-17 18:40',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 'u-104',
      name: '任盈盈',
      email: 'ren.yy@company.com',
      role: '审计员',
      department: '财务风控部',
      status: 'active',
      lastLogin: '2025-05-18 08:50',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 'u-105',
      name: '郭靖',
      email: 'guo.j@company.com',
      role: '普通员工',
      department: '技术研发部',
      status: 'pending',
      lastLogin: '未激活',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 'u-106',
      name: '黄蓉',
      email: 'huang.r@company.com',
      role: '部门主管',
      department: '综合人事部',
      status: 'active',
      lastLogin: '2025-05-18 11:05',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 'u-107',
      name: '欧阳锋',
      email: 'ouyang.f@company.com',
      role: '普通员工',
      department: '市场商务部',
      status: 'suspended',
      lastLogin: '2025-05-01 14:20',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
  ],
};

const productMockData: ProductModuleData = {
  summary: {
    totalSkus: 842,
    totalInventoryValuation: 3582400,
    lowStockAlerts: 14,
    topSellingCategory: '数码智能',
  },
  categories: ['全部', '数码智能', '办公外设', '网络通信', '智能家居', '配件耗材'],
  products: [
    {
      id: 'p-1',
      name: 'ProCloud 企业级 Wi-Fi 7 双频无线路由器',
      sku: 'NET-WF7-092',
      category: '网络通信',
      price: 1899,
      stock: 142,
      sales: 890,
      status: 'in_stock',
      rating: 4.9,
    },
    {
      id: 'p-2',
      name: 'UltraVision 4K 144Hz 专业色彩剪辑显示器',
      sku: 'DISP-4K-27P',
      category: '数码智能',
      price: 3499,
      stock: 18,
      sales: 420,
      status: 'low_stock',
      rating: 4.8,
    },
    {
      id: 'p-3',
      name: 'ErgoMaster 磁吸人体工学无线机械键盘',
      sku: 'ACC-KB-M01',
      category: '办公外设',
      price: 699,
      stock: 350,
      sales: 1540,
      status: 'in_stock',
      rating: 4.7,
    },
    {
      id: 'p-4',
      name: 'SmartSensor 工业级温湿度巡检采集网关',
      sku: 'IOT-GW-V2',
      category: '智能家居',
      price: 450,
      stock: 5,
      sales: 210,
      status: 'low_stock',
      rating: 4.6,
    },
    {
      id: 'p-5',
      name: 'PowerHub 140W 氮化镓六合一智能桌面供电坞',
      sku: 'PWR-GAN-140',
      category: '配件耗材',
      price: 399,
      stock: 0,
      sales: 2900,
      status: 'out_of_stock',
      rating: 4.9,
    },
    {
      id: 'p-6',
      name: 'SecureToken 企业级硬件 FIDO2 身份认证密钥',
      sku: 'SEC-KEY-03',
      category: '办公外设',
      price: 199,
      stock: 520,
      sales: 4100,
      status: 'in_stock',
      rating: 4.9,
    },
  ],
};

const maintenanceMockData: MaintenanceModuleData = {
  overallHealthScore: 96.4,
  totalActiveNodes: 12,
  openIncidents: 1,
  nodes: [
    {
      id: 'node-bj-01',
      name: '华北主核心集群 (bj-core-01)',
      region: '北京可用区A',
      ip: '10.200.14.12',
      cpu: 48,
      memory: 64,
      disk: 52,
      status: 'healthy',
      uptime: '98天 14小时',
    },
    {
      id: 'node-sh-02',
      name: '华东API网关集群 (sh-gw-02)',
      region: '上海可用区B',
      ip: '10.201.8.84',
      cpu: 82,
      memory: 89,
      disk: 71,
      status: 'warning',
      uptime: '45天 02小时',
    },
    {
      id: 'node-sz-03',
      name: '华南数据库主备 (sz-db-primary)',
      region: '深圳可用区C',
      ip: '10.202.3.19',
      cpu: 35,
      memory: 76,
      disk: 44,
      status: 'healthy',
      uptime: '180天 21小时',
    },
    {
      id: 'node-hk-04',
      name: '海外加速CDN中继 (hk-edge-04)',
      region: '中国香港',
      ip: '172.16.50.2',
      cpu: 29,
      memory: 42,
      disk: 38,
      status: 'healthy',
      uptime: '62天 08小时',
    },
  ],
  alerts: [
    {
      id: 'alt-1',
      timestamp: '10:42:15',
      level: 'warn',
      source: 'sh-gw-02',
      message: 'TCP 并发连接数突破阈值预警值 (8,500 conn/s)',
    },
    {
      id: 'alt-2',
      timestamp: '10:15:30',
      level: 'info',
      source: 'Auto-Scaler',
      message: '自动扩容引擎完成 2 组 Kubernetes Pod 副本扩展',
    },
    {
      id: 'alt-3',
      timestamp: '09:50:04',
      level: 'error',
      source: 'Redis-Cluster',
      message: '从节点 Sentinel 发现短暂网络抖动 (已自动恢复)',
    },
    {
      id: 'alt-4',
      timestamp: '08:30:00',
      level: 'info',
      source: 'Backup-Job',
      message: '每日凌晨增量快照冷备份成功归档至对象存储',
    },
  ],
};

const reportMockData: ReportModuleData = {
  annualTargetProgress: 76.5,
  metrics: [
    {
      title: '总营业净收入 (Net Income)',
      amount: '¥ 8,924,100',
      quarterComparison: '+14.5% 同比',
      status: 'up',
    },
    {
      title: '运营与基础架构支出 (OPEX)',
      amount: '¥ 2,140,800',
      quarterComparison: '-5.2% 优化控制',
      status: 'down',
    },
    {
      title: '经营性利润率 (EBITDA)',
      amount: '38.2%',
      quarterComparison: '+2.8% 环比',
      status: 'up',
    },
    {
      title: '研发与创新投入 (R&D)',
      amount: '¥ 1,850,000',
      quarterComparison: '+8.0% 持续扩充',
      status: 'up',
    },
  ],
  monthlyBreakdown: [
    { month: '2025-01', income: 1400000, cost: 420000, profit: 980000 },
    { month: '2025-02', income: 1550000, cost: 460000, profit: 1090000 },
    { month: '2025-03', income: 1820000, cost: 490000, profit: 1330000 },
    { month: '2025-04', income: 1750000, cost: 480000, profit: 1270000 },
    { month: '2025-05', income: 1980000, cost: 510000, profit: 1470000 },
  ],
  exportTasks: [
    {
      id: 'exp-881',
      name: '2025Q1财年季度决算全科目分析报告',
      format: 'PDF',
      size: '14.2 MB',
      requestedBy: '王总 (CFO)',
      status: 'completed',
      date: '2025-05-18 09:30',
    },
    {
      id: 'exp-882',
      name: '4月份各大区渠道销售明细与退货对账单',
      format: 'EXCEL',
      size: '6.8 MB',
      requestedBy: '张主管 (销售总监)',
      status: 'completed',
      date: '2025-05-17 16:20',
    },
    {
      id: 'exp-883',
      name: '全站用户月度留存行为漏斗统计分析',
      format: 'CSV',
      size: '38.5 MB',
      requestedBy: '陈组长 (数据分析师)',
      status: 'processing',
      date: '2025-05-18 11:15',
    },
  ],
};

const architectureMockData: ArchitectureData = {
  projectName: 'react-19-demo',
  version: '1.0.0',
  reactVersion: '19.2.x',
  layers: [
    {
      name: '第 1 层：页面容器层 (Page Container)',
      role: '生命周期隔离 & 异步边界组织',
      files: ['DashboardPage.tsx', 'UserPage.tsx', 'ProductPage.tsx', 'MaintenancePage.tsx', 'ReportPage.tsx'],
      description: '负责创建稳定的 Promise 实例、定义 startTransition 刷新函数，并组装 ErrorBoundary 与 Suspense 骨架屏插槽。',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      name: '第 2 层：状态反馈与容错层 (Feedback Boundary)',
      role: '全局与模块级状态保障',
      files: ['ErrorBoundary.tsx', 'CommonErrorFallback.tsx', 'AntdSkeletonTemplates.tsx'],
      description: '负责接管数据处于 Pending 时的骨架屏占位（Suspense）以及 Rejected 时的降级重试交互（ErrorBoundary）。',
      color: 'from-amber-500 to-orange-600',
    },
    {
      name: '第 3 层：业务内容层 (Content Component)',
      role: '纯粹的 Happy-Path 业务渲染',
      files: ['DashboardContent.tsx', 'UserContent.tsx', 'ProductContent.tsx', 'MaintenanceContent.tsx', 'ReportContent.tsx'],
      description: '直接调用 React 19 原生 const data = use(promise) 解包，无需 if (loading) 样板代码。',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      name: '第 4 层：全局状态与数据请求层 (Zustand & Axios & MSW)',
      role: '状态中心与真网络拦截引擎',
      files: ['useI18nStore.ts', 'useAppConfigStore.ts', 'axiosInstance.ts', 'msw handlers.ts'],
      description: 'Zustand 接管持久化配置，Axios 发起标准 HTTP 通信，MSW (Service Worker) 在浏览器网络层做无侵入真实拦截。',
      color: 'from-purple-500 to-violet-600',
    },
  ],
  flowSteps: [
    {
      step: 1,
      title: 'Promise 初始化 (引用保持)',
      status: 'pending',
      detail: '页面挂载时调用 useState(() => fetchFn()) 创建 Promise，确保在重渲染周期中引用稳定，杜绝循环挂起。',
      codeSnippet: 'const [dataPromise, setDataPromise] = useState(() => userApi.getList());',
    },
    {
      step: 2,
      title: '命中 Suspense (激活骨架屏)',
      status: 'pending',
      detail: '子组件在数据尚未到达前抛出 Promise，React 调度器自动捕获并在该层级渲染 fallback 对应的 Ant Design 骨架屏。',
      codeSnippet: '<Suspense fallback={<AntdTableSkeleton />}>\n  <UserContent promise={dataPromise} />\n</Suspense>',
    },
    {
      step: 3,
      title: 'use(promise) 解包 (数据送达)',
      status: 'resolved',
      detail: 'Promise 变为 Fulfilled 状态后，React 恢复 Content 组件执行。use() 同步返回解包后的业务数据。',
      codeSnippet: 'export function UserContent({ promise }) {\n  const data = use(promise); // 数据直接可用！\n  return <UserTable users={data.users} />;\n}',
    },
    {
      step: 4,
      title: 'startTransition 刷新 (平滑无闪烁)',
      status: 'transition',
      detail: '用户点击刷新时，把新 Promise 放入 startTransition 中。旧界面保持可见并展示加载指示器，避免整屏闪烁。',
      codeSnippet: 'const [isPending, startTransition] = useTransition();\nconst refresh = () => startTransition(() => {\n  setDataPromise(userApi.getList());\n});',
    },
    {
      step: 5,
      title: 'ErrorBoundary 捕获 (故障降级与重试)',
      status: 'rejected',
      detail: '若 Axios 响应 500 或 403，Promise 被 Reject，异常自动冒泡被外层 ErrorBoundary 拦截并展示 Ant Design Result 重试视图。',
      codeSnippet: '<ErrorBoundary fallback={<UserErrorFallback onRetry={refresh} />} />',
    },
  ],
  comparisons: [
    {
      dimension: '样板代码量',
      traditional: '高 (useEffect + useState + 3个中间状态)',
      react19Use: '极低 (只需一个 use(promise) 直接解包)',
      dataRouter: '中等 (需编写 loader、defer、Await 组件)',
      winner: 'react19',
    },
    {
      dimension: '网络层真实度',
      traditional: '普通 Mock 侵入业务代码',
      react19Use: '结合 MSW：F12 浏览器网络面板 100% 真实显示 HTTP 请求',
      dataRouter: '依赖网络请求',
      winner: 'react19',
    },
    {
      dimension: '组件自治与可复用性',
      traditional: '较高 (可封装在自定义 Hook 内)',
      react19Use: '极高 (Page/Content 自成一体，随时可放进弹窗或抽屉)',
      dataRouter: '较低 (强绑定 useLoaderData，脱离路由报错)',
      winner: 'react19',
    },
  ],
  coreDesignRules: [
    {
      rule: '法则一：切勿在 Render 顶层裸写 api.get()',
      explanation: '在组件内部如果直接写 const p = api.get()，每次组件被挂起或父级更新，都会创建全新的 Promise 实例，导致死循环。',
      badExample: 'export function Page() {\n  const p = api.get(); // ❌ 每次重渲染都产生新 Promise\n  return <Content promise={p} />;\n}',
      goodExample: 'export function Page() {\n  const [p, setP] = useState(() => api.get()); // ✅ 稳定引用\n  return <Content promise={p} />;\n}',
    },
    {
      rule: '法则二：使用 startTransition 驱动 Promise 更新',
      explanation: '当数据需要重新拉取（如点击刷新、分页、筛选）时，若直接更新 Promise 会导致整个页面瞬间退回 Suspense 骨架屏。',
      badExample: 'const onRefresh = () => setP(api.get()); // ❌ 闪烁白屏/骨架屏',
      goodExample: 'const [isPending, startTransition] = useTransition();\nconst onRefresh = () => startTransition(() => setP(api.get())); // ✅ 平滑过渡',
    },
  ],
};

/**
 * MSW 标准 HTTP 请求拦截器集合
 * 结合 passthrough() 支持在 UI 界面中实时开启/暂停 Mock，无需刷新页面
 */
export const handlers = [
  // 1. 仪表盘
  http.get('/api/dashboard', async () => {
    if (isMockDisabled()) return passthrough();
    await handleConfig();
    return HttpResponse.json(dashboardMockData);
  }),

  // 2. 用户模块
  http.get('/api/users', async () => {
    if (isMockDisabled()) return passthrough();
    await handleConfig();
    return HttpResponse.json(userMockData);
  }),
  http.post('/api/users', async ({ request: req }) => {
    if (isMockDisabled()) return passthrough();
    await handleConfig();
    const newUser = (await req.json()) as Partial<UserItem>;
    return HttpResponse.json({
      id: `u-${Date.now()}`,
      status: 'active',
      lastLogin: '刚刚创建',
      ...newUser,
    });
  }),

  // 3. 商品中心
  http.get('/api/products', async () => {
    if (isMockDisabled()) return passthrough();
    await handleConfig();
    return HttpResponse.json(productMockData);
  }),
  http.post('/api/products', async ({ request: req }) => {
    if (isMockDisabled()) return passthrough();
    await handleConfig();
    const newProd = (await req.json()) as Partial<ProductItem>;
    return HttpResponse.json({
      id: `p-${Date.now()}`,
      sales: 0,
      rating: 5,
      ...newProd,
    });
  }),

  // 4. 运维与集群监控
  http.get('/api/maintenance', async () => {
    if (isMockDisabled()) return passthrough();
    await handleConfig();
    return HttpResponse.json(maintenanceMockData);
  }),

  // 5. 报表与决算
  http.get('/api/reports', async () => {
    if (isMockDisabled()) return passthrough();
    await handleConfig();
    return HttpResponse.json(reportMockData);
  }),

  // 6. 架构解析
  http.get('/api/architecture', async () => {
    if (isMockDisabled()) return passthrough();
    await handleConfig();
    return HttpResponse.json(architectureMockData);
  }),
];
