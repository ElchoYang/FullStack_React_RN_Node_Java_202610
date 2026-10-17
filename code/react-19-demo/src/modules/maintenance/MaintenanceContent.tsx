import { use } from 'react';
import type { MaintenanceModuleData } from '@/api/maintenance.api';
import { HealthHeader } from './components/HealthHeader';
import { ServerNodesGrid } from './components/ServerNodesGrid';
import { AlertFeed } from './components/AlertFeed';

export function MaintenanceContent({ promise }: { promise: Promise<MaintenanceModuleData> }) {
  // React 19 use(promise) 解包
  const data = use(promise);

  return (
    <div className="space-y-6">
      <HealthHeader
        score={data.overallHealthScore}
        activeNodes={data.totalActiveNodes}
        incidents={data.openIncidents}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ServerNodesGrid nodes={data.nodes} />
        </div>
        <div>
          <AlertFeed alerts={data.alerts} />
        </div>
      </div>
    </div>
  );
}
