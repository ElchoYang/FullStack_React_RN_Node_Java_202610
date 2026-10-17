import { use } from 'react';
import type { ArchitectureData } from '@/api/architecture.api';
import { FlowTimeline } from './components/FlowTimeline';
import { LayerCards } from './components/LayerCards';
import { ComparisonTable } from './components/ComparisonTable';
import { BestPractices } from './components/BestPractices';

export function ArchitectureContent({ promise }: { promise: Promise<ArchitectureData> }) {
  // 严格遵循 React 19 核心规范：use(promise) 解包
  const data = use(promise);

  return (
    <div className="space-y-8">
      {/* 1. 全生命周期流程线 */}
      <FlowTimeline steps={data.flowSteps} />

      {/* 2. 4 层分层架构 */}
      <LayerCards layers={data.layers} />

      {/* 3. 多模式深度对比矩阵 */}
      <ComparisonTable comparisons={data.comparisons} />

      {/* 4. 黄金设计法则与避坑指南 */}
      <BestPractices rules={data.coreDesignRules} />
    </div>
  );
}
