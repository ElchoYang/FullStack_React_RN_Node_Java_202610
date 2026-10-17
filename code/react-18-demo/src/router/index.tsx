import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/guard/ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { UserListPage } from '../pages/user/UserListPage';
import { UserDetailPage } from '../pages/user/UserDetailPage';
import { UserFormPage } from '../pages/user/UserFormPage';
import { ProductListPage } from '../pages/product/ProductListPage';
import { NotFoundPage } from '../pages/error/NotFoundPage';
import { ForbiddenPage } from '../pages/error/ForbiddenPage';

export const router = createBrowserRouter([
  // 1. 公开路由 (无需登录)
  {
    path: '/login',
    element: <LoginPage />,
  },

  // 2. 受保护的后台业务路由 (必须登录，由 ProtectedRoute 拦截)
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: <UserListPage />,
      },
      {
        path: 'users/new',
        element: <UserFormPage />,
      },
      {
        path: 'users/:id',
        element: <UserDetailPage />,
      },
      {
        path: 'users/:id/edit',
        element: <UserFormPage />,
      },
      {
        path: 'products',
        element: <ProductListPage />,
      },
    ],
  },

  // 3. 403 权限错误路由
  {
    path: '/403',
    element: <ForbiddenPage />,
  },

  // 4. 404 兜底路由
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
