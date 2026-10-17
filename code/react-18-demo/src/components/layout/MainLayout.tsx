import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        <p>© 2026 CPA FSD Reskill Program • React 19 Modern Architecture</p>
      </footer>
    </div>
  );
}

export default MainLayout;
