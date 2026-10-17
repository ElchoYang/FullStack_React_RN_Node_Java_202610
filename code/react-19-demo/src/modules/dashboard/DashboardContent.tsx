import { use } from 'react';
import type { DashboardData } from '@/api/dashboard.api';
import { StatCards } from './components/StatCards';
import { RevenueChart } from './components/RevenueChart';
import { ActivityList } from './components/ActivityList';

export function DashboardContent({ promise }: { promise: Promise<DashboardData> }) {
  // React 19 核心解包方式
  const data = use(promise);

  return (
    <div className="space-y-6">
      {/* 统一的大模块数据解包后分发至子组件 */}
      <StatCards metrics={data.metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart trends={data.trends} />
        </div>
        <div>
          <ActivityList activities={data.recentActivities} />
        </div>
      </div>
    </div>
  );
}
