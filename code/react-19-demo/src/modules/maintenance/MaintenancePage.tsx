import { Suspense, useState, useTransition } from 'react';
import { Button, Space, Tag } from 'antd';
import { ReloadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { fetchMaintenanceData, type MaintenanceModuleData } from '@/api/maintenance.api';
import { useI18n } from '@/context/I18nContext';
import { MaintenanceContent } from './MaintenanceContent';
import { MaintenanceSkeleton } from './MaintenanceSkeleton';
import { MaintenanceErrorFallback } from './MaintenanceErrorFallback';

export function MaintenancePage() {
  const { t } = useI18n();

  // 统一的运维模块 Promise 集合 (React 19 核心规范)
  const [maintenancePromise, setMaintenancePromise] = useState<Promise<MaintenanceModuleData>>(
    () => fetchMaintenanceData()
  );
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      setMaintenancePromise(fetchMaintenanceData());
    });
  };

  return (
    <div className="space-y-6">
      {/* 顶部标题栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {t('maintenance.title')}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{t('maintenance.desc')}</p>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined spin={isPending} />}
            onClick={handleRefresh}
            loading={isPending}
          >
            {isPending ? t('common.loading') : t('maintenance.probeBtn')}
          </Button>
          <Tag icon={<CheckCircleOutlined />} color="success" className="px-3 py-1 font-semibold text-xs">
            {t('maintenance.engineOk')}
          </Tag>
        </Space>
      </div>

      <ErrorBoundary
        fallback={<MaintenanceErrorFallback onRetry={handleRefresh} />}
        onReset={handleRefresh}
      >
        {/* 统一运维骨架屏 */}
        <Suspense fallback={<MaintenanceSkeleton />}>
          <MaintenanceContent promise={maintenancePromise} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
