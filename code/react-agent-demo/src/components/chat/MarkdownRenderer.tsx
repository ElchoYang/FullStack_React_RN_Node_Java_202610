import React from 'react';
import { CopyButton } from '../common/CopyButton';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // 拆分代码块与普通文本
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 leading-relaxed text-slate-200 text-sm break-words">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // 代码块
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          const language = /^[a-zA-Z0-9_-]+$/.test(firstLine) ? firstLine : '';
          const codeContent = language ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <div
              key={index}
              className="my-3 rounded-lg overflow-hidden border border-slate-700/80 bg-slate-950 font-mono text-xs"
            >
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/80 border-b border-slate-700/60 text-slate-400 font-sans">
                <span className="text-xs font-medium text-slate-300">
                  {language || 'code'}
                </span>
                <CopyButton text={codeContent} />
              </div>
              <pre className="p-3 overflow-x-auto text-emerald-300 whitespace-pre">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }

        // 普通文本段落处理
        const paragraphs = part.split(/\n{2,}/);

        return (
          <React.Fragment key={index}>
            {paragraphs.map((paragraph, pIdx) => {
              const lines = paragraph.split('\n');

              return (
                <div key={pIdx} className="space-y-1">
                  {lines.map((line, lIdx) => {
                    const trimmed = line.trim();

                    // 标题处理
                    if (trimmed.startsWith('### ')) {
                      return (
                        <h4 key={lIdx} className="text-base font-semibold text-indigo-300 pt-2 pb-1">
                          {renderInline(trimmed.slice(4))}
                        </h4>
                      );
                    }
                    if (trimmed.startsWith('## ')) {
                      return (
                        <h3 key={lIdx} className="text-lg font-bold text-indigo-200 pt-3 pb-1 border-b border-slate-800">
                          {renderInline(trimmed.slice(3))}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith('# ')) {
                      return (
                        <h2 key={lIdx} className="text-xl font-bold text-white pt-3 pb-1.5 border-b border-slate-800">
                          {renderInline(trimmed.slice(2))}
                        </h2>
                      );
                    }

                    // 列表项处理
                    if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                      return (
                        <div key={lIdx} className="flex items-start gap-2 pl-2">
                          <span className="text-indigo-400 select-none mt-0.5">•</span>
                          <span className="flex-1">{renderInline(trimmed.slice(2))}</span>
                        </div>
                      );
                    }

                    // 数字序号列表处理
                    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
                    if (numMatch) {
                      return (
                        <div key={lIdx} className="flex items-start gap-2 pl-2">
                          <span className="text-indigo-400 font-mono text-xs select-none mt-0.5">
                            {numMatch[1]}.
                          </span>
                          <span className="flex-1">{renderInline(numMatch[2])}</span>
                        </div>
                      );
                    }

                    // 引用块处理
                    if (trimmed.startsWith('> ')) {
                      return (
                        <blockquote
                          key={lIdx}
                          className="pl-3 border-l-2 border-indigo-500 text-slate-400 italic my-1"
                        >
                          {renderInline(trimmed.slice(2))}
                        </blockquote>
                      );
                    }

                    if (!trimmed) {
                      return <div key={lIdx} className="h-1" />;
                    }

                    return <p key={lIdx}>{renderInline(line)}</p>;
                  })}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/**
 * 渲染行内元素: **粗体**, *斜体*, `行内代码`
 */
function renderInline(text: string): React.ReactNode {
  // 分割粗体与行内代码
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

  return tokens.map((token, i) => {
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-800 text-amber-300 font-mono text-xs border border-slate-700/60"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    }
    return token;
  });
}
