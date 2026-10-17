import { Suspense, useState, useTransition } from 'react';
import { Button, Space } from 'antd';
import { ReloadOutlined, UserAddOutlined } from '@ant-design/icons';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { fetchUserData, type UserItem, type UserModuleData } from '@/api/user.api';
import { useI18n } from '@/context/I18nContext';
import { UserContent } from './UserContent';
import { UserSkeleton } from './UserSkeleton';
import { UserErrorFallback } from './UserErrorFallback';
import { UserModal } from './components/UserModal';

const DEFAULT_DEPARTMENTS = [
  '技术研发部',
  '产品运营部',
  '市场商务部',
  '财务风控部',
  '综合人事部',
];

export function UserPage() {
  const { t } = useI18n();

  // 统一的 User 模块 Promise 集合 (React 19 核心规范)
  const [userDataPromise, setUserDataPromise] = useState<Promise<UserModuleData>>(() =>
    fetchUserData()
  );
  const [isPending, startTransition] = useTransition();

  // 弹窗与就地数据响应状态
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [addedUsers, setAddedUsers] = useState<UserItem[]>([]);
  const [editedUsersMap, setEditedUsersMap] = useState<Record<string, UserItem>>({});

  const handleRefresh = () => {
    startTransition(() => {
      setAddedUsers([]);
      setEditedUsersMap({});
      setUserDataPromise(fetchUserData());
    });
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (user: UserItem) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleModalSuccess = (formData: Partial<UserItem>) => {
    if (editingUser) {
      // 编辑保存
      const updated = { ...editingUser, ...formData } as UserItem;
      setEditedUsersMap((prev) => ({
        ...prev,
        [editingUser.id]: updated,
      }));
    } else {
      // 新增成员
      const newUser: UserItem = {
        id: `u-${Date.now()}`,
        name: formData.name || '新成员',
        email: formData.email || '',
        role: formData.role || '普通员工',
        department: formData.department || '技术研发部',
        status: formData.status || 'active',
        lastLogin: '刚刚创建',
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      };
      setAddedUsers((prev) => [newUser, ...prev]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 顶部标题栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('user.title')}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{t('user.desc')}</p>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined spin={isPending} />}
            onClick={handleRefresh}
            loading={isPending}
          >
            {isPending ? t('common.loading') : t('user.syncBtn')}
          </Button>
          <Button type="primary" icon={<UserAddOutlined />} onClick={handleOpenAddModal}>
            {t('user.addBtn')}
          </Button>
        </Space>
      </div>

      <ErrorBoundary
        fallback={<UserErrorFallback onRetry={handleRefresh} />}
        onReset={handleRefresh}
      >
        {/* Ant Design 封装的通用表格骨架屏 */}
        <Suspense fallback={<UserSkeleton />}>
          <UserContent
            promise={userDataPromise}
            addedUsers={addedUsers}
            editedUsersMap={editedUsersMap}
            onEditUser={handleOpenEditModal}
          />
        </Suspense>
      </ErrorBoundary>

      {/* 新增/编辑员工弹窗 */}
      <UserModal
        open={modalOpen}
        editingUser={editingUser}
        departments={DEFAULT_DEPARTMENTS}
        onCancel={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
