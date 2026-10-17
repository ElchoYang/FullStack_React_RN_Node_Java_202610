import { request } from './client';

export interface ServerNode {
  id: string;
  name: string;
  region: string;
  ip: string;
  cpu: number;
  memory: number;
  disk: number;
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
}

export interface AlertLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  source: string;
  message: string;
}

export interface MaintenanceModuleData {
  nodes: ServerNode[];
  alerts: AlertLog[];
  overallHealthScore: number;
  totalActiveNodes: number;
  openIncidents: number;
}

/**
 * 真实网络请求（由 Axios 发出，由 MSW Service Worker 拦截）
 */
export function fetchMaintenanceData(): Promise<MaintenanceModuleData> {
  return request.get<MaintenanceModuleData>('/maintenance');
}
