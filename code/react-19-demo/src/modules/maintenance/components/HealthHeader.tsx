import { Card, Col, Row, Progress } from 'antd';
import { ClusterOutlined, AlertOutlined } from '@ant-design/icons';

interface HealthHeaderProps {
  score: number;
  activeNodes: number;
  incidents: number;
}

export function HealthHeader({ score, activeNodes, incidents }: HealthHeaderProps) {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8}>
        <Card bordered={false} className="shadow-xs rounded-2xl flex items-center justify-between">
          <div className="flex items-center justify-between w-full">
            <div>
              <span className="text-xs text-slate-500 font-medium">全局系统健康度</span>
              <div className="text-2xl font-black text-emerald-600 mt-1 tracking-tight">
                {score}%
              </div>
              <span className="text-[11px] text-slate-400">所有微服务探测正常</span>
            </div>
            <Progress
              type="circle"
              percent={score}
              size={54}
              strokeColor="#10b981"
              format={(p) => `${p}%`}
            />
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={8}>
        <Card bordered={false} className="shadow-xs rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">受监控服务节点</span>
              <div className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
                {activeNodes} 台
              </div>
              <span className="text-[11px] text-slate-400">跨 4 个核心区域集群</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
              <ClusterOutlined />
            </div>
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={8}>
        <Card bordered={false} className="shadow-xs rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">待处置告警事件</span>
              <div className="text-2xl font-black text-amber-600 mt-1 tracking-tight">
                {incidents} 起
              </div>
              <span className="text-[11px] text-slate-400">已通知值班 SRE 团队</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
              <AlertOutlined />
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
}
