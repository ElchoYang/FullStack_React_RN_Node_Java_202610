import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { X, Sparkles, AlertCircle, Cpu, Layers, DollarSign } from 'lucide-react';
import { productService } from '../../api/productService';
import type { ModelCategory, ModelStatus, ProductFormData } from '../../types/product';

interface ActionState {
  success: boolean;
  errors?: {
    name?: string;
    provider?: string;
    description?: string;
  };
  error?: string | null;
}

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// React 19 / react-dom: useFormStatus 子组件自动感知表单 pending 状态
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
    >
      {pending ? (
        <>
          <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          <span>正在提交 Action...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          <span>发布模型</span>
        </>
      )}
    </button>
  );
}

export function ProductCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: ProductCreateModalProps) {
  // React 19: useActionState 统一处理表单自定义校验与异步提交
  const [state, formAction, isPending] = useActionState(
    async (_prevState: ActionState, formData: FormData): Promise<ActionState> => {
      const name = (formData.get('name') as string)?.trim();
      const provider = (formData.get('provider') as string)?.trim();
      const category = formData.get('category') as ModelCategory;
      const contextWindow = (formData.get('contextWindow') as string)?.trim();
      const maxOutput = (formData.get('maxOutput') as string)?.trim();
      const pricing = (formData.get('pricing') as string)?.trim();
      const status = (formData.get('status') as ModelStatus) || 'Active';
      const description = (formData.get('description') as string)?.trim();
      const badge = (formData.get('badge') as string)?.trim();

      // 自定义表单校验（非浏览器原生气泡，按字段精准收集）
      const errors: ActionState['errors'] = {};

      if (!name) {
        errors.name = '模型全称为必填项，请输入模型名称（如 Claude 3.7 Sonnet）';
      } else if (name.length < 2) {
        errors.name = '模型名称过短，请输入至少 2 个字符';
      }

      if (!provider) {
        errors.provider = '出品机构为必填项，请输入厂商名称（如 Anthropic / OpenAI）';
      }

      if (!description) {
        errors.description = '核心特性与描述为必填项，请提供模型的简要介绍';
      } else if (description.length < 6) {
        errors.description = '特性描述过短，请提供至少 6 个字符的完整说明';
      }

      // 如果存在校验失败项，直接返回字段级错误信息并中断提交
      if (Object.keys(errors).length > 0) {
        return { success: false, errors };
      }

      try {
        const payload: ProductFormData = {
          name,
          provider,
          category: category || 'General',
          contextWindow: contextWindow || '128K',
          maxOutput: maxOutput || '16K',
          pricing: pricing || '$1.00 / $3.00',
          status,
          description,
          badge: badge || undefined,
        };

        await productService.createProduct(payload);
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '提交失败，请重试';
        return { success: false, error: message };
      }
    },
    { success: false }
  );

  // 提交成功后自动通知父组件刷新并关闭弹窗
  useEffect(() => {
    if (state.success) {
      onSuccess();
      onClose();
    }
  }, [state.success, onSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 遮罩背景 */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => !isPending && onClose()}
      />

      {/* 模态框主体 */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* 头部 */}
        <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">收录新的大模型产品</h3>
              <p className="text-xs text-gray-500">
                React 19 <code className="text-blue-600 font-mono">useActionState</code> 字段级校验范式
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 通用网络/服务端异常提示 */}
        {state.error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center space-x-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* 表单内容：设置 noValidate 禁用原生浏览器气泡提示 */}
        <form
          action={formAction}
          noValidate
          className="p-6 space-y-4 overflow-y-auto flex-1"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 模型名称 */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                模型全称 <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                placeholder="如 Claude 3.7 Sonnet"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border transition-colors ${
                  state.errors?.name
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/30 text-gray-900'
                    : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900'
                }`}
              />
              {state.errors?.name && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center space-x-1">
                  <span>⚠</span>
                  <span>{state.errors.name}</span>
                </p>
              )}
            </div>

            {/* 出品厂商 */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                出品机构 / 厂商 <span className="text-red-500">*</span>
              </label>
              <input
                name="provider"
                placeholder="如 Anthropic / OpenAI"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border transition-colors ${
                  state.errors?.provider
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/30 text-gray-900'
                    : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900'
                }`}
              />
              {state.errors?.provider && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center space-x-1">
                  <span>⚠</span>
                  <span>{state.errors.provider}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">能力分类</label>
              <select
                name="category"
                defaultValue="Reasoning"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              >
                <option value="Reasoning">Reasoning (逻辑推理)</option>
                <option value="Code">Code (代码增强)</option>
                <option value="Multimodal">Multimodal (多模态)</option>
                <option value="General">General (通用智能)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">状态</label>
              <select
                name="status"
                defaultValue="Active"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              >
                <option value="Active">Active (正式可用)</option>
                <option value="Beta">Beta (公测中)</option>
                <option value="Preview">Preview (预览阶段)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-gray-400" />
                <span>上下文窗口</span>
              </label>
              <input
                name="contextWindow"
                placeholder="如 200K / 1M"
                defaultValue="128K"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">最大输出</label>
              <input
                name="maxOutput"
                placeholder="如 64K / 16K"
                defaultValue="16K"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                <span>定价区间</span>
              </label>
              <input
                name="pricing"
                placeholder="如 $3.00 / $15.00"
                defaultValue="$1.00 / $3.00"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              特色标签 (可选)
            </label>
            <input
              name="badge"
              placeholder="如 Top Open-Source / Recommended"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          {/* 核心特性与描述 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              核心特性与描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="简明描述该模型的架构特点、优势能力与适用业务场景..."
              className={`w-full px-3.5 py-2 text-sm rounded-lg border leading-relaxed transition-colors ${
                state.errors?.description
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/30 text-gray-900'
                  : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900'
              }`}
            />
            {state.errors?.description && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center space-x-1">
                <span>⚠</span>
                <span>{state.errors.description}</span>
              </p>
            )}
          </div>

          {/* 底部按钮栏 */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              取消
            </button>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductCreateModal;
