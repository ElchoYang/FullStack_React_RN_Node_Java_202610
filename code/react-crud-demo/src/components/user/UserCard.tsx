import { Mail, Building, Shield, Calendar, UserCheck, UserX } from 'lucide-react';
import type { User } from '../../types/user';
import { formatDate, getRoleBadgeClass, getStatusBadgeClass } from '../../utils/format';

export interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* 头部背景条 */}
      <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 pt-6 relative" />

      {/* 核心信息与头像 */}
      <div className="px-6 pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-6">
          <div className="flex items-end space-x-4">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg border-2 border-white">
              <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-3xl font-extrabold text-slate-700">
                {user.name.slice(0, 1).toUpperCase()}
              </div>
            </div>
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">系统用户 ID: #{user.id}</p>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeClass(
                user.role
              )}`}
            >
              <Shield className="w-3.5 h-3.5 mr-1" />
              {user.role}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
                user.status
              )}`}
            >
              {user.status === 'Active' ? (
                <UserCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              ) : (
                <UserX className="w-3.5 h-3.5 mr-1 text-rose-600" />
              )}
              {user.status === 'Active' ? '账号已启用' : '账号已停用'}
            </span>
          </div>
        </div>

        {/* 详细属性网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-gray-50/80">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-xs text-gray-500">电子邮箱</div>
              <div className="text-sm font-medium text-gray-900">{user.email}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-gray-50/80">
            <Building className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-xs text-gray-500">所属部门</div>
              <div className="text-sm font-medium text-gray-900">{user.department}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-gray-50/80 sm:col-span-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-xs text-gray-500">注册 / 创建时间</div>
              <div className="text-sm font-medium text-gray-900">
                {formatDate(user.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
