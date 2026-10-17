import { use } from 'react';
import type { ReportModuleData } from '@/api/report.api';
import { FinancialMetrics } from './components/FinancialMetrics';
import { ExportTaskTable } from './components/ExportTaskTable';

export function ReportContent({ promise }: { promise: Promise<ReportModuleData> }) {
  // React 19 use(promise) 解包
  const data = use(promise);

  return (
    <div className="space-y-6">
      <FinancialMetrics
        metrics={data.metrics}
        annualTargetProgress={data.annualTargetProgress}
      />
      <ExportTaskTable tasks={data.exportTasks} breakdown={data.monthlyBreakdown} />
    </div>
  );
}
