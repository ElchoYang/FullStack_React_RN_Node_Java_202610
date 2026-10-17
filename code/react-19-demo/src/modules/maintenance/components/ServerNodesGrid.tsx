import { Card, Col, Progress, Row, Tag } from 'antd';
import { ApiOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ServerNode } from '@/api/maintenance.api';
import { useI18n } from '@/context/I18nContext';

export function ServerNodesGrid({ nodes }: { nodes: ServerNode[] }) {
  const { t } = useI18n();

  return (
    <Card
      variant="borderless"
      className="shadow-xs rounded-2xl"
      title={
        <div>
          <span className="text-sm font-bold text-slate-800">{t('maintenance.clusterNodes')}</span>
          <p className="text-xs text-slate-400 font-normal m-0">{t('maintenance.clusterDesc')}</p>
        </div>
      }
      extra={
        <Tag color="success" className="m-0">
          {t('maintenance.probeActive')}
        </Tag>
      }
    >
      <Row gutter={[16, 16]}>
        {nodes.map((node) => {
          const isWarning = node.status === 'warning';

          return (
            <Col xs={24} md={12} key={node.id}>
              <div
                className={`p-4 rounded-xl border transition ${
                  isWarning
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 m-0">{node.name}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                      <ApiOutlined />
                      <span>{node.ip}</span>
                      <span>•</span>
                      <span>{node.region}</span>
                    </div>
                  </div>
                  <Tag color={node.status === 'healthy' ? 'success' : 'warning'}>
                    {node.status === 'healthy' ? '在线' : '偏高'}
                  </Tag>
                </div>

                {/* CPU & Memory 进度条 */}
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                      <span>CPU 负载</span>
                      <span className="font-mono font-semibold">{node.cpu}%</span>
                    </div>
                    <Progress
                      percent={node.cpu}
                      size="small"
                      status={node.cpu > 80 ? 'exception' : 'active'}
                      showInfo={false}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                      <span>内存占用</span>
                      <span className="font-mono font-semibold">{node.memory}%</span>
                    </div>
                    <Progress
                      percent={node.memory}
                      size="small"
                      status={node.memory > 80 ? 'exception' : 'normal'}
                      strokeColor={node.memory > 80 ? '#f59e0b' : '#6366f1'}
                      showInfo={false}
                    />
                  </div>
                </div>

                {/* 使用变量插值 t('maintenance.uptimeDisplay', { uptime }) */}
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ClockCircleOutlined />
                    {t('maintenance.uptimeDisplay', { uptime: node.uptime })}
                  </span>
                  <span className="font-mono">磁盘: {node.disk}%</span>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
}
