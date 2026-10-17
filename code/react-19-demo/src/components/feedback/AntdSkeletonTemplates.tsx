import { Card, Col, Row, Skeleton, Space } from 'antd';

/**
 * 1. 表格通用骨架屏 (Ant Design 风格)
 * 适用于用户列表、订单管理、日志明细等常规 CRUD 表格页面
 */
export function AntdTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Card bordered={false} className="shadow-xs">
      {/* 顶部工具栏骨架：搜索框 + 按钮 */}
      <div className="flex justify-between items-center mb-6">
        <Space size="middle">
          <Skeleton.Input active style={{ width: 220 }} />
          <Skeleton.Button active style={{ width: 100 }} />
        </Space>
        <Space>
          <Skeleton.Button active style={{ width: 88 }} />
          <Skeleton.Button active style={{ width: 96 }} />
        </Space>
      </div>

      {/* 表格内容骨架行 */}
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton
            key={i}
            active
            title={false}
            paragraph={{ rows: 1, width: ['100%'] }}
            className="py-1"
          />
        ))}
      </div>
    </Card>
  );
}

/**
 * 2. 卡片网格通用骨架屏 (Ant Design 风格)
 * 适用于商品中心、资产卡片、应用市场等瀑布流/网格页面
 */
export function AntdCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {/* 顶部统计卡片骨架 */}
      <Row gutter={[16, 16]}>
        {[1, 2, 3, 4].map((i) => (
          <Col xs={12} lg={6} key={i}>
            <Card bordered={false} className="shadow-xs">
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 分类栏骨架 */}
      <div className="py-2">
        <Space size="small">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton.Button key={i} active style={{ width: 72 }} />
          ))}
        </Space>
      </div>

      {/* 卡片网格骨架 */}
      <Row gutter={[16, 16]}>
        {Array.from({ length: count }).map((_, i) => (
          <Col xs={24} sm={12} lg={8} key={i}>
            <Card bordered={false} className="shadow-xs">
              <Skeleton active avatar={{ shape: 'square', size: 48 }} paragraph={{ rows: 3 }} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

/**
 * 3. 大盘/仪表盘通用骨架屏 (Ant Design 风格)
 * 适用于数据总览、统计大屏
 */
export function AntdDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* 4 块指标卡 */}
      <Row gutter={[16, 16]}>
        {[1, 2, 3, 4].map((i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card bordered={false} className="shadow-xs">
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 主视图：图表 (16/24) + 时间线 (8/24) */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card bordered={false} className="shadow-xs" style={{ minHeight: 380 }}>
            <Skeleton.Node active style={{ width: '100%', height: 320 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card bordered={false} className="shadow-xs" style={{ minHeight: 380 }}>
            <Skeleton active avatar paragraph={{ rows: 6 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
