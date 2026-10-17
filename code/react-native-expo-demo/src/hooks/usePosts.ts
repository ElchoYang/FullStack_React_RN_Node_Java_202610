import { useState, useEffect, useCallback } from 'react';
import { postApi } from '../api/postApi';
import { Post } from '../api/types';

/**
 * 【函数式自定义 Hook: usePosts】
 * 核心思想（函数式与关注点分离）：
 * 1. UI 组件只负责渲染画面和触发交互，不直接耦合底层异步请求与状态变更细节
 * 2. 将数据获取、刷新、删除等有状态逻辑封装为可复用的纯函数式 Hook
 */
export const usePosts = (limit = 15) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 函数式获取数据
   */
  const loadPosts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await postApi.getPosts(limit);
      setPosts(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '获取数据失败';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [limit]);

  // 组件挂载时自动触发一次数据加载
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // 供外部调用的下拉刷新函数
  const refresh = useCallback(() => {
    return loadPosts(true);
  }, [loadPosts]);

  /**
   * 函数式不可变删除：使用纯函数 filter 替换数组，产生全新引用
   */
  const removePost = useCallback(async (id: number): Promise<boolean> => {
    try {
      await postApi.deletePost(id);
      // 函数式状态更新：依据前一个状态纯函数派生新状态
      setPosts((prevPosts) => prevPosts.filter((item) => item.id !== id));
      return true;
    } catch {
      return false;
    }
  }, []);

  // 返回不可变状态与操作函数的闭包对象
  return {
    posts,
    loading,
    refreshing,
    error,
    refresh,
    reload: loadPosts,
    removePost,
  };
};
