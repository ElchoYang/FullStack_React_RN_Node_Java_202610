import React from 'react';
import { User, Bot, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import type { ChatMessage } from '../../types/agent';
import { ThoughtAccordion } from './ThoughtAccordion';
import { ToolCallCard } from './ToolCallCard';
import { MarkdownRenderer } from './MarkdownRenderer';
import { CopyButton } from '../common/CopyButton';
import { formatTime } from '../../utils/format';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-6 group">
        <div className="flex items-start gap-3 max-w-[85%] md:max-w-[75%]">
          <div className="flex flex-col items-end">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-md shadow-indigo-950/20 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
              <span>{formatTime(message.timestamp)}</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300">
            <User size={16} />
          </div>
        </div>
      </div>
    );
  }

  // Assistant 智能体回复
  const hasThoughts = message.thoughts && message.thoughts.length > 0;
  const hasToolCalls = message.toolCalls && message.toolCalls.length > 0;
  const hasContent = Boolean(message.content);
  const isStreaming = Boolean(message.isStreaming);

  return (
    <div className="flex justify-start mb-6 group">
      <div className="flex items-start gap-3 max-w-[95%] md:max-w-[85%]">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 text-white shadow-md shadow-indigo-900/30">
          <Bot size={17} />
        </div>

        <div className="flex-1 min-w-0">
          {/* 消息框体 */}
          <div className="bg-slate-900/90 border border-slate-800/80 px-4 py-3.5 rounded-2xl rounded-tl-sm shadow-lg text-slate-100">
            {/* 1. 深度思考过程 (Thought CoT) */}
            {hasThoughts && (
              <ThoughtAccordion thoughts={message.thoughts} isStreaming={isStreaming} />
            )}

            {/* 2. 外部工具调用展示 (Tool Calling) */}
            {hasToolCalls && (
              <div className="space-y-2 mb-3">
                {message.toolCalls.map((toolCall) => (
                  <ToolCallCard key={toolCall.id} toolCall={toolCall} />
                ))}
              </div>
            )}

            {/* 3. 最终流式文本回答 */}
            {hasContent && (
              <div className="relative">
                <MarkdownRenderer content={message.content} />
                {isStreaming && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-400 animate-pulse align-middle" />
                )}
              </div>
            )}

            {/* 流式等待首个 token 的占位提示 */}
            {!hasContent && isStreaming && !hasThoughts && !hasToolCalls && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>AI Agent 正在思考并建立流式响应...</span>
              </div>
            )}

            {/* 错误提示 */}
            {message.error && (
              <div className="mt-3 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-red-200">生成出错</div>
                  <div>{message.error}</div>
                </div>
              </div>
            )}
          </div>

          {/* 底部元数据栏 */}
          <div className="flex items-center gap-3 mt-1.5 px-1 text-[11px] text-slate-500">
            <span>{formatTime(message.timestamp)}</span>

            {message.finishReason && (
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 px-1.5 py-0.2 rounded bg-slate-800/60">
                <CheckCircle size={10} className="text-emerald-400" />
                {message.finishReason === 'abort' ? '已中止' : '已完成'}
              </span>
            )}

            {message.usage && (
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                <Zap size={10} className="text-amber-400" />
                Tokens: {message.usage.totalTokens} (Prompt: {message.usage.promptTokens}, Resp: {message.usage.completionTokens})
              </span>
            )}

            {hasContent && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                <CopyButton text={message.content} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
