import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import type { UserFormData } from '../../types/user';
import { userService } from '../../api/userService';
import { validateUserForm } from '../../utils/validate';
import type { FormErrors } from '../../utils/validate';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export function UserFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // 表单受控状态
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'Developer',
    department: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // 编辑模式下回显用户数据
  useEffect(() => {
    if (isEdit && id) {
      const loadUser = async () => {
        try {
          setFetching(true);
          setServerError(null);
          const data = await userService.getUserById(id);
          setFormData({
            name: data.name,
            email: data.email,
            role: data.role,
            department: data.department,
            status: data.status,
          });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : '加载用户数据失败';
          setServerError(msg);
        } finally {
          setFetching(false);
        }
      };
      loadUser();
    }
  }, [id, isEdit]);

  // 处理输入变化
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 清除当前字段的校验错误
    if (errors[name as keyof UserFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 客户端校验
    const { isValid, errors: validationErrors } = validateUserForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setServerError(null);

      if (isEdit && id) {
        await userService.updateUser(id, formData);
      } else {
        await userService.createUser(formData);
      }

      // 操作成功返回用户列表页
      navigate('/users');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '保存用户信息失败';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-xs">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3" />
        <p className="text-sm text-gray-500">正在获取用户详情...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 顶部返回导航 */}
      <div className="flex items-center space-x-3">
        <Link
          to="/users"
          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? '编辑用户' : '新建用户'}
          </h1>
          <p className="text-sm text-gray-500">
            {isEdit ? `修改用户 #${id} 的档案信息` : '录入新成员的基本信息与系统权限'}
          </p>
        </div>
      </div>

      {/* 错误提示 */}
      {serverError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold">操作异常：</span>
            <span>{serverError}</span>
          </div>
        </div>
      )}

      {/* 表单容器 */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6"
      >
        {/* 姓名 */}
        <Input
          label="用户姓名"
          name="name"
          placeholder="例如：张三"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        {/* 邮箱 */}
        <Input
          label="电子邮箱"
          name="email"
          type="email"
          placeholder="例如：zhangsan@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        {/* 部门 */}
        <Input
          label="所属部门"
          name="department"
          placeholder="例如：技术部 / 产品部 / 测试部"
          value={formData.department}
          onChange={handleChange}
          error={errors.department}
          required
        />

        {/* 角色与状态（网格并排） */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 角色 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              角色权限 <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            >
              <option value="Admin">Admin (管理员)</option>
              <option value="Developer">Developer (研发工程师)</option>
              <option value="Tester">Tester (测试工程师)</option>
              <option value="Product Manager">Product Manager (产品经理)</option>
            </select>
          </div>

          {/* 状态 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              账号状态 <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            >
              <option value="Active">Active (已启用)</option>
              <option value="Inactive">Inactive (已停用)</option>
            </select>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/users')}
            disabled={loading}
          >
            取消
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            <Save className="w-4 h-4 mr-1.5" />
            <span>{isEdit ? '保存修改' : '确认创建'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UserFormPage;
