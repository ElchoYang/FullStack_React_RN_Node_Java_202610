import apiClient from './client';
import { CreatePostPayload, Post } from './types';

/**
 * 【业务 API 服务层 (Service Layer)】
 * 核心设计思想：
 * 1. UI 页面只负责交互与渲染，禁止在页面组件中手写裸 fetch 或 axios 字符串 URL
 * 2. 所有的网络接口在此集中统一声明，配合 TypeScript 提供强类型约束与入参安全
 */
export const postApi = {
  /**
   * 【获取文章列表】
   * - apiClient.get<Post[]>: 传递泛型 <Post[]> 告知 Axios 返回数据的格式，使 response.data 具备完整的字段提示
   * - params 配置项: Axios 会自动将其序列化为 URL Query 参数（例如 /posts?_limit=10&_page=1）
   */
  async getPosts(limit = 10, page = 1): Promise<Post[]> {
    const response = await apiClient.get<Post[]>('/posts', {
      params: {
        _limit: limit,
        _page: page,
      },
    });
    return response.data;
  },

  /**
   * 【根据 ID 获取单篇文章详情】
   * - RESTful 风格路径参数拼接
   */
  async getPostById(id: number): Promise<Post> {
    const response = await apiClient.get<Post>(`/posts/${id}`);
    return response.data;
  },

  /**
   * 【创建新文章】
   * - HTTP POST 请求：将 payload 作为 JSON 请求体 (Body) 传输
   */
  async createPost(payload: CreatePostPayload): Promise<Post> {
    const response = await apiClient.post<Post>('/posts', payload);
    return response.data;
  },

  /**
   * 【删除文章】
   * - HTTP DELETE 请求
   */
  async deletePost(id: number): Promise<void> {
    await apiClient.delete(`/posts/${id}`);
  },
};
