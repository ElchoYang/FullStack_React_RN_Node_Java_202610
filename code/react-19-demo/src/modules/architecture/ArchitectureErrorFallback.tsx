import { Result, Button } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

export function ArchitectureErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-xs">
      <Result
        status="error"
        title="架构分析规范数据加载失败"
        subTitle="模拟请求异常或网络中断，已被 React 19 ErrorBoundary 成功捕获。"
        extra={
          onRetry ? (
            <Button type="primary" danger icon={<RedoOutlined />} onClick={onRetry}>
              重新读取架构说明
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
