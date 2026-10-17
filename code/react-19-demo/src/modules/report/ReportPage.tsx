import { Suspense, useState, useTransition } from 'react';
import { Button, Form, Modal, Radio, Select, Space, message } from 'antd';
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { fetchReportData, type ReportModuleData } from '@/api/report.api';
import { useI18n } from '@/context/I18nContext';
import { ReportContent } from './ReportContent';
import { ReportSkeleton } from './ReportSkeleton';
import { ReportErrorFallback } from './ReportErrorFallback';

export function ReportPage() {
  const { t } = useI18n();

  // 统一的报表模块 Promise 集合 (React 19 核心规范)
  const [reportPromise, setReportPromise] = useState<Promise<ReportModuleData>>(() =>
    fetchReportData()
  );
  const [isPending, startTransition] = useTransition();
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportForm] = Form.useForm();

  const handleRefresh = () => {
    startTransition(() => {
      setReportPromise(fetchReportData());
    });
  };

  const handleExportSubmit = async () => {
    try {
      const values = await exportForm.validateFields();
      // 使用动态变量插值: t('report.generatingMsg', { period, format })
      message.loading({
        content: t('report.generatingMsg', { period: values.period, format: values.format }),
        key: 'exporting',
      });
      setExportModalOpen(false);

      setTimeout(() => {
        message.success({ content: t('common.success'), key: 'exporting' });
      }, 1000);
    } catch {
      // 校验失败
    }
  };

  return (
    <div className="space-y-6">
      {/* 顶部标题栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('report.title')}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{t('report.desc')}</p>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined spin={isPending} />}
            onClick={handleRefresh}
            loading={isPending}
          >
            {isPending ? t('common.loading') : t('report.refreshBtn')}
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => setExportModalOpen(true)}
          >
            {t('report.exportQuick')}
          </Button>
        </Space>
      </div>

      <ErrorBoundary
        fallback={<ReportErrorFallback onRetry={handleRefresh} />}
        onReset={handleRefresh}
      >
        {/* 统一报表骨架屏 */}
        <Suspense fallback={<ReportSkeleton />}>
          <ReportContent promise={reportPromise} />
        </Suspense>
      </ErrorBoundary>

      {/* 快速导出弹窗 */}
      <Modal
        title={t('report.exportModalTitle')}
        open={exportModalOpen}
        onOk={handleExportSubmit}
        onCancel={() => setExportModalOpen(false)}
        okText={t('common.confirm')}
        cancelText={t('common.cancel')}
      >
        <Form
          form={exportForm}
          layout="vertical"
          initialValues={{ format: 'PDF', period: '2025Q1季度决算', scope: 'all' }}
          className="pt-3"
        >
          <Form.Item name="period" label={t('report.periodLabel')} rules={[{ required: true }]}>
            <Select
              options={[
                { value: '2025Q1季度决算', label: '2025 年 Q1 全科目季度决算' },
                { value: '2025年4月月报', label: '2025 年 4 月度经营收支流水' },
                { value: '2025年5月预估', label: '2025 年 5 月度实时利润概览' },
              ]}
            />
          </Form.Item>

          <Form.Item name="format" label={t('report.formatLabel')} rules={[{ required: true }]}>
            <Radio.Group>
              <Radio.Button value="PDF">PDF</Radio.Button>
              <Radio.Button value="EXCEL">Excel (.xlsx)</Radio.Button>
              <Radio.Button value="CSV">CSV</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="scope" label={t('report.scopeLabel')}>
            <Radio.Group>
              <Radio value="all">全业务线合并核算</Radio>
              <Radio value="rd">研发与基础架构专属</Radio>
              <Radio value="ops">市场与销售专属</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
