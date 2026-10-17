import { Card, Col, Row, Skeleton } from 'antd';
import { AntdTableSkeleton } from '@/components/feedback/AntdSkeletonTemplates';

export function ReportSkeleton() {
  return (
    <div className="space-y-6">
      {/* 4 块财务卡片骨架 */}
      <Row gutter={[16, 16]}>
        {[1, 2, 3, 4].map((i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card bordered={false} className="shadow-xs rounded-2xl">
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 进度条骨架 */}
      <Card bordered={false} className="shadow-xs rounded-2xl">
        <Skeleton active paragraph={{ rows: 1 }} />
      </Card>

      {/* 任务表格骨架 */}
      <AntdTableSkeleton rows={4} />
    </div>
  );
}
