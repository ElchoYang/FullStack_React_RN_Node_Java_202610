import { useState, useEffect, useCallback } from 'react';
import type { User, UserQueryParams } from '../types/user';
import { userService } from '../api/userService';

export function useUsers(initialParams?: UserQueryParams) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<UserQueryParams>(initialParams || {});

  // 获取用户列表
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // json-server 支持按字段过滤和 q 全文搜索
      const cleanParams: Record<string, string> = {};
      if (params.q?.trim()) cleanParams.q = params.q.trim();
      if (params.role) cleanParams.role = params.role;
      if (params.status) cleanParams.status = params.status;
      if (params.department) cleanParams.department = params.department;

      const data = await userService.getUsers(cleanParams);
      setUsers(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '获取用户列表失败';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [params]);

  // 依赖查询参数变化重新请求
  useEffect(() => {
    void Promise.resolve().then(() => {
      fetchUsers();
    });
  }, [fetchUsers]);

  // 删除用户
  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      await userService.deleteUser(id);
      // 乐观更新前端列表
      setUsers((prev) => prev.filter((user) => user.id !== id));
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '删除用户失败';
      setError(msg);
      return false;
    }
  };

  return {
    users,
    loading,
    error,
    params,
    setParams,
    refresh: fetchUsers,
    deleteUser,
  };
}

export default useUsers;
