import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: number;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, className = '', size = 14 }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('复制失败:', e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? '已复制' : '复制内容'}
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 rounded transition-all cursor-pointer ${className}`}
    >
      {copied ? (
        <>
          <Check size={size} className="text-emerald-400" />
          <span className="text-emerald-400 font-medium">已复制</span>
        </>
      ) : (
        <>
          <Copy size={size} />
          <span>复制</span>
        </>
      )}
    </button>
  );
};
