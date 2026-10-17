import { Result, Button } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

export function MaintenanceErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-xs">
      <Result
        status="error"
        title="监控数据流拉取中断"
        subTitle="Prometheus / 监控集群 API 返回异常，已安全隔离降级，已被 React 19 ErrorBoundary 成功捕获。"
        extra={
          onRetry ? (
            <Button type="primary" danger icon={<RedoOutlined />} onClick={onRetry}>
              重新连接监控中心
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
