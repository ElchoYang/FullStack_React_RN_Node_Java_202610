import { Heart, Layers, ArrowUpRight, DollarSign, Sparkles, Building2 } from 'lucide-react';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onLike: (id: string, currentLikes: number) => void;
  isLiking?: boolean;
}

const categoryStyles: Record<string, { bg: string; text: string; border: string }> = {
  Reasoning: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Code: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  Multimodal: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  General: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
};

export function ProductCard({ product, onLike }: ProductCardProps) {
  const catStyle = categoryStyles[product.category] || categoryStyles.General;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* 顶部：厂商与状态 */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-gray-500">
            <Building2 className="w-3.5 h-3.5 text-gray-400" />
            <span>{product.provider}</span>
          </div>

          <div className="flex items-center space-x-2">
            {product.badge && (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{product.badge}</span>
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
            >
              {product.category}
            </span>
          </div>
        </div>

        {/* 模型名称 */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
          <span>{product.name}</span>
          <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </h3>

        {/* 描述信息 */}
        <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
          {product.description}
        </p>

        {/* 关键性能与规格参数 */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100 text-xs">
          <div className="flex items-center space-x-1.5 text-gray-600">
            <Layers className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-gray-400">上下文:</span>
            <span className="font-semibold text-gray-800">{product.contextWindow}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-gray-600">
            <DollarSign className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-gray-400">定价:</span>
            <span className="font-semibold text-gray-800 truncate" title={product.pricing}>
              {product.pricing}
            </span>
          </div>
        </div>
      </div>

      {/* 底部点赞与热度（支持 React 19 useOptimistic 即时反馈） */}
      <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] text-gray-400 font-mono">
          状态: <span className="text-emerald-600 font-medium">{product.status}</span>
        </span>

        <button
          onClick={() => onLike(product.id, product.likes)}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 active:scale-95 transition-all cursor-pointer"
          title="使用 React 19 useOptimistic 乐观点赞"
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>{product.likes.toLocaleString()}</span>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
