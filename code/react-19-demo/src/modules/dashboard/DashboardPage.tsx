import { Suspense, useState, useTransition } from 'react';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { fetchDashboardData, type DashboardData } from '@/api/dashboard.api';
import { useI18n } from '@/context/I18nContext';
import { DashboardContent } from './DashboardContent';
import { DashboardSkeleton } from './DashboardSkeleton';
import { DashboardErrorFallback } from './DashboardErrorFallback';

export function DashboardPage() {
  const { t } = useI18n();

  // 统一的大模块 Promise 集合 (React 19 核心规范)
  const [dashboardDataPromise, setDashboardDataPromise] = useState<Promise<DashboardData>>(() =>
    fetchDashboardData()
  );
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      setDashboardDataPromise(fetchDashboardData());
    });
  };

  return (
    <div className="space-y-6">
      {/* 模块顶部标题与操作栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {t('dashboard.title')}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{t('dashboard.desc')}</p>
        </div>
        <Button
          type="primary"
          icon={<ReloadOutlined spin={isPending} />}
          onClick={handleRefresh}
          loading={isPending}
        >
          {isPending ? t('common.refreshing') : t('dashboard.refreshBtn')}
        </Button>
      </div>

      <ErrorBoundary
        fallback={<DashboardErrorFallback onRetry={handleRefresh} />}
        onReset={handleRefresh}
      >
        {/* 整个 Dashboard 下的十几个小组件，共用这一个 Ant Design 骨架屏 */}
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent promise={dashboardDataPromise} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
