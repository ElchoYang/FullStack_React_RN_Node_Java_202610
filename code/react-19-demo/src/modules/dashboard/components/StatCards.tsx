import { Card, Col, Row } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { DashboardMetric } from '@/api/dashboard.api';

export function StatCards({ metrics }: { metrics: DashboardMetric[] }) {
  return (
    <Row gutter={[16, 16]}>
      {metrics.map((item) => (
        <Col xs={24} sm={12} lg={6} key={item.id}>
          <Card bordered={false} className="shadow-xs rounded-2xl hover:shadow-md transition">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-500 font-medium">{item.title}</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                  item.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}
              >
                {item.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {item.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight my-1">
              {item.value}
            </div>
            <div className="text-xs text-slate-400">{item.description}</div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
