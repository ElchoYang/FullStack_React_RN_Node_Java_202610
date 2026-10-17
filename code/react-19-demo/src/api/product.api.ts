import { request } from './client';

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  rating: number;
}

export interface ProductSummary {
  totalSkus: number;
  totalInventoryValuation: number;
  lowStockAlerts: number;
  topSellingCategory: string;
}

export interface ProductModuleData {
  products: ProductItem[];
  summary: ProductSummary;
  categories: string[];
}

/**
 * 真实网络请求（由 Axios 发出，由 MSW Service Worker 拦截）
 */
export function fetchProductData(): Promise<ProductModuleData> {
  return request.get<ProductModuleData>('/products');
}

/**
 * 生产真实接口调用示例（基于 Axios）
 */
export const productApi = {
  getList: () => request.get<ProductModuleData>('/products'),
  create: (item: Partial<ProductItem>) => request.post<ProductItem>('/products', item),
  updateStock: (id: string, stock: number) =>
    request.patch<ProductItem>(`/products/${id}/stock`, { stock }),
};
