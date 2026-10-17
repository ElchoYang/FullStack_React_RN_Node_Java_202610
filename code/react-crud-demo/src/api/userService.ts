import request from './request';
import type { User, UserFormData, UserQueryParams } from '../types/user';

export const userService = {
  // 1. 获取用户列表（支持搜索、过滤、排序、分页）
  getUsers: (params?: UserQueryParams): Promise<User[]> => {
    return request.get('/users', { params });
  },

  // 2. 根据 ID 获取单条用户详情
  getUserById: (id: string): Promise<User> => {
    return request.get(`/users/${id}`);
  },

  // 3. 新增用户
  createUser: (data: UserFormData): Promise<User> => {
    const payload: User = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    return request.post('/users', payload);
  },

  // 4. 更新用户信息 (PATCH 局部修改)
  updateUser: (id: string, data: Partial<UserFormData>): Promise<User> => {
    return request.patch(`/users/${id}`, data);
  },

  // 5. 删除用户
  deleteUser: (id: string): Promise<void> => {
    return request.delete(`/users/${id}`);
  },
};
