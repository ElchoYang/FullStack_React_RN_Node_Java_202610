import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Activity,
  FileBarChart2,
  Layers,
  Code2,
  Workflow,
  Sparkles,
} from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

export function Sidebar() {
  const { t } = useI18n();

  const navItems = [
    {
      to: '/dashboard',
      label: t('nav.dashboard'),
      en: t('nav.dashboardDesc'),
      icon: LayoutDashboard,
      badge: t('nav.dashboardBadge'),
    },
    {
      to: '/user',
      label: t('nav.user'),
      en: t('nav.userDesc'),
      icon: Users,
      badge: t('nav.userBadge'),
    },
    {
      to: '/product',
      label: t('nav.product'),
      en: t('nav.productDesc'),
      icon: Package,
      badge: t('nav.productBadge'),
    },
    {
      to: '/maintenance',
      label: t('nav.maintenance'),
      en: t('nav.maintenanceDesc'),
      icon: Activity,
      badge: t('nav.maintenanceBadge'),
    },
    {
      to: '/report',
      label: t('nav.report'),
      en: t('nav.reportDesc'),
      icon: FileBarChart2,
      badge: t('nav.reportBadge'),
    },
    {
      to: '/architecture',
      label: t('nav.architecture'),
      en: t('nav.architectureDesc'),
      icon: Workflow,
      badge: t('nav.architectureBadge'),
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-screen flex flex-col border-r border-slate-800 shrink-0">
      {/* Brand logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">{t('nav.title')}</h2>
            <p className="text-xs text-slate-400 font-mono">{t('nav.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1.5">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>{t('nav.modulesCategory')}</span>
          <span className="text-[10px] text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/40">
            {t('nav.moduleCount')}
          </span>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isArch = item.to === '/architecture';
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? isArch
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                      : 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isArch ? 'text-indigo-300' : ''
                  }`}
                />
                <div className="flex flex-col text-left">
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {isArch && <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono leading-none group-hover:text-slate-200">
                    {item.en}
                  </span>
                </div>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded border ${
                  isArch
                    ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/50'
                }`}
              >
                {item.badge}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer architecture clickable note */}
      <NavLink
        to="/architecture"
        className="block p-4 border border-indigo-500/30 m-3 rounded-xl bg-gradient-to-b from-slate-800/80 to-slate-900 hover:border-indigo-500/60 transition group cursor-pointer"
      >
        <div className="flex items-center justify-between text-xs text-indigo-300 font-medium mb-1">
          <div className="flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>{t('nav.archFooterTitle')}</span>
          </div>
          <span className="text-[10px] text-slate-400 group-hover:text-white transition font-mono">
            {t('nav.archFooterDetails')}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
          Page(Promise)
          <br />
          ↳ ErrorBoundary
          <br />
          &nbsp;&nbsp;↳ Suspense
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;↳ Content: use(promise)
        </p>
      </NavLink>
    </aside>
  );
}
