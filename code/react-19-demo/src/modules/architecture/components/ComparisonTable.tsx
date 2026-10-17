import { Alert, Card, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { TrophyOutlined } from '@ant-design/icons';
import type { PatternComparison } from '@/api/architecture.api';

export function ComparisonTable({ comparisons }: { comparisons: PatternComparison[] }) {
  const columns: ColumnsType<PatternComparison> = [
    {
      title: '对比维度',
      dataIndex: 'dimension',
      key: 'dimension',
      width: 150,
      render: (d: string) => <span className="font-bold text-slate-900 text-xs">{d}</span>,
    },
    {
      title: '传统模式 (React 16~18)',
      dataIndex: 'traditional',
      key: 'traditional',
      render: (text: string) => <span className="text-slate-500 text-xs">{text}</span>,
    },
    {
      title: '⭐ 本工程模式 (React 19 use)',
      dataIndex: 'react19Use',
      key: 'react19Use',
      render: (text: string) => (
        <span className="text-blue-700 font-semibold text-xs bg-blue-50/60 px-2 py-1 rounded">
          {text}
        </span>
      ),
    },
    {
      title: '路由 Loader 模式 (RouterProvider)',
      dataIndex: 'dataRouter',
      key: 'dataRouter',
      render: (text: string) => <span className="text-slate-600 text-xs">{text}</span>,
    },
  ];

  return (
    <Card
      bordered={false}
      className="shadow-xs rounded-2xl"
      title={<span className="text-base font-bold text-slate-900">数据获取模式多维横评</span>}
      extra={
        <Tag icon={<TrophyOutlined />} color="purple">
          架构选型分析
        </Tag>
      }
    >
      <Table
        rowKey="dimension"
        columns={columns}
        dataSource={comparisons}
        pagination={false}
        size="middle"
        className="mb-4"
      />

      <Alert
        type="info"
        showIcon
        message="架构师选型建议"
        description="在日常企业级后台（弹窗多、Tab多、组件复用度高）场景下，React 19 的组件自治模式不仅代码最内聚，而且开发心智极纯粹；而在需要极致首跳加载速度的大型复杂应用中，亦可将二者强强联合（Route Loader 预取 Promise + React 19 解包）。"
      />
    </Card>
  );
}
