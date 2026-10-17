import { Card, Col, Row } from 'antd';
import {
  WarningOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { ArchitectureData } from '@/api/architecture.api';

export function BestPractices({ rules }: { rules: ArchitectureData['coreDesignRules'] }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900 m-0">
          React 19 黄金设计法则与避坑指南
        </h3>
        <p className="text-xs text-slate-500 m-0">写好 use(promise) 架构必须牢记的 3 条核心规约</p>
      </div>

      <div className="space-y-4">
        {rules.map((item, idx) => (
          <Card key={idx} bordered={false} className="shadow-xs rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <WarningOutlined className="text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900 m-0">{item.rule}</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.explanation}</p>

            <Row gutter={[16, 16]}>
              {/* 错误示范 */}
              <Col xs={24} md={12}>
                <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 mb-2">
                    <CloseCircleOutlined />
                    <span>典型反模式 (Anti-pattern)</span>
                  </div>
                  <pre className="text-[11px] font-mono text-rose-900 overflow-x-auto m-0 leading-relaxed">
                    <code>{item.badExample}</code>
                  </pre>
                </div>
              </Col>

              {/* 正确示范 */}
              <Col xs={24} md={12}>
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-2">
                    <CheckCircleOutlined />
                    <span>最佳实践 (Recommended)</span>
                  </div>
                  <pre className="text-[11px] font-mono text-emerald-900 overflow-x-auto m-0 leading-relaxed">
                    <code>{item.goodExample}</code>
                  </pre>
                </div>
              </Col>
            </Row>
          </Card>
        ))}
      </div>
    </div>
  );
}
