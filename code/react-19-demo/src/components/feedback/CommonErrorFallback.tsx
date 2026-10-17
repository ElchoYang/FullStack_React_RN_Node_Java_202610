import { Result, Button } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

interface CommonErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function CommonErrorFallback({
  title = '数据加载发生错误',
  message = '网络请求中断或服务器响应异常，已被 React 19 ErrorBoundary 成功捕获。',
  onRetry,
}: CommonErrorFallbackProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-xs">
      <Result
        status="error"
        title={title}
        subTitle={message}
        extra={
          onRetry ? (
            <Button
              type="primary"
              danger
              icon={<RedoOutlined />}
              onClick={onRetry}
              size="middle"
            >
              重新加载数据
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
