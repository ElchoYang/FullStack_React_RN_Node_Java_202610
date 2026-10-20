import React, { useState } from 'react';
import { Wrench, CheckCircle2, Clock, CloudSun, Calculator, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import type { ToolCallItem } from '../../types/agent';
import { formatDuration, safeFormatJson } from '../../utils/format';
import { CopyButton } from '../common/CopyButton';

interface ToolCallCardProps {
  toolCall: ToolCallItem;
}

export const ToolCallCard: React.FC<ToolCallCardProps> = ({ toolCall }) => {
  const [showDetails, setShowDetails] = useState(false);

  // 根据不同工具名称配置视觉标识
  const getToolMeta = (name: string) => {
    switch (name) {
      case 'get_weather':
        return {
          label: '天气查询工具 (get_weather)',
          icon: <CloudSun className="w-4 h-4 text-amber-400" />,
          color: 'border-amber-800/40 bg-amber-950/20 text-amber-300',
        };
      case 'calculator':
        return {
          label: '数学运算工具 (calculator)',
          icon: <Calculator className="w-4 h-4 text-emerald-400" />,
          color: 'border-emerald-800/40 bg-emerald-950/20 text-emerald-300',
        };
      case 'get_current_time':
        return {
          label: '服务器时钟工具 (get_current_time)',
          icon: <Clock className="w-4 h-4 text-sky-400" />,
          color: 'border-sky-800/40 bg-sky-950/20 text-sky-300',
        };
      default:
        return {
          label: `外部工具 (${name})`,
          icon: <Wrench className="w-4 h-4 text-purple-400" />,
          color: 'border-purple-800/40 bg-purple-950/20 text-purple-300',
        };
    }
  };

  const meta = getToolMeta(toolCall.toolName);
  const isRunning = toolCall.status === 'running';

  return (
    <div className={`mb-3 rounded-lg border ${meta.color} overflow-hidden transition-all text-xs`}>
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/60">
        <div className="flex items-center gap-2">
          {meta.icon}
          <span className="font-semibold text-slate-200">{meta.label}</span>
          {isRunning ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 px-1.5 py-0.5 rounded bg-amber-950/50 border border-amber-700/50">
              <Loader2 className="w-3 h-3 animate-spin" />
              正在执行
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/50 border border-emerald-700/50">
              <CheckCircle2 className="w-3 h-3" />
              调用成功
              {toolCall.duration ? ` · ${formatDuration(toolCall.duration)}` : ''}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowDetails((prev) => !prev)}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          <span>{showDetails ? '收起入参/结果' : '查看详情'}</span>
          {showDetails ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* 参数与返回值明细 */}
      {showDetails && (
        <div className="p-3 border-t border-slate-800 space-y-2.5 bg-slate-950/60 font-mono">
          <div>
            <div className="flex items-center justify-between mb-1 text-[11px] text-slate-400 font-sans">
              <span>输入参数 (Arguments):</span>
              <CopyButton text={safeFormatJson(toolCall.args)} />
            </div>
            <pre className="p-2 rounded bg-slate-900 text-slate-300 text-[11px] overflow-x-auto border border-slate-800">
              {safeFormatJson(toolCall.args)}
            </pre>
          </div>

          {toolCall.result !== undefined && (
            <div>
              <div className="flex items-center justify-between mb-1 text-[11px] text-slate-400 font-sans">
                <span>工具执行结果 (Observation Result):</span>
                <CopyButton text={safeFormatJson(toolCall.result)} />
              </div>
              <pre className="p-2 rounded bg-slate-900 text-emerald-300 text-[11px] overflow-x-auto border border-emerald-950/60">
                {safeFormatJson(toolCall.result)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
