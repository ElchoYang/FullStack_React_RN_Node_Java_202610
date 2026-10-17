import { AntdTableSkeleton } from '@/components/feedback/AntdSkeletonTemplates';

/**
 * 借助 Ant Design 官方规范，表格骨架只需 1 行开箱即用！
 * 大幅减少手工拼接 div 占位符的工作量
 */
export function UserSkeleton() {
  return <AntdTableSkeleton rows={7} />;
}
