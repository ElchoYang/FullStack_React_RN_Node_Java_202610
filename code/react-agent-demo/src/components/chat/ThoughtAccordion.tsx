import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Sparkles, BrainCircuit } from 'lucide-react';
import type { ThoughtStep } from '../../types/agent';
import { formatTime } from '../../utils/format';

interface ThoughtAccordionProps {
  thoughts: ThoughtStep[];
  isStreaming?: boolean;
}

export const ThoughtAccordion: React.FC<ThoughtAccordionProps> = ({ thoughts, isStreaming }) => {
  // 如果还在流式中，默认展开；结束后默认保持展开方便查阅
  const [isOpen, setIsOpen] = useState(true);

  // 当新的 thought 涌入且在流式中时，确保展开
  useEffect(() => {
    if (isStreaming && thoughts.length > 0) {
      setIsOpen(true);
    }
  }, [thoughts.length, isStreaming]);

  if (!thoughts || thoughts.length === 0) {
    return null;
  }

  const isActivelyThinking = isStreaming && thoughts.length > 0;

  return (
    <div className="mb-3 rounded-lg border border-indigo-950/60 bg-indigo-950/20 text-slate-300 text-sm overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3.5 py-2 bg-indigo-950/40 hover:bg-indigo-950/60 transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {isActivelyThinking ? (
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '3s' }} />
          ) : (
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
          )}
          <span className="font-medium text-xs text-indigo-300">
            {isActivelyThinking ? '深度思考中...' : '已完成思考推理'}
          </span>
          <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-700/40">
            {thoughts.length} 步
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs text-slate-400 select-none">
            {isOpen ? '收起思考' : '展开思考'}
          </span>
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3 space-y-2 border-t border-indigo-900/30 font-mono text-xs text-slate-300 bg-slate-950/30">
          {thoughts.map((step, idx) => (
            <div key={step.id || idx} className="flex items-start gap-2.5 group">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
              <div className="flex-1 leading-relaxed">
                <span className="text-slate-200">{step.content}</span>
                <span className="ml-2 text-[10px] text-slate-500 font-sans">
                  {formatTime(step.timestamp)}
                </span>
              </div>
            </div>
          ))}

          {isActivelyThinking && (
            <div className="flex items-center gap-2 pt-1 text-indigo-400 text-xs">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span className="animate-pulse">Agent 正在推演下一步行动...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
