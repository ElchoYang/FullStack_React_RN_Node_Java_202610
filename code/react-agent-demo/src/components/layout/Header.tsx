import React from 'react';
import { Bot, RefreshCw, Trash2, Settings, Menu, Wifi, WifiOff } from 'lucide-react';
import type { BackendHealthState } from '../../hooks/useBackendHealth';

interface HeaderProps {
  health: BackendHealthState;
  onClearHistory: () => void;
  onOpenSettings: () => void;
  onToggleSidebar?: () => void;
  messageCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  onClearHistory,
  onOpenSettings,
  onToggleSidebar,
  messageCount,
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 flex items-center justify-between z-20">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <Menu size={18} />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/40">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-tight">
                React Agent Studio
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                v1.0 SSE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              对接 Node.js AI Agent 企业级流式后端
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* 后端服务连通状态指示器 */}
        <button
          type="button"
          onClick={() => health.recheck()}
          title={health.isOnline ? `后端在线 (${health.latency}ms) - 点击重新检测` : `后端未启动或不可达: ${health.error} - 点击重试`}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all cursor-pointer ${
            health.isOnline
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-950/60'
              : 'bg-red-950/40 border-red-800/60 text-red-300 hover:bg-red-950/60 animate-pulse'
          }`}
        >
          {health.isChecking ? (
            <RefreshCw size={12} className="animate-spin text-slate-400" />
          ) : health.isOnline ? (
            <Wifi size={12} className="text-emerald-400" />
          ) : (
            <WifiOff size={12} className="text-red-400" />
          )}

          <span className="font-medium text-[11px]">
            {health.isChecking
              ? '检测中...'
              : health.isOnline
              ? `服务在线 · ${health.latency}ms`
              : '后端离线 (端口3001)'}
          </span>
        </button>

        {/* 清空历史按钮 */}
        {messageCount > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="清空当前所有会话历史"
          >
            <Trash2 size={16} />
          </button>
        )}

        {/* 设置按钮 */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="系统配置"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
};
