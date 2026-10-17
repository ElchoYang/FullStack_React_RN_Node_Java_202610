import { request } from './client';

export interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  description: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  type: 'order' | 'system' | 'user' | 'alert';
}

export interface SalesTrend {
  month: string;
  revenue: number;
  orders: number;
}

export interface DashboardData {
  metrics: DashboardMetric[];
  trends: SalesTrend[];
  recentActivities: ActivityItem[];
  systemLoad: number;
  lastUpdated: string;
}

/**
 * 真实网络请求（由 Axios 发出，由 MSW Service Worker 拦截）
 */
export function fetchDashboardData(): Promise<DashboardData> {
  return request.get<DashboardData>('/dashboard');
}
