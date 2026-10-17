import { Result, Button } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

export function ProductErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-xs">
      <Result
        status="error"
        title="商品中心数据读取失败"
        subTitle="商品清单或仓库库存接口遇到异常，已被 React 19 ErrorBoundary 成功捕获。"
        extra={
          onRetry ? (
            <Button type="primary" danger icon={<RedoOutlined />} onClick={onRetry}>
              重新检索商品数据
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
