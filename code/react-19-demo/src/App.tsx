import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useI18nStore } from '@/store';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardPage } from '@/modules/dashboard/DashboardPage';
import { UserPage } from '@/modules/user/UserPage';
import { ProductPage } from '@/modules/product/ProductPage';
import { MaintenancePage } from '@/modules/maintenance/MaintenancePage';
import { ReportPage } from '@/modules/report/ReportPage';
import { ArchitecturePage } from '@/modules/architecture/ArchitecturePage';

export default function App() {
  // 采用 Zustand 状态管理库，细粒度订阅语言状态，零 Context 样板代码
  const antdLocale = useI18nStore((s) => s.getAntdLocale());

  return (
    <ConfigProvider
      locale={antdLocale}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="user" element={<UserPage />} />
            <Route path="product" element={<ProductPage />} />
            <Route path="maintenance" element={<MaintenancePage />} />
            <Route path="report" element={<ReportPage />} />
            <Route path="architecture" element={<ArchitecturePage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
