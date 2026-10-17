import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Cpu, ShieldCheck, Box } from 'lucide-react';

export interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const navItems = [
    {
      to: '/dashboard',
      label: '仪表盘概览',
      icon: LayoutDashboard,
    },
    {
      to: '/users',
      label: '用户管理 (CRUD)',
      icon: Users,
    },
    {
      to: '/products',
      label: '大模型产品库 (React 19)',
      icon: Cpu,
    },
  ];

  return (
    <aside
      className={`w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 ${className}`}
    >
      {/* 品牌标识 */}
      <div className="h-16 px-6 flex items-center space-x-3 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
          R
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white text-base tracking-tight leading-tight">
            React Advanced
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Week 2 Production</span>
        </div>
      </div>

      {/* 导航菜单 */}
      <div className="flex-1 py-6 px-3 space-y-1">
        <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          业务模块
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="px-3 pt-6 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          进阶特性
        </div>
        <div className="px-3.5 py-2 rounded-lg bg-slate-800/50 border border-slate-800 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center space-x-2 text-blue-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>JWT 鉴权 & 守卫已就绪</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <Box className="w-3.5 h-3.5" />
            <span>组件设计与工程分层</span>
          </div>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 text-center">
        CPA FSD Reskill Program 2026
      </div>
    </aside>
  );
}

export default Sidebar;
