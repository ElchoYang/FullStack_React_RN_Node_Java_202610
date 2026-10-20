import React, { useRef, useEffect } from 'react';
import { Bot, Sparkles, BrainCircuit, Wrench, Zap } from 'lucide-react';
import type { ChatMessage } from '../../types/agent';
import { MessageBubble } from './MessageBubble';

interface ChatContainerProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSendPreset: (prompt: string) => void;
  autoScroll?: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isStreaming,
  onSendPreset,
  autoScroll = true,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // 消息变动时自动滚动到底部
  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming, autoScroll]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-900/30">
            <Bot size={36} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              AI Agent 企业级流式智能体
            </h1>
            <p className="mt-2 text-slate-400 text-sm max-w-md mx-auto">
              基于 React 19 前端与 Node.js + Express + SSE 后端驱动。深度支持 CoT 思考链解析与自动化工具调用 (ReAct)。
            </p>
          </div>

          {/* 核心特性卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-left pt-2">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center mb-2.5">
                <Zap size={18} />
              </div>
              <h3 className="font-semibold text-slate-200 text-sm">SSE 流式推流</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                无需等待全部生成，打字机般毫秒级逐字推流，体验丝滑流畅。
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-purple-500/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center mb-2.5">
                <BrainCircuit size={18} />
              </div>
              <h3 className="font-semibold text-slate-200 text-sm">CoT 深度思考流</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                实时追踪智能体的思维推理链 (Thought)，透明化展示任务规划。
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center mb-2.5">
                <Wrench size={18} />
              </div>
              <h3 className="font-semibold text-slate-200 text-sm">ReAct 工具生态</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                可自主调用天气查询、精确数学算式器、服务器时钟等工具。
              </p>
            </div>
          </div>

          {/* 推荐试一试 */}
          <div className="pt-4 border-t border-slate-800">
            <div className="text-xs font-medium text-slate-400 mb-3 flex items-center justify-center gap-1.5">
              <Sparkles size={14} className="text-indigo-400" />
              <span>点击下方示例卡片即可快速体验智能体联动</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => onSendPreset('北京今天天气怎么样？')}
                className="p-3 text-left rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 hover:border-amber-500/40 transition-all text-slate-300 hover:text-white cursor-pointer group"
              >
                <div className="font-medium text-amber-300 group-hover:text-amber-200">
                  🌤️ 触发天气工具:
                </div>
                <div className="text-slate-400 truncate mt-0.5">
                  "北京今天天气怎么样？"
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSendPreset('帮我计算一下 256 * 48 + 1024 / 2')}
                className="p-3 text-left rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 hover:border-emerald-500/40 transition-all text-slate-300 hover:text-white cursor-pointer group"
              >
                <div className="font-medium text-emerald-300 group-hover:text-emerald-200">
                  🧮 触发数学运算工具:
                </div>
                <div className="text-slate-400 truncate mt-0.5">
                  "帮我计算一下 256 * 48 + 1024 / 2"
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};
