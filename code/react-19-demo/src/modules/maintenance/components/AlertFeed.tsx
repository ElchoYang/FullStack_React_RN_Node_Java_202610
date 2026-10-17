import { Card, List, Tag } from 'antd';
import {
  BellOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { AlertLog } from '@/api/maintenance.api';

export function AlertFeed({ alerts }: { alerts: AlertLog[] }) {
  return (
    <Card
      bordered={false}
      className="shadow-xs rounded-2xl h-full"
      title={<span className="text-sm font-bold text-slate-800">系统事件审计日志</span>}
      extra={
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <BellOutlined /> 实时队列
        </span>
      }
    >
      <List
        itemLayout="vertical"
        dataSource={alerts}
        renderItem={(alt) => {
          let tagColor = 'blue';
          let icon = <InfoCircleOutlined />;

          if (alt.level === 'warn') {
            tagColor = 'warning';
            icon = <WarningOutlined />;
          } else if (alt.level === 'error') {
            tagColor = 'error';
            icon = <CloseCircleOutlined />;
          }

          return (
            <List.Item key={alt.id} style={{ padding: '8px 0' }}>
              <div className="flex items-center justify-between mb-1">
                <Tag icon={icon} color={tagColor} className="m-0">
                  {alt.source}
                </Tag>
                <span className="text-[10px] text-slate-400 font-mono">{alt.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 m-0 leading-relaxed">{alt.message}</p>
            </List.Item>
          );
        }}
      />
    </Card>
  );
}
