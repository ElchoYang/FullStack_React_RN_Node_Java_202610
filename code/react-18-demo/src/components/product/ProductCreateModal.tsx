import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, Cpu, Layers, DollarSign } from 'lucide-react';
import { productService } from '../../api/productService';
import type { ProductFormData } from '../../types/product';

interface FormErrors {
  name?: string;
  provider?: string;
  description?: string;
}

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: ProductCreateModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    provider: '',
    category: 'Reasoning',
    contextWindow: '128K',
    maxOutput: '16K',
    pricing: '$1.00 / $3.00',
    status: 'Active',
    description: '',
    badge: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // 重置表单
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        provider: '',
        category: 'Reasoning',
        contextWindow: '128K',
        maxOutput: '16K',
        pricing: '$1.00 / $3.00',
        status: 'Active',
        description: '',
        badge: '',
      });
      setErrors({});
      setServerError(null);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = '模型全称为必填项，请输入模型名称（如 Claude 3.7 Sonnet）';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '模型名称过短，请输入至少 2 个字符';
    }

    if (!formData.provider.trim()) {
      newErrors.provider = '出品机构为必填项，请输入厂商名称（如 Anthropic / OpenAI）';
    }

    if (!formData.description.trim()) {
      newErrors.description = '核心特性与描述为必填项，请提供模型的简要介绍';
    } else if (formData.description.trim().length < 6) {
      newErrors.description = '特性描述过短，请提供至少 6 个字符的完整说明';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      setServerError(null);
      await productService.createProduct({
        ...formData,
        badge: formData.badge?.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '提交失败，请重试';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 遮罩背景 */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && onClose()}
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
              <p className="text-xs text-gray-500">标准受控表单校验范式</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 异常提示 */}
        {serverError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center space-x-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 模型名称 */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                模型全称 <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="如 Claude 3.7 Sonnet"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border transition-colors ${
                  errors.name
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/30 text-gray-900'
                    : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center space-x-1">
                  <span>⚠</span>
                  <span>{errors.name}</span>
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
                value={formData.provider}
                onChange={handleChange}
                placeholder="如 Anthropic / OpenAI"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border transition-colors ${
                  errors.provider
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/30 text-gray-900'
                    : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900'
                }`}
              />
              {errors.provider && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center space-x-1">
                  <span>⚠</span>
                  <span>{errors.provider}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">能力分类</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
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
                value={formData.status}
                onChange={handleChange}
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
                value={formData.contextWindow}
                onChange={handleChange}
                placeholder="如 200K / 1M"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">最大输出</label>
              <input
                name="maxOutput"
                value={formData.maxOutput}
                onChange={handleChange}
                placeholder="如 64K / 16K"
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
                value={formData.pricing}
                onChange={handleChange}
                placeholder="如 $3.00 / $15.00"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">特色标签 (可选)</label>
            <input
              name="badge"
              value={formData.badge || ''}
              onChange={handleChange}
              placeholder="如 Top Open-Source / Recommended"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              核心特性与描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="简明描述该模型的架构特点、优势能力与适用业务场景..."
              className={`w-full px-3.5 py-2 text-sm rounded-lg border leading-relaxed transition-colors ${
                errors.description
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/30 text-gray-900'
                  : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center space-x-1">
                <span>⚠</span>
                <span>{errors.description}</span>
              </p>
            )}
          </div>

          {/* 底部按钮栏 */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>正在提交...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>发布模型</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductCreateModal;
