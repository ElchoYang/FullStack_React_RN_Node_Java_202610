import { Card } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import type { SalesTrend } from '@/api/dashboard.api';

export function RevenueChart({ trends }: { trends: SalesTrend[] }) {
  const maxRevenue = Math.max(...trends.map((t) => t.revenue));

  return (
    <Card
      bordered={false}
      className="shadow-xs rounded-2xl"
      title={
        <div className="flex items-center gap-2">
          <BarChartOutlined className="text-blue-500" />
          <span className="text-sm font-bold text-slate-800">营业额走势与月度单量</span>
        </div>
      }
      extra={<span className="text-xs text-slate-400 font-mono">单位: 万元</span>}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-6 gap-3 items-end h-48 pt-6 pb-2 px-2 border-b border-slate-100">
          {trends.map((t) => {
            const heightPercent = Math.round((t.revenue / maxRevenue) * 100);
            return (
              <div key={t.month} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">
                  {(t.revenue / 10000).toFixed(1)}万
                </span>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full max-w-[42px] bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-lg transition-all group-hover:from-blue-500 group-hover:to-indigo-300 shadow-xs"
                />
                <span className="text-xs font-medium text-slate-500 mt-2">{t.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
