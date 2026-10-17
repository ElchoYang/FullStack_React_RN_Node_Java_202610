import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, AlertCircle } from 'lucide-react';
import type { User } from '../../types/user';
import { userService } from '../../api/userService';
import { UserCard } from '../../components/user/UserCard';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 删除确认弹窗
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userService.getUserById(id);
        setUser(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : '获取用户详情失败';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  // 确认删除
  const handleConfirmDelete = async () => {
    if (!id) return;
    try {
      setDeleting(true);
      await userService.deleteUser(id);
      navigate('/users');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '删除用户失败';
      setError(msg);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-xs">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3" />
        <p className="text-sm text-gray-500">正在加载用户档案...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Link
          to="/users"
          className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回列表</span>
        </Link>
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold">无法加载用户信息</h4>
            <p className="text-sm mt-1">{error || '该用户不存在或已被删除。'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 顶部操作条 */}
      <div className="flex items-center justify-between">
        <Link
          to="/users"
          className="inline-flex items-center space-x-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回用户列表</span>
        </Link>

        <div className="flex items-center space-x-3">
          <Link to={`/users/${user.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit2 className="w-3.5 h-3.5 mr-1.5" />
              <span>编辑资料</span>
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            <span>删除用户</span>
          </Button>
        </div>
      </div>

      {/* 用户详情卡片 */}
      <UserCard user={user} />

      {/* 删除确认弹窗 */}
      <Modal
        isOpen={isModalOpen}
        title="确认删除该用户？"
        message={`您确定要永久删除用户 "${user.name}" 的资料吗？此操作无法撤销。`}
        confirmText="确认删除"
        confirmVariant="danger"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default UserDetailPage;
