import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, AlertCircle, RefreshCw } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import type { User, UserQueryParams } from '../../types/user';
import { UserSearch } from '../../components/user/UserSearch';
import { UserTable } from '../../components/user/UserTable';
import { Modal } from '../../components/common/Modal';

export function UserListPage() {
  const { users, loading, error, params, setParams, refresh, deleteUser } = useUsers();

  // 删除弹窗状态
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // 处理筛选条件变更（使用 useCallback 保持函数引用稳定）
  const handleFilterChange = useCallback((newParams: UserQueryParams) => {
    setParams(newParams);
  }, [setParams]);

  // 打开删除确认弹窗
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    setIsDeleting(true);
    const success = await deleteUser(selectedUser.id);
    setIsDeleting(false);
    if (success) {
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 顶部标题与快速操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">用户列表</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            查看、检索与维护团队成员账号，支持完整的 RESTful CRUD 操作。
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={refresh}
            className="inline-flex items-center space-x-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
            title="刷新列表"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>刷新</span>
          </button>

          <Link
            to="/users/new"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>新增用户</span>
          </Link>
        </div>
      </div>

      {/* 错误提示条 */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold">发生错误：</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* 搜索过滤栏 */}
      <UserSearch initialParams={params} onFilterChange={handleFilterChange} />

      {/* 用户数据表格 */}
      <UserTable
        users={users}
        loading={loading}
        onDeleteClick={handleDeleteClick}
      />

      {/* 删除二次确认弹窗 */}
      <Modal
        isOpen={Boolean(selectedUser)}
        onCancel={() => !isDeleting && setSelectedUser(null)}
        title="确认删除该用户？"
        confirmText={isDeleting ? '正在删除...' : '确定删除'}
        cancelText="取消"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      >
        <p className="text-sm text-gray-600 leading-relaxed">
          您确定要删除用户{' '}
          <span className="font-semibold text-gray-900">{selectedUser?.name}</span>{' '}
          （{selectedUser?.email}）吗？此操作无法撤销。
        </p>
      </Modal>
    </div>
  );
}

export default UserListPage;
