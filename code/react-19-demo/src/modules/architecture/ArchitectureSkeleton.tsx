import { Card, Col, Row, Skeleton } from 'antd';

export function ArchitectureSkeleton() {
  return (
    <div className="space-y-6">
      <Card bordered={false} className="shadow-xs rounded-2xl">
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
      <Row gutter={[16, 16]}>
        {[1, 2, 3, 4].map((i) => (
          <Col xs={24} md={12} key={i}>
            <Card bordered={false} className="shadow-xs rounded-2xl">
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
