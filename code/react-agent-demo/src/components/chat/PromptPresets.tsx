import React from 'react';
import { CloudSun, Calculator, Clock, Sparkles } from 'lucide-react';

interface PromptPresetsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

const PRESETS = [
  {
    label: '查北京天气',
    prompt: '北京今天天气怎么样？',
    icon: <CloudSun size={13} className="text-amber-400" />,
    badge: 'get_weather',
  },
  {
    label: '精确算式运算',
    prompt: '帮我计算一下 256 * 48 + 1024 / 2 等于多少',
    icon: <Calculator size={13} className="text-emerald-400" />,
    badge: 'calculator',
  },
  {
    label: '查询当前时间',
    prompt: '查询现在北京时间是几点几分？',
    icon: <Clock size={13} className="text-sky-400" />,
    badge: 'get_current_time',
  },
  {
    label: '上海天气与出行',
    prompt: '上海今天气温高吗，有下雨吗？有什么出行建议？',
    icon: <CloudSun size={13} className="text-orange-400" />,
    badge: 'get_weather',
  },
  {
    label: '智能体能力问答',
    prompt: '介绍一下你的 ReAct 智能体架构与支持哪些工具能力',
    icon: <Sparkles size={13} className="text-purple-400" />,
    badge: '通用推理',
  },
];

export const PromptPresets: React.FC<PromptPresetsProps> = ({ onSelect, disabled }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-none text-xs">
      <span className="text-slate-500 shrink-0 font-medium select-none">推荐提问:</span>
      {PRESETS.map((item, idx) => (
        <button
          key={idx}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(item.prompt)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/50 hover:border-indigo-500/50 transition-all shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          {item.icon}
          <span>{item.label}</span>
          <span className="text-[10px] text-slate-400 group-hover:text-indigo-300 font-mono">
            [{item.badge}]
          </span>
        </button>
      ))}
    </div>
  );
};
