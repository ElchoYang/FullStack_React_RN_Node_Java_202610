import type { UserRole, UserStatus } from '../types/user';

/**
 * 格式化 ISO 日期时间为易读字符串 (YYYY-MM-DD HH:mm:ss)
 */
export function formatDate(isoString?: string): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    const pad = (n: number) => n.toString().padStart(2, '0');
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    return `${y}-${m}-${d} ${hh}:${mm}`;
  } catch {
    return isoString;
  }
}

/**
 * 获取状态徽章的 Tailwind 样式类
 */
export function getStatusBadgeClass(status: UserStatus): string {
  return status === 'Active'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-rose-50 text-rose-700 border-rose-200';
}

/**
 * 获取角色徽章的 Tailwind 样式类
 */
export function getRoleBadgeClass(role: UserRole): string {
  switch (role) {
    case 'Admin':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Developer':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Tester':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Product Manager':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}
