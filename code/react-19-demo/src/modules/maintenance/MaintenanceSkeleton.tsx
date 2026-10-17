import { Card, Col, Row, Skeleton } from 'antd';

export function MaintenanceSkeleton() {
  return (
    <div className="space-y-6">
      {/* 3 张头部指标卡骨架 */}
      <Row gutter={[16, 16]}>
        {[1, 2, 3].map((i) => (
          <Col xs={24} sm={8} key={i}>
            <Card bordered={false} className="shadow-xs rounded-2xl">
              <Skeleton active avatar={{ size: 48 }} paragraph={{ rows: 2 }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 节点网格 (16/24) + 告警流 (8/24) */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Skeleton active paragraph={{ rows: 8 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Skeleton active avatar paragraph={{ rows: 6 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
