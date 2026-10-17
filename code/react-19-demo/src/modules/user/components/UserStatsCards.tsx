import { Card, Col, Row, Statistic } from 'antd';
import {
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import type { UserStats } from '@/api/user.api';

export function UserStatsCards({ stats }: { stats: UserStats }) {
  const items = [
    {
      title: '注册员工总数',
      value: stats.totalUsers,
      prefix: <TeamOutlined className="text-blue-500" />,
      suffix: '人',
    },
    {
      title: '正常激活账号',
      value: stats.activeUsers,
      prefix: <CheckCircleOutlined className="text-emerald-500" />,
      suffix: '人',
    },
    {
      title: '待激活邀请',
      value: stats.pendingInvites,
      prefix: <ClockCircleOutlined className="text-amber-500" />,
      suffix: '人',
    },
    {
      title: '已停用限制',
      value: stats.suspendedUsers,
      prefix: <StopOutlined className="text-rose-500" />,
      suffix: '人',
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {items.map((it, idx) => (
        <Col xs={12} lg={6} key={idx}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs text-slate-500 font-medium">{it.title}</span>}
              value={it.value}
              prefix={it.prefix}
              suffix={<span className="text-xs text-slate-400 font-normal">{it.suffix}</span>}
              valueStyle={{ fontWeight: 700, fontSize: 24 }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}
