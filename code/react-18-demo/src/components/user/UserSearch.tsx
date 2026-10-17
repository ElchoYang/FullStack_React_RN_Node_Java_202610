import { useState, useEffect, useRef } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import type { UserQueryParams } from '../../types/user';
import { useDebounce } from '../../hooks/useDebounce';

export interface UserSearchProps {
  initialParams?: UserQueryParams;
  onFilterChange: (params: UserQueryParams) => void;
}

export function UserSearch({ initialParams, onFilterChange }: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialParams?.q || '');
  const [role, setRole] = useState(initialParams?.role || '');
  const [status, setStatus] = useState(initialParams?.status || '');
  const [department, setDepartment] = useState(initialParams?.department || '');

  // 防抖搜索关键词
  const debouncedSearch = useDebounce(searchTerm, 350);

  // 记录是否为首次挂载，避免组件挂载时重复触发不必要的请求
  const isFirstRender = useRef(true);

  // 保存最新的 onFilterChange 引用，避免作为 useEffect 依赖导致死循环
  const onFilterChangeRef = useRef(onFilterChange);
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    onFilterChangeRef.current({
      q: debouncedSearch.trim() || undefined,
      role: role || undefined,
      status: status || undefined,
      department: department || undefined,
    });
  }, [debouncedSearch, role, status, department]);

  const handleReset = () => {
    setSearchTerm('');
    setRole('');
    setStatus('');
    setDepartment('');
  };

  const hasFilter = Boolean(searchTerm || role || status || department);

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 全文搜索 */}
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索姓名、邮箱、部门..."
            className="w-full pl-9.5 pr-3.5 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* 角色筛选 */}
        <div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
          >
            <option value="">全部角色</option>
            <option value="Admin">Admin (管理员)</option>
            <option value="Developer">Developer (开发)</option>
            <option value="Tester">Tester (测试)</option>
            <option value="Product Manager">Product Manager (产品)</option>
          </select>
        </div>

        {/* 状态筛选 */}
        <div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
          >
            <option value="">全部状态</option>
            <option value="Active">Active (启用)</option>
            <option value="Inactive">Inactive (停用)</option>
          </select>
        </div>

        {/* 重置按钮 */}
        <div className="flex items-center">
          <button
            onClick={handleReset}
            disabled={!hasFilter}
            className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置筛选</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserSearch;
