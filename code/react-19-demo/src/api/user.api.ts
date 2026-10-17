import { request } from './client';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: '超级管理员' | '部门主管' | '普通员工' | '审计员';
  department: string;
  status: 'active' | 'suspended' | 'pending';
  lastLogin: string;
  avatar: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  pendingInvites: number;
  suspendedUsers: number;
}

export interface UserModuleData {
  users: UserItem[];
  stats: UserStats;
  departments: string[];
}

/**
 * 真实网络请求（由 Axios 发出，由 MSW Service Worker 拦截）
 */
export function fetchUserData(): Promise<UserModuleData> {
  return request.get<UserModuleData>('/users');
}

/**
 * 生产真实接口调用示例（基于 Axios）
 */
export const userApi = {
  getList: () => request.get<UserModuleData>('/users'),
  create: (user: Partial<UserItem>) => request.post<UserItem>('/users', user),
  update: (id: string, user: Partial<UserItem>) => request.put<UserItem>(`/users/${id}`, user),
  delete: (id: string) => request.delete<{ success: boolean }>(`/users/${id}`),
};
