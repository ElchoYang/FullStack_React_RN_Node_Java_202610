import { use } from 'react';
import type { UserItem, UserModuleData } from '@/api/user.api';
import { UserStatsCards } from './components/UserStatsCards';
import { UserTable } from './components/UserTable';

interface UserContentProps {
  promise: Promise<UserModuleData>;
  editedUsersMap?: Record<string, UserItem>;
  addedUsers?: UserItem[];
  onEditUser?: (user: UserItem) => void;
}

export function UserContent({
  promise,
  editedUsersMap = {},
  addedUsers = [],
  onEditUser,
}: UserContentProps) {
  // React 19 核心解包
  const data = use(promise);

  // 合并新增与修改项
  const mergedUsers = [
    ...addedUsers,
    ...data.users.map((u) => editedUsersMap[u.id] || u),
  ];

  return (
    <div className="space-y-6">
      <UserStatsCards stats={data.stats} />
      <UserTable
        users={mergedUsers}
        departments={data.departments}
        onEditUser={onEditUser}
      />
    </div>
  );
}
