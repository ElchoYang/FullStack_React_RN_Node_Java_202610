import { Card, Timeline } from 'antd';
import {
  ShoppingOutlined,
  WarningOutlined,
  UserOutlined,
  CodeOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';
import type { ActivityItem } from '@/api/dashboard.api';

export function ActivityList({ activities }: { activities: ActivityItem[] }) {
  const getTimelineItem = (item: ActivityItem) => {
    let color = 'blue';
    let icon = <ShoppingOutlined />;

    if (item.type === 'alert') {
      color = 'red';
      icon = <WarningOutlined />;
    } else if (item.type === 'user') {
      color = 'green';
      icon = <UserOutlined />;
    } else if (item.type === 'system') {
      color = 'purple';
      icon = <CodeOutlined />;
    }

    return {
      color,
      dot: icon,
      children: (
        <div className="text-xs">
          <div className="flex justify-between items-center mb-0.5">
            <span className="font-semibold text-slate-800">{item.user}</span>
            <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
          </div>
          <p className="text-slate-600 m-0 leading-relaxed">{item.action}</p>
        </div>
      ),
    };
  };

  return (
    <Card
      bordered={false}
      className="shadow-xs rounded-2xl h-full"
      title={<span className="text-sm font-bold text-slate-800">最新动态事件</span>}
      extra={
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <FieldTimeOutlined /> 实时捕获
        </span>
      }
    >
      <Timeline items={activities.map(getTimelineItem)} style={{ marginTop: 8 }} />
    </Card>
  );
}
