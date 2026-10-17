import type { UserFormData } from '../types/user';

export type FormErrors = Partial<Record<keyof UserFormData, string>>;

/**
 * 校验用户表单数据
 */
export function validateUserForm(data: UserFormData): { isValid: boolean; errors: FormErrors } {
  const errors: FormErrors = {};

  // 1. 姓名校验
  if (!data.name || !data.name.trim()) {
    errors.name = '姓名不能为空';
  } else if (data.name.trim().length < 2) {
    errors.name = '姓名长度至少为 2 个字符';
  }

  // 2. 邮箱校验
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !data.email.trim()) {
    errors.email = '邮箱不能为空';
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = '请输入有效的邮箱地址格式';
  }

  // 3. 部门校验
  if (!data.department || !data.department.trim()) {
    errors.department = '部门不能为空';
  }

  // 4. 角色校验
  if (!data.role) {
    errors.role = '请选择用户角色';
  }

  // 5. 状态校验
  if (!data.status) {
    errors.status = '请选择用户状态';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
