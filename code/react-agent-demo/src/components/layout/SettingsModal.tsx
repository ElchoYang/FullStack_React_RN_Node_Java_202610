import React, { useState } from 'react';
import { X, Server, Check, RefreshCw, Sliders } from 'lucide-react';
import type { AgentConfig } from '../../types/agent';
import { AgentApiService } from '../../services/agentApi';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AgentConfig;
  onSave: (config: Partial<AgentConfig>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [backendUrl, setBackendUrl] = useState(config.backendUrl);
  const [autoScroll, setAutoScroll] = useState(config.autoScroll);
  const [showThoughtStream, setShowThoughtStream] = useState(config.showThoughtStream);
  const [showToolCalls, setShowToolCalls] = useState(config.showToolCalls);
  const [testStatus, setTestStatus] = useState<{ testing: boolean; success?: boolean; msg?: string }>({
    testing: false,
  });

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus({ testing: true });
    const start = performance.now();
    try {
      const res = await AgentApiService.checkHealth(backendUrl);
      const latency = Math.round(performance.now() - start);
      setTestStatus({
        testing: false,
        success: true,
        msg: `连接成功! 延迟: ${latency}ms, 服务: ${res.service}`,
      });
    } catch (e: any) {
      setTestStatus({
        testing: false,
        success: false,
        msg: e.message || '连接失败，请检查 nodejs-agent-demo 是否启动',
      });
    }
  };

  const handleSave = () => {
    onSave({
      backendUrl: backendUrl.trim(),
      autoScroll,
      showThoughtStream,
      showToolCalls,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 font-semibold text-base text-white">
            <Sliders size={18} className="text-indigo-400" />
            <span>智能体通信与显示设置</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 后端地址配置 */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Server size={14} className="text-indigo-400" />
            <span>Node.js Agent 后端 API 地址</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              placeholder="默认留空走 Vite 代理 (/api) 或填 http://localhost:3001"
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus.testing}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={12} className={testStatus.testing ? 'animate-spin' : ''} />
              <span>测速</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            提示：留空时通过 Vite 代理访问本地端口 3001；跨域时也可直接填写完整地址如 <code className="text-indigo-400">http://localhost:3001</code>。
          </p>
          {testStatus.msg && (
            <div
              className={`p-2.5 rounded-lg text-xs border ${
                testStatus.success
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : 'bg-red-950/40 border-red-800/60 text-red-300'
              }`}
            >
              {testStatus.msg}
            </div>
          )}
        </div>

        {/* 交互偏好开关 */}
        <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-slate-300 group-hover:text-white">流式打字时自动滚动到底部</span>
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-slate-300 group-hover:text-white">展开显示深度思考链 (Thought CoT)</span>
            <input
              type="checkbox"
              checked={showThoughtStream}
              onChange={(e) => setShowThoughtStream(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-slate-300 group-hover:text-white">展示工具执行卡片与入参/出参</span>
            <input
              type="checkbox"
              checked={showToolCalls}
              onChange={(e) => setShowToolCalls(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700 cursor-pointer"
            />
          </label>
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check size={14} />
            <span>保存配置</span>
          </button>
        </div>
      </div>
    </div>
  );
};
