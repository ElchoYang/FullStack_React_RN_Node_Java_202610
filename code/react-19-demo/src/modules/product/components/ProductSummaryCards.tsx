import { Card, Col, Row, Statistic } from 'antd';
import {
  AppstoreOutlined,
  DollarOutlined,
  WarningOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import type { ProductSummary } from '@/api/product.api';

export function ProductSummaryCards({ summary }: { summary: ProductSummary }) {
  const items = [
    {
      title: '在售商品 SKU',
      value: summary.totalSkus,
      prefix: <AppstoreOutlined className="text-indigo-500" />,
      suffix: '款',
    },
    {
      title: '库存资产估值',
      value: (summary.totalInventoryValuation / 10000).toFixed(1),
      prefix: <DollarOutlined className="text-emerald-500" />,
      suffix: '万元',
    },
    {
      title: '库存不足预警',
      value: summary.lowStockAlerts,
      prefix: <WarningOutlined className="text-rose-500" />,
      suffix: '项',
    },
    {
      title: '最畅畅销品类',
      value: summary.topSellingCategory,
      prefix: <TrophyOutlined className="text-amber-500" />,
      isText: true,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {items.map((it, idx) => (
        <Col xs={12} lg={6} key={idx}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            {it.isText ? (
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1.5">
                  {it.prefix}
                  <span>{it.title}</span>
                </div>
                <div className="text-xl font-bold text-slate-800 tracking-tight pt-1">
                  {it.value}
                </div>
              </div>
            ) : (
              <Statistic
                title={<span className="text-xs text-slate-500 font-medium">{it.title}</span>}
                value={it.value}
                prefix={it.prefix}
                suffix={<span className="text-xs text-slate-400 font-normal">{it.suffix}</span>}
                valueStyle={{ fontWeight: 700, fontSize: 24 }}
              />
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
}
