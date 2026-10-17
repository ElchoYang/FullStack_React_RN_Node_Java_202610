import { AntdDashboardSkeleton } from '@/components/feedback/AntdSkeletonTemplates';

/**
 * 仪表盘骨架屏：直接复用 Ant Design 封装的大盘骨架
 * 无需手写数十行占位 DOM，开箱即用
 */
export function DashboardSkeleton() {
  return <AntdDashboardSkeleton />;
}
