import { Link } from 'react-router-dom';
import { Home, FileQuestion } from 'lucide-react';
import { Button } from '../../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">404</h1>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">页面未找到</h2>
        <p className="text-sm text-gray-500 mb-6">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <Link to="/users">
          <Button variant="primary">
            <Home className="w-4 h-4 mr-2" />
            <span>返回用户列表</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
