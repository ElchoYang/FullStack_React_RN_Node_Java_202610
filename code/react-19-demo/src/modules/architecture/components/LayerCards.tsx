import { Card, Col, Row, Tag } from 'antd';
import {
  DesktopOutlined,
  SafetyCertificateOutlined,
  CodeOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import type { ArchitectureLayer } from '@/api/architecture.api';

const layerIcons = [DesktopOutlined, SafetyCertificateOutlined, CodeOutlined, DatabaseOutlined];

export function LayerCards({ layers }: { layers: ArchitectureLayer[] }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900 m-0">工程分层架构 (Layered Architecture)</h3>
        <p className="text-xs text-slate-500 m-0">职责单一、高内聚低耦合的 4 层工程结构</p>
      </div>

      <Row gutter={[16, 16]}>
        {layers.map((layer, idx) => {
          const Icon = layerIcons[idx] || DesktopOutlined;

          return (
            <Col xs={24} md={12} key={layer.name}>
              <Card
                bordered={false}
                className="shadow-xs hover:shadow-md transition h-full flex flex-col justify-between rounded-2xl"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${layer.color} text-white flex items-center justify-center text-lg shadow-xs shrink-0`}
                    >
                      <Icon />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 m-0">{layer.name}</h4>
                      <Tag color="blue" className="mt-1 font-semibold">
                        {layer.role}
                      </Tag>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{layer.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5 font-mono">
                    核心承载文件：
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {layer.files.map((f) => (
                      <Tag key={f} className="font-mono text-[11px] m-0">
                        {f}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
