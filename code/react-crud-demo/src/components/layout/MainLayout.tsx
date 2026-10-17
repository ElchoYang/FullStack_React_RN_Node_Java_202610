import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../hooks/useAuth';

export function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 antialiased">
      {/* 侧边导航栏 */}
      <Sidebar />

      {/* 右侧主内容区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} onLogout={handleLogout} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>

        <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
          <p>© 2026 CPA FSD Reskill Program • React 19 Modern Architecture</p>
        </footer>
      </div>
    </div>
  );
}

export default MainLayout;
