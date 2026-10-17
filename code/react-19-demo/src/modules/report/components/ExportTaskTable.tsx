import { Button, Card, Col, Row, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import type { ExportTask, MonthlyBreakdown } from '@/api/report.api';
import { useI18n } from '@/context/I18nContext';

interface ExportTaskTableProps {
  tasks: ExportTask[];
  breakdown: MonthlyBreakdown[];
}

export function ExportTaskTable({ tasks, breakdown }: ExportTaskTableProps) {
  const { t } = useI18n();

  const columns: ColumnsType<ExportTask> = [
    {
      title: '报表名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-blue-500" />
          <span className="font-semibold text-slate-800 text-xs">{name}</span>
        </div>
      ),
    },
    {
      title: '格式',
      dataIndex: 'format',
      key: 'format',
      render: (fmt: string) => <Tag color="blue">{fmt}</Tag>,
    },
    {
      title: '发起人',
      dataIndex: 'requestedBy',
      key: 'requestedBy',
      render: (req: string) => <span className="text-xs text-slate-600">{req}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, r) =>
        r.status === 'completed' ? (
          <Tag color="success">已就绪 ({r.size})</Tag>
        ) : (
          <Tag color="processing">生成中...</Tag>
        ),
    },
    {
      title: '生成时间',
      dataIndex: 'date',
      key: 'date',
      render: (d: string) => <span className="font-mono text-[11px] text-slate-400">{d}</span>,
    },
    {
      title: '操作',
      key: 'action',
      align: 'right',
      render: (_, r) =>
        r.status === 'completed' ? (
          <Button type="link" size="small" icon={<DownloadOutlined />}>
            {t('common.download')}
          </Button>
        ) : (
          <span className="text-slate-400 text-xs">等待中</span>
        ),
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {/* 报表导出队列 (16/24)，使用 t('report.totalTasks', { count }) 插值 */}
      <Col xs={24} lg={16}>
        <Card
          variant="borderless"
          className="shadow-xs rounded-2xl"
          title={<span className="text-sm font-bold text-slate-800">{t('report.exportHistory')}</span>}
          extra={
            <span className="text-xs text-slate-400 font-mono">
              {t('report.totalTasks', { count: tasks.length })}
            </span>
          }
        >
          <Table
            rowKey="id"
            columns={columns}
            dataSource={tasks}
            pagination={false}
            size="middle"
          />
        </Card>
      </Col>

      {/* 近5个月收支对比 (8/24) */}
      <Col xs={24} lg={8}>
        <Card
          variant="borderless"
          className="shadow-xs rounded-2xl h-full flex flex-col justify-between"
          title={<span className="text-sm font-bold text-slate-800">{t('report.monthlyProfit')}</span>}
        >
          <div className="space-y-3">
            {breakdown.map((item) => (
              <div
                key={item.month}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex justify-between items-center mb-1 font-mono">
                  <span className="font-bold text-slate-800">{item.month}</span>
                  <span className="text-emerald-600 font-bold">
                    净利: +{(item.profit / 10000).toFixed(1)}万
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>总收: {(item.income / 10000).toFixed(1)}万</span>
                  <span>支出: {(item.cost / 10000).toFixed(1)}万</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Col>
    </Row>
  );
}
