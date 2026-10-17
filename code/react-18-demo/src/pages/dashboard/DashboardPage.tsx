import { Link } from 'react-router-dom';
import { Users, ShieldCheck, Activity, ArrowRight, Layers, Lock, Cpu } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { storage } from '../../utils/storage';
import type { CurrentUser } from '../../types/auth';

export function DashboardPage() {
  const { users, loading } = useUsers();
  const currentUser = storage.getUser<CurrentUser>();

  const activeUsersCount = users.filter((u) => u.status === 'Active').length;
  const adminUsersCount = users.filter((u) => u.role === 'Admin').length;

  const statCards = [
    {
      title: '团队成员总数',
      value: loading ? '-' : users.length,
      desc: '当前系统已注册用户',
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: '活跃账号',
      value: loading ? '-' : activeUsersCount,
      desc: '状态为 Active 的成员',
      icon: Activity,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: '系统管理员',
      value: loading ? '-' : adminUsersCount,
      desc: '具备管理员权限账号',
      icon: ShieldCheck,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  const architectureHighlights = [
    {
      title: '模块化工程架构',
      desc: 'api/、contexts/、hooks/、components/、pages/、utils/ 清晰分层隔离',
      icon: Layers,
    },
    {
      title: 'JWT 鉴权闭环',
      desc: '本地 Token 持久化存储与 Axios 自动挂载 Bearer Token，401 自动清理重定向',
      icon: Lock,
    },
    {
      title: '受保护路由守卫',
      desc: 'ProtectedRoute 拦截未登录访问，记录回跳路径，RBAC 角色权限支持',
      icon: ShieldCheck,
    },
    {
      title: '健壮性与安全边界',
      desc: 'React 19 错误边界 ErrorBoundary 防白屏，标准化 Loading 与 Empty 状态',
      icon: Cpu,
    },
  ];

  return (
    <div className="space-y-8">
      {/* 欢迎标语条 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
            <span>控制台概览</span>
            <span>•</span>
            <span>Week 2 生产级架构</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            欢迎回来，{currentUser?.name || '管理员'}！
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            当前系统已完成 Week 2 生产级工程架构分层，支持受保护路由守卫、JWT 鉴权拦截器与全局状态管理。
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-xs transition"
          >
            <Cpu className="w-4 h-4" />
            <span>大模型产品库</span>
          </Link>
          <Link
            to="/users"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition"
          >
            <span>用户管理</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 数据统计指标 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">
                  {card.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">{card.desc}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 架构特性卡片 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">架构进阶设计要点</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            符合企业级生产规范的前端分层设计与健壮性保障
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {architectureHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-5 rounded-xl border border-gray-100 bg-slate-50/60 hover:bg-slate-50 transition flex items-start space-x-4"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
