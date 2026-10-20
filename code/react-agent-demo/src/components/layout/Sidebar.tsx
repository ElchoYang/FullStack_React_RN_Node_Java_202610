import React from 'react';
import {
  BrainCircuit,
  Wrench,
  Radio,
  CloudSun,
  Calculator,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  return (
    <>
      {/* 移动端遮罩层 */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* 顶部标题与关闭按钮 */}
        <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Radio size={16} className="text-indigo-400" />
            <span>智能体工作台</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 可滚动的内容区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs text-slate-300">
          {/* 1. 架构理念 (ReAct Loop) */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <BrainCircuit size={15} className="text-indigo-400" />
              <span>ReAct 智能体循环范式</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <div>
                  <div className="text-slate-200 font-medium">Thought (思考推理)</div>
                  <div className="text-[11px] text-slate-400">大模型拆解意图与规划下一步</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-950 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <div>
                  <div className="text-slate-200 font-medium">Action (调用工具)</div>
                  <div className="text-[11px] text-slate-400">派发执行外部函数与 API</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <div>
                  <div className="text-slate-200 font-medium">Observation (观察回传)</div>
                  <div className="text-[11px] text-slate-400">拿到工具执行真实结果</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-950 text-purple-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                <div>
                  <div className="text-slate-200 font-medium">Stream (流式汇总)</div>
                  <div className="text-[11px] text-slate-400">SSE 协议逐字打字机推流</div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 当前注册工具库 */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Wrench size={15} className="text-emerald-400" />
              <span>智能体工具箱 (Toolbox)</span>
            </div>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  onSelectPrompt('北京今天天气怎么样？');
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-medium text-slate-200 group-hover:text-amber-300">
                    <CloudSun size={14} className="text-amber-400" />
                    <span>get_weather</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Tool</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  查询各大城市实时气温、天气状况、风力与湿度
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectPrompt('帮我计算 1024 * 768 / 16 + 500');
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-medium text-slate-200 group-hover:text-emerald-300">
                    <Calculator size={14} className="text-emerald-400" />
                    <span>calculator</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Tool</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  执行任意加减乘除与括号的精确高精度数学算式
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectPrompt('现在系统时间是几点？');
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-medium text-slate-200 group-hover:text-sky-300">
                    <Clock size={14} className="text-sky-400" />
                    <span>get_current_time</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Tool</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  获取服务器精准时区时间与标准格式化时间戳
                </p>
              </button>
            </div>
          </div>

          {/* 3. 后端对接技术规约 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <BookOpen size={15} className="text-purple-400" />
              <span>接口对接规约</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 text-[11px] space-y-1.5 text-slate-400 font-mono">
              <div className="flex items-center gap-1 text-slate-300">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>POST /api/agent/chat/stream</span>
              </div>
              <div className="pl-4 text-[10px] text-slate-500">
                Body: {`{ "prompt": string }`}
              </div>
              <div className="flex items-center gap-1 text-slate-300 pt-1">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>GET /api/health</span>
              </div>
              <div className="pl-4 text-[10px] text-slate-500">
                响应服务运行状态与版本
              </div>
            </div>
          </div>
        </div>

        {/* 底部版权与作者 */}
        <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
          <Sparkles size={12} className="text-indigo-400" />
          <span>FullStack React + Node.js Agent</span>
        </div>
      </aside>
    </>
  );
};
