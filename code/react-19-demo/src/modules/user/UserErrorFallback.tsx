import { Result, Button } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

export function UserErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-xs">
      <Result
        status="error"
        title="用户与权限模块加载异常"
        subTitle="未能从服务器获取企业架构树和员工列表，已被 React 19 ErrorBoundary 成功拦截。"
        extra={
          onRetry ? (
            <Button type="primary" danger icon={<RedoOutlined />} onClick={onRetry}>
              重新拉取员工数据
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
