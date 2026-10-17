import { useState, useTransition, useOptimistic, use } from 'react';
import { Search, Plus, Sparkles, RefreshCw, Layers, Zap, AlertCircle } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../../components/product/ProductCard';
import { ProductCreateModal } from '../../components/product/ProductCreateModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { AuthContext } from '../../contexts/AuthContext';

type OptimisticAction = {
  type: 'LIKE';
  id: string;
};

export function ProductListPage() {
  // 1. React 19 use(Context)：原生直接消费全局鉴权上下文
  const auth = use(AuthContext);

  // 2. 自定义 Hook useProducts：自然、内聚地管理业务数据请求与网络生命周期
  const { products, loading, error, refresh, likeProduct } = useProducts();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 3. React 19 useTransition：平滑非阻塞的并发过滤体验
  const [isFiltering, startFiltering] = useTransition();

  // 4. React 19 useOptimistic：点赞/投票的 0 延迟乐观更新
  const [optimisticProducts, setOptimisticProducts] = useOptimistic(
    products,
    (currentList, action: OptimisticAction) => {
      if (action.type === 'LIKE') {
        return currentList.map((p) =>
          p.id === action.id ? { ...p, likes: p.likes + 1 } : p
        );
      }
      return currentList;
    }
  );

  // 处理点赞（通过 startFiltering 包裹触发 useOptimistic 立即渲染）
  const handleLike = async (id: string, currentLikes: number) => {
    startFiltering(async () => {
      // ① 立即派发乐观数值更新（UI 无感知延迟）
      setOptimisticProducts({ type: 'LIKE', id });
      // ② 调用业务 Hook 执行网络交互与状态同步
      await likeProduct(id, currentLikes);
    });
  };

  // 过滤数据
  const filteredProducts = optimisticProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    { key: 'All', label: '全部模型' },
    { key: 'Reasoning', label: '🧠 深度推理 (Reasoning)' },
    { key: 'Code', label: '💻 编程开发 (Code)' },
    { key: 'Multimodal', label: '👁️ 多模态 (Multimodal)' },
    { key: 'General', label: '🌐 通用智能 (General)' },
  ];

  return (
    <div className="space-y-6">
      {/* 顶部标语与操作区 */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>React 19 现代工程范式</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              全球前沿大模型 (LLMs) 全景产品库
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              汇聚业界主流推理、代码与多模态大模型。本模块展示 React 19 现代工程实践：
              自定义 Hook <span className="font-mono text-emerald-300">useProducts</span> 业务解耦、
              <span className="font-mono text-purple-300 mx-1">useOptimistic</span> 乐观点赞、
              <span className="font-mono text-blue-300 mx-1">useActionState</span> 表单处理 与
              <span className="font-mono text-amber-300 ml-1">use(Context)</span> 状态消费。
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => void refresh()}
              disabled={loading}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-sm font-medium transition cursor-pointer disabled:opacity-50"
              title="刷新数据"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>刷新</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>收录新模型</span>
            </button>
          </div>
        </div>

        {/* 鉴权操作员信息 */}
        {auth?.user && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center space-x-2 text-xs text-slate-400">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>当前登录操作员：</span>
            <span className="text-white font-medium">{auth.user.name}</span>
            <span>({auth.user.role})</span>
          </div>
        )}
      </div>

      {/* 错误提示栏 */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold">数据加载异常：</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* 搜索与分类过渡栏 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索模型名称、厂商（如 Anthropic、DeepSeek）..."
              className="w-full pl-9.5 pr-4 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
            />
          </div>

          <div className="text-xs text-gray-500 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-gray-400" />
            <span>当前收录</span>
            <span className="font-bold text-gray-900">{filteredProducts.length}</span>
            <span>个大模型产品</span>
          </div>
        </div>

        {/* 分类切换 */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  startFiltering(() => {
                    setSelectedCategory(cat.key);
                  });
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
          {isFiltering && (
            <span className="text-xs text-blue-600 font-medium animate-pulse ml-2">
              切换中...
            </span>
          )}
        </div>
      </div>

      {/* 大模型产品网格列表 */}
      {loading && products.length === 0 ? (
        <div className="py-20 flex justify-center bg-white rounded-2xl border border-gray-100">
          <LoadingSpinner size="lg" label="正在拉取大模型产品数据..." />
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="未检索到匹配的大模型"
          description="尝试调整分类或关键词，亦可使用上方按钮录入新的大模型产品。"
          actionText="收录新大模型"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onLike={handleLike}
            />
          ))}
        </div>
      )}

      {/* 新增模型弹窗（React 19 useActionState + useFormStatus） */}
      <ProductCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => void refresh()}
      />
    </div>
  );
}

export default ProductListPage;
