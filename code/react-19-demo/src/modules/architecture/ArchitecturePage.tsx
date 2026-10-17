import { Suspense, useState, useTransition } from 'react';
import { Button, Space, Tag } from 'antd';
import { ReloadOutlined, BookOutlined } from '@ant-design/icons';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { fetchArchitectureData, type ArchitectureData } from '@/api/architecture.api';
import { useI18n } from '@/context/I18nContext';
import { ArchitectureContent } from './ArchitectureContent';
import { ArchitectureSkeleton } from './ArchitectureSkeleton';
import { ArchitectureErrorFallback } from './ArchitectureErrorFallback';

export function ArchitecturePage() {
  const { t } = useI18n();

  // 严格采用与业务模块完全一致的 React 19 核心规范
  const [archDataPromise, setArchDataPromise] = useState<Promise<ArchitectureData>>(() =>
    fetchArchitectureData()
  );
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      setArchDataPromise(fetchArchitectureData());
    });
  };

  return (
    <div className="space-y-6">
      {/* 顶部标题栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {t('architecture.title')}
            </h1>
            <Tag color="purple" className="font-semibold m-0">
              {t('architecture.tag')}
            </Tag>
          </div>
          <p className="text-sm text-slate-500 mt-1">{t('architecture.desc')}</p>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined spin={isPending} />}
            onClick={handleRefresh}
            loading={isPending}
          >
            {isPending ? t('common.loading') : t('architecture.refreshBtn')}
          </Button>
          <Tag icon={<BookOutlined />} color="blue" className="px-3 py-1 text-xs font-semibold">
            {t('architecture.officialBadge')}
          </Tag>
        </Space>
      </div>

      <ErrorBoundary
        fallback={<ArchitectureErrorFallback onRetry={handleRefresh} />}
        onReset={handleRefresh}
      >
        {/* 统一架构骨架屏 */}
        <Suspense fallback={<ArchitectureSkeleton />}>
          <ArchitectureContent promise={archDataPromise} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
