import { NavLink, Link } from 'react-router-dom';
import { Users, UserPlus, Layers } from 'lucide-react';

export function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/users" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-gray-900 text-lg tracking-tight block">
              React CRUD Demo
            </span>
            <span className="text-xs text-gray-400 font-medium -mt-1 block">
              Week 1 React Fundamentals (React 19)
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center space-x-3">
          <NavLink
            to="/users"
            end
            className={({ isActive }) =>
              `flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <Users className="w-4 h-4" />
            <span>用户列表</span>
          </NavLink>

          <Link
            to="/users/new"
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>新增用户</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
