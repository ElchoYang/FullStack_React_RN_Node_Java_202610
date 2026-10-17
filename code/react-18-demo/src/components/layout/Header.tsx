import { LogOut, User as UserIcon, Bell } from 'lucide-react';
import type { CurrentUser } from '../../types/auth';

export interface HeaderProps {
  user?: CurrentUser | null;
  onLogout?: () => void;
  onToggleSidebar?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 左侧：页面/环境标识 */}
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              React 19 Advanced Admin
            </span>
            <span className="text-xs text-slate-400 hidden md:inline">
              Production Standard Architecture
            </span>
          </div>

          {/* 右侧：用户操作区 */}
          <div className="flex items-center space-x-4">
            {/* 消息通知占位 */}
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="系统通知"
            >
              <Bell className="w-5 h-5" />
            </button>

            {/* 用户身份与头像 */}
            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-xs shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-sm font-semibold text-slate-800 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {user.role} {user.department ? `· ${user.department}` : ''}
                  </span>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors ml-2 cursor-pointer"
                    title="退出登录"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>退出</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <UserIcon className="w-4 h-4" />
                <span>访客模式</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
