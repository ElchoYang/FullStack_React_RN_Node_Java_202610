import { useState, useEffect, useTransition } from 'react';
import { Search, Plus, Sparkles, RefreshCw } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../../components/product/ProductCard';
import { ProductCreateModal } from '../../components/product/ProductCreateModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import type { Product } from '../../types/product';

export function ProductListPage() {
  useAuth();
  const { products, loading, error, refresh, likeProduct } = useProducts();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [, startTransition] = useTransition();
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);

  useEffect(() => {
    setDisplayProducts(products);
  }, [products]);

  const handleLike = async (id: string, currentLikes: number) => {
    setDisplayProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );

    try {
      await likeProduct(id, currentLikes);
    } catch {
      setDisplayProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, likes: currentLikes } : p))
      );
    }
  };

  const handleSearchChange = (value: string) => {
    startTransition(() => {
      setSearchTerm(value);
    });
  };

  const filteredProducts = displayProducts.filter((product: Product) => {
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
              <span>React 19 函数式简明开发</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              全球前沿大模型 (LLMs) 全景产品库
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              汇聚业界主流推理、代码与多模态大模型。本模块展示简洁的 React 19 函数式编程风格：
              纯粹函数组件、常规 Hook 解耦与平滑过渡体验。
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => void refresh()}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-sm font-medium transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>刷新数据</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md transition flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>收录新模型</span>
            </button>
          </div>
        </div>
      </div>

      {/* 搜索与分类筛选控制栏 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* 分类胶囊标签切换 */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === c.key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* 搜索框 */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索模型全称、厂商、描述..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* 内容区域 */}
      {loading && displayProducts.length === 0 ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner label="正在加载全球大模型产品库..." />
        </div>
      ) : error ? (
        <EmptyState
          title="数据加载异常"
          description={error}
          actionText="点击重试"
          onAction={() => void refresh()}
        />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="未检索到匹配的模型"
          description="没有符合当前分类或搜索关键词的模型产品，请尝试调整筛选条件或收录新模型。"
          actionText="收录新模型"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onLike={(id, likes) => void handleLike(id, likes)}
            />
          ))}
        </div>
      )}

      {/* 新增模型弹窗 */}
      <ProductCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => void refresh()}
      />
    </div>
  );
}

export default ProductListPage;
