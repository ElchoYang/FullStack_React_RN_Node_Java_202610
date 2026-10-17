import { Link } from 'react-router-dom';
import { Edit2, Trash2, Eye, UserX } from 'lucide-react';
import type { User } from '../../types/user';
import { formatDate, getRoleBadgeClass, getStatusBadgeClass } from '../../utils/format';

export interface UserTableProps {
  users: User[];
  loading: boolean;
  onDeleteClick: (user: User) => void;
}

export function UserTable({
  users,
  loading,
  onDeleteClick,
}: UserTableProps) {
  if (loading && users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-xs">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3" />
        <p className="text-sm text-gray-500">正在努力加载用户数据...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
          <UserX className="w-6 h-6" />
        </div>
        <h4 className="text-base font-medium text-gray-900 mb-1">暂无符合条件的用户</h4>
        <p className="text-sm text-gray-500 mb-4">您可以尝试更换搜索条件或直接创建新用户</p>
        <Link
          to="/users/new"
          className="inline-flex items-center px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition"
        >
          立即新建用户
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 tracking-wider">
                姓名 / 邮箱
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 tracking-wider">
                角色
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 tracking-wider">
                部门
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 tracking-wider">
                状态
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 tracking-wider">
                创建时间
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-blue-50/40 transition-colors duration-100"
              >
                {/* 姓名与邮箱 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs border border-slate-200">
                      {user.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>

                {/* 角色 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeClass(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>

                {/* 部门 */}
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {user.department}
                </td>

                {/* 状态 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                      user.status
                    )}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                    {user.status === 'Active' ? '已启用' : '已停用'}
                  </span>
                </td>

                {/* 创建时间 */}
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                  {formatDate(user.createdAt)}
                </td>

                {/* 操作栏 */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/users/${user.id}`}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="查看详情"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/users/${user.id}/edit`}
                      className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                      title="编辑用户"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onDeleteClick(user)}
                      className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      title="删除用户"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
