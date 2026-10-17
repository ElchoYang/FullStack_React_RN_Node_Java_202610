import { Result, Button } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

export function ReportErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-xs">
      <Result
        status="error"
        title="财务与决算报表获取失败"
        subTitle="报表分析引擎未能在预期时间内返回数据或请求被中断，已被 React 19 ErrorBoundary 成功拦截。"
        extra={
          onRetry ? (
            <Button type="primary" danger icon={<RedoOutlined />} onClick={onRetry}>
              重新生成报表数据
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
