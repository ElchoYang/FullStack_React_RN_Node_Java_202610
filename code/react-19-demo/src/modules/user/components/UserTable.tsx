import { useState } from 'react';
import { Table, Tag, Avatar, Input, Select, Space, Button, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import type { UserItem } from '@/api/user.api';
import { useI18n } from '@/context/I18nContext';

interface UserTableProps {
  users: UserItem[];
  departments: string[];
  onEditUser?: (user: UserItem) => void;
}

export function UserTable({ users, departments, onEditUser }: UserTableProps) {
  const { t } = useI18n();
  const [selectedDept, setSelectedDept] = useState('全部');
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) => {
    const matchDept = selectedDept === '全部' || u.department === selectedDept;
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  const columns: ColumnsType<UserItem> = [
    {
      title: t('user.colUser'),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space size="middle">
          <Avatar src={record.avatar} icon={<UserOutlined />} size={36} />
          <div>
            <div className="font-semibold text-slate-800 text-xs">{record.name}</div>
            <div className="text-[11px] text-slate-400 font-mono">{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: t('user.colRole'),
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const color = role.includes('超级') ? 'purple' : role.includes('主管') ? 'blue' : 'default';
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: t('user.colDept'),
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => <span className="text-xs text-slate-600">{dept}</span>,
    },
    {
      title: t('user.colStatus'),
      dataIndex: 'status',
      key: 'status',
      render: (status: UserItem['status']) => {
        if (status === 'active') return <Tag color="success">{t('user.statusActive')}</Tag>;
        if (status === 'pending') return <Tag color="warning">{t('user.statusPending')}</Tag>;
        return <Tag color="error">{t('user.statusSuspended')}</Tag>;
      },
    },
    {
      title: t('user.colLastLogin'),
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (time: string) => <span className="text-[11px] font-mono text-slate-400">{time}</span>,
    },
    {
      title: t('common.actions'),
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => onEditUser?.(record)}
        >
          {t('common.edit')}
        </Button>
      ),
    },
  ];

  return (
    <Card variant="borderless" className="shadow-xs rounded-2xl overflow-hidden">
      {/* 顶部工具栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <Input
          prefix={<SearchOutlined className="text-slate-400" />}
          placeholder={t('user.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 280 }}
          allowClear
        />

        <Space size="middle">
          <span className="text-xs text-slate-400">{t('user.deptFilter')}:</span>
          <Select
            value={selectedDept}
            onChange={setSelectedDept}
            style={{ width: 140 }}
            options={departments.map((d) => ({
              value: d,
              label: d === '全部' ? t('common.all') : d,
            }))}
          />
        </Space>
      </div>

      {/* Ant Design 标准表格，使用 t('user.totalMembers', { total }) 动态插值 */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        pagination={{
          pageSize: 6,
          size: 'small',
          showTotal: (total) => t('user.totalMembers', { total }),
        }}
        size="middle"
      />
    </Card>
  );
}
