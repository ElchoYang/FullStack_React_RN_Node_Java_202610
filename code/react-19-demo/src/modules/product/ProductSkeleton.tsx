import { AntdCardSkeleton } from '@/components/feedback/AntdSkeletonTemplates';

/**
 * 借助 Ant Design 模板骨架，卡片网格骨架只需 1 行！
 */
export function ProductSkeleton() {
  return <AntdCardSkeleton count={6} />;
}
