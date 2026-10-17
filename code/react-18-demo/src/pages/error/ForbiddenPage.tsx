import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

export function ForbiddenPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">403</h1>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">无权访问</h2>
        <p className="text-sm text-gray-500 mb-6">
          抱歉，您当前的账号权限不足以访问此页面。如需权限请联系管理员。
        </p>
        <Link to="/dashboard">
          <Button variant="primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>返回仪表盘</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ForbiddenPage;
