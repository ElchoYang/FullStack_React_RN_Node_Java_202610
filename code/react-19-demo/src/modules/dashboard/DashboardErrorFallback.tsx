import { Result, Button } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

export function DashboardErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-xs">
      <Result
        status="error"
        title="仪表盘聚合数据拉取失败"
        subTitle="Promise 处于 Rejected 状态，已被外层 React 19 ErrorBoundary 成功捕获。请点击下方重试。"
        extra={
          onRetry ? (
            <Button type="primary" danger icon={<RedoOutlined />} onClick={onRetry}>
              重试加载大盘数据
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
