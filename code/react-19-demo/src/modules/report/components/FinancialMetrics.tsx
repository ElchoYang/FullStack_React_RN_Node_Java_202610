import { Card, Col, Progress, Row } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, TrophyOutlined } from '@ant-design/icons';
import type { FinancialMetric } from '@/api/report.api';

interface FinancialMetricsProps {
  metrics: FinancialMetric[];
  annualTargetProgress: number;
}

export function FinancialMetrics({ metrics, annualTargetProgress }: FinancialMetricsProps) {
  return (
    <div className="space-y-4">
      {/* 4 块核心财务卡片 */}
      <Row gutter={[16, 16]}>
        {metrics.map((m, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <Card bordered={false} className="shadow-xs rounded-2xl">
              <span className="text-xs text-slate-500 font-medium">{m.title}</span>
              <div className="text-2xl font-black text-slate-900 tracking-tight my-1">
                {m.amount}
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span
                  className={`inline-flex items-center gap-0.5 font-semibold ${
                    m.status === 'up' ? 'text-emerald-600' : 'text-blue-600'
                  }`}
                >
                  {m.status === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {m.quarterComparison}
                </span>
                <span className="text-[11px] text-slate-400">核算完毕</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 年度预算/目标进度条 */}
      <Card
        bordered={false}
        className="shadow-xs rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white"
        bodyStyle={{ padding: 20 }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300 text-xl">
              <TrophyOutlined />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white m-0">2025 全财年净利润目标达成进度</h4>
              <p className="text-xs text-indigo-200 mt-0.5 m-0">当前进度超预期 3.2 个百分点，整体稳健运行</p>
            </div>
          </div>

          <div className="w-full sm:w-72">
            <Progress
              percent={annualTargetProgress}
              status="active"
              strokeColor={{ '0%': '#10b981', '100%': '#3b82f6' }}
              trailColor="rgba(255,255,255,0.2)"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
