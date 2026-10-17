import { useEffect } from 'react';
import { Form, Input, Modal, Select, message } from 'antd';
import type { UserItem } from '@/api/user.api';

interface UserModalProps {
  open: boolean;
  editingUser?: UserItem | null;
  departments?: string[];
  onCancel: () => void;
  onSuccess: (user: Partial<UserItem>) => void;
}

const DEFAULT_DEPARTMENTS = [
  '技术研发部',
  '产品运营部',
  '市场商务部',
  '财务风控部',
  '综合人事部',
];

export function UserModal({
  open,
  editingUser,
  departments = [],
  onCancel,
  onSuccess,
}: UserModalProps) {
  const [form] = Form.useForm();
  const isEditing = Boolean(editingUser);

  const safeDepts = Array.isArray(departments) && departments.length > 0 ? departments : DEFAULT_DEPARTMENTS;
  const validDepartments = safeDepts.filter((d) => d !== '全部');

  useEffect(() => {
    if (open) {
      if (editingUser) {
        form.setFieldsValue(editingUser);
      } else {
        form.resetFields();
        form.setFieldsValue({
          role: '普通员工',
          department: validDepartments[0] || '技术研发部',
          status: 'active',
        });
      }
    }
  }, [open, editingUser, validDepartments, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      message.success(isEditing ? '用户信息更新成功！' : '新成员添加成功！');
      onSuccess(values);
      onCancel();
    } catch {
      // 验证未通过
    }
  };

  return (
    <Modal
      title={isEditing ? '编辑成员信息' : '新增企业成员'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText={isEditing ? '保存修改' : '确认新增'}
      cancelText="取消"
    >
      <Form form={form} layout="vertical" className="pt-3">
        <Form.Item
          name="name"
          label="员工姓名"
          rules={[{ required: true, message: '请输入员工真实姓名' }]}
        >
          <Input placeholder="例如: 张三" />
        </Form.Item>

        <Form.Item
          name="email"
          label="企业邮箱"
          rules={[
            { required: true, message: '请输入企业邮箱' },
            { type: 'email', message: '请输入合法的邮箱格式' },
          ]}
        >
          <Input placeholder="例如: zhang.san@company.com" />
        </Form.Item>

        <Form.Item
          name="role"
          label="系统角色"
          rules={[{ required: true, message: '请选择角色权限' }]}
        >
          <Select
            options={[
              { value: '超级管理员', label: '超级管理员 (全部权限)' },
              { value: '部门主管', label: '部门主管 (部门审批与查看)' },
              { value: '普通员工', label: '普通员工 (日常业务操作)' },
              { value: '审计员', label: '审计员 (合规与日志只读)' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="department"
          label="所属部门"
          rules={[{ required: true, message: '请选择所属部门' }]}
        >
          <Select
            options={validDepartments.map((dept) => ({
              value: dept,
              label: dept,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="初始账号状态"
          rules={[{ required: true, message: '请选择账号状态' }]}
        >
          <Select
            options={[
              { value: 'active', label: '正常活跃 (立即启用)' },
              { value: 'pending', label: '待激活 (发送邀请邮件)' },
              { value: 'suspended', label: '限制停用 (暂不开放)' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
