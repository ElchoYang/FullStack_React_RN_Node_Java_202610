import { Suspense, useState, useTransition } from 'react';
import { Button, Space } from 'antd';
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { fetchProductData, type ProductItem, type ProductModuleData } from '@/api/product.api';
import { useI18n } from '@/context/I18nContext';
import { ProductContent } from './ProductContent';
import { ProductSkeleton } from './ProductSkeleton';
import { ProductErrorFallback } from './ProductErrorFallback';
import { ProductModal } from './components/ProductModal';

const DEFAULT_CATEGORIES = [
  '全部',
  '数码智能',
  '办公外设',
  '网络通信',
  '智能家居',
  '配件耗材',
];

export function ProductPage() {
  const { t } = useI18n();

  // 统一的大模块 Promise 集合 (React 19 核心规范)
  const [productDataPromise, setProductDataPromise] = useState<Promise<ProductModuleData>>(() =>
    fetchProductData()
  );
  const [isPending, startTransition] = useTransition();

  // 弹窗与本地新增商品状态
  const [modalOpen, setModalOpen] = useState(false);
  const [addedProducts, setAddedProducts] = useState<ProductItem[]>([]);

  const handleRefresh = () => {
    startTransition(() => {
      setAddedProducts([]);
      setProductDataPromise(fetchProductData());
    });
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleAddProductSuccess = (formData: Partial<ProductItem>) => {
    const newProd: ProductItem = {
      id: `p-${Date.now()}`,
      name: formData.name || '全新商品',
      sku: formData.sku || `SKU-${Date.now().toString().slice(-4)}`,
      category: formData.category || '数码智能',
      price: formData.price || 199,
      stock: formData.stock || 10,
      sales: 0,
      status: (formData.stock || 0) > 10 ? 'in_stock' : (formData.stock || 0) > 0 ? 'low_stock' : 'out_of_stock',
      rating: formData.rating || 5,
    };

    setAddedProducts((prev) => [newProd, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* 顶部标题栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('product.title')}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{t('product.desc')}</p>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined spin={isPending} />}
            onClick={handleRefresh}
            loading={isPending}
          >
            {isPending ? t('common.loading') : t('product.refreshBtn')}
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
            {t('product.addBtn')}
          </Button>
        </Space>
      </div>

      <ErrorBoundary
        fallback={<ProductErrorFallback onRetry={handleRefresh} />}
        onReset={handleRefresh}
      >
        {/* Ant Design 封装的通用卡片网格骨架屏 */}
        <Suspense fallback={<ProductSkeleton />}>
          <ProductContent
            promise={productDataPromise}
            addedProducts={addedProducts}
          />
        </Suspense>
      </ErrorBoundary>

      {/* 新建商品弹窗 */}
      <ProductModal
        open={modalOpen}
        categories={DEFAULT_CATEGORIES}
        onCancel={() => setModalOpen(false)}
        onSuccess={handleAddProductSuccess}
      />
    </div>
  );
}
