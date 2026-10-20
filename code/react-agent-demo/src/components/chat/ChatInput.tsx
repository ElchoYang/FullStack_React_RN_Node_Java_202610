import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, CornerDownLeft } from 'lucide-react';
import { PromptPresets } from './PromptPresets';

interface ChatInputProps {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onStop,
  isStreaming,
  disabled = false,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 随着文本内容自动计算高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming || disabled) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 监听回车键发送，Shift+Enter 进行折行
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-slate-800 bg-slate-900/95 backdrop-blur px-4 pt-2 pb-4">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* 预设快捷提问 */}
        <PromptPresets onSelect={(presetPrompt) => onSend(presetPrompt)} disabled={isStreaming} />

        {/* 输入框主容器 */}
        <form onSubmit={handleSubmit} className="relative rounded-2xl bg-slate-800/90 border border-slate-700/80 focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-inner">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              isStreaming
                ? 'AI Agent 正在全力响应中...'
                : '输入问题，如查天气、数学运算、查时间，或任何指令 (Enter 发送，Shift+Enter 换行)...'
            }
            className="w-full resize-none bg-transparent px-4 py-3.5 pr-24 text-sm text-slate-100 placeholder-slate-400 focus:outline-none disabled:opacity-50 min-h-[48px] max-h-[160px]"
          />

          <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-white text-xs font-medium shadow-md shadow-red-950/40 transition-all cursor-pointer animate-pulse"
                title="停止当前响应生成"
              >
                <Square size={13} className="fill-current" />
                <span>停止生成</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() || disabled}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white disabled:text-slate-400 shadow-md shadow-indigo-950/40 transition-all cursor-pointer disabled:cursor-not-allowed"
                title="发送提问 (Enter)"
              >
                <Send size={15} />
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="flex items-center gap-1">
            <CornerDownLeft size={11} /> Enter 发送，Shift + Enter 换行
          </span>
          <span>连接状态: SSE 流式管道已就绪</span>
        </div>
      </div>
    </div>
  );
};
