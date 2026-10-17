import { request } from './client';

export interface FinancialMetric {
  title: string;
  amount: string;
  quarterComparison: string;
  status: 'up' | 'down';
}

export interface ExportTask {
  id: string;
  name: string;
  format: 'PDF' | 'EXCEL' | 'CSV';
  size: string;
  requestedBy: string;
  status: 'completed' | 'processing' | 'failed';
  date: string;
}

export interface MonthlyBreakdown {
  month: string;
  income: number;
  cost: number;
  profit: number;
}

export interface ReportModuleData {
  metrics: FinancialMetric[];
  monthlyBreakdown: MonthlyBreakdown[];
  exportTasks: ExportTask[];
  annualTargetProgress: number;
}

/**
 * 真实网络请求（由 Axios 发出，由 MSW Service Worker 拦截）
 */
export function fetchReportData(): Promise<ReportModuleData> {
  return request.get<ReportModuleData>('/reports');
}
