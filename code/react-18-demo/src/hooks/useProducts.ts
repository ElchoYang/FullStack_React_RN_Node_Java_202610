import { useState, useEffect, useCallback } from 'react';
import { productService } from '../api/productService';
import type { Product, ProductQueryParams } from '../types/product';

export function useProducts(initialParams?: ProductQueryParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 加载大模型产品列表
  const fetchProducts = useCallback(async (params?: ProductQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts(params || initialParams);
      setProducts(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取大模型产品列表失败';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  // 组件挂载与依赖变化时自然执行数据初始化
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProducts(initialParams);
        if (!ignore) {
          setProducts(data);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : '获取大模型产品列表失败';
          setError(message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      ignore = true;
    };
  }, [initialParams]);

  // 点赞操作
  const likeProduct = useCallback(async (id: string, currentLikes: number) => {
    try {
      await productService.likeProduct(id, currentLikes);
      // 同步更新本地状态
      setProducts((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, likes: item.likes + 1 } : item
        )
      );
    } catch (err: unknown) {
      console.error('点赞失败:', err);
    }
  }, []);

  return {
    products,
    setProducts,
    loading,
    error,
    refresh: fetchProducts,
    likeProduct,
  };
}

export default useProducts;
