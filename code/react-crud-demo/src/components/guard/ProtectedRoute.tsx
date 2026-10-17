import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string[]; // 可选：支持基于角色的权限判断 (RBAC)
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // 初始化鉴权状态读取中，展示 Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  // 1. 未登录：重定向到登录页，并通过 state 记录当前试图访问的路径
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. 权限不足：已登录但角色不符
  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  // 3. 鉴权通过：正常放行渲染子组件
  return <>{children}</>;
}

export default ProtectedRoute;
