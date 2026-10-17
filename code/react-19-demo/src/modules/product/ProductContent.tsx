import { use } from 'react';
import type { ProductItem, ProductModuleData } from '@/api/product.api';
import { ProductSummaryCards } from './components/ProductSummaryCards';
import { ProductGrid } from './components/ProductGrid';

interface ProductContentProps {
  promise: Promise<ProductModuleData>;
  addedProducts?: ProductItem[];
}

export function ProductContent({
  promise,
  addedProducts = [],
}: ProductContentProps) {
  // React 19 use(promise) 解包
  const data = use(promise);

  const currentProducts = [...addedProducts, ...data.products];

  return (
    <div className="space-y-6">
      <ProductSummaryCards summary={data.summary} />
      <ProductGrid products={currentProducts} categories={data.categories} />
    </div>
  );
}
