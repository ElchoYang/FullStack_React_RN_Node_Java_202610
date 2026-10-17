import type {
  Product,
  ProductFormData,
  ProductQueryParams,
} from '../types/product';
import request from './request';

const DEFAULT_FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    category: 'Reasoning',
    contextWindow: '200K',
    maxOutput: '64K',
    pricing: '$3.00 / $15.00',
    status: 'Active',
    likes: 3420,
    description: '业界首个混合思考大模型，可无缝切换极速标准模式与深度延伸思维模式，全平台代码评测登顶。',
    badge: 'Recommended',
    createdAt: '2026-02-24T00:00:00.000Z',
  },
  {
    id: 'prod-2',
    name: 'DeepSeek-R1',
    provider: 'DeepSeek',
    category: 'Reasoning',
    contextWindow: '128K',
    maxOutput: '32K',
    pricing: '$0.55 / $2.19',
    status: 'Active',
    likes: 4180,
    description: '基于强化学习 (RL) 原生涌现推理能力的开源先锋模型，数学、逻辑与复杂推理能力匹敌闭源顶尖模型。',
    badge: 'Top Open-Source',
    createdAt: '2026-01-20T00:00:00.000Z',
  },
  {
    id: 'prod-3',
    name: 'GPT-4.5 (Orion)',
    provider: 'OpenAI',
    category: 'General',
    contextWindow: '128K',
    maxOutput: '16K',
    pricing: '$75.00 / $150.00',
    status: 'Active',
    likes: 2690,
    description: '超大规模预训练基础模型，具备深厚的百科知识积累、精细的语调对齐与极高的通用常识理解力。',
    badge: 'Enterprise',
    createdAt: '2026-02-27T00:00:00.000Z',
  },
  {
    id: 'prod-4',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    category: 'Multimodal',
    contextWindow: '1M',
    maxOutput: '8K',
    pricing: '$0.10 / $0.40',
    status: 'Active',
    likes: 2150,
    description: '专为智能体时代打造的原生多模态模型，支持百万 Token 超大上下文吞吐，毫秒级流式低延迟响应。',
    badge: 'Ultra Fast',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'prod-5',
    name: 'Qwen 2.5 Coder 32B',
    provider: 'Alibaba',
    category: 'Code',
    contextWindow: '128K',
    maxOutput: '16K',
    pricing: '$0.20 / $0.60',
    status: 'Active',
    likes: 1940,
    description: '开源代码领域霸主模型，在多语言编程、仓库级代码修复、语法分析及复杂指令遵循上表现极其出色。',
    badge: 'Best for Devs',
    createdAt: '2025-12-10T00:00:00.000Z',
  },
  {
    id: 'prod-6',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    category: 'General',
    contextWindow: '128K',
    maxOutput: '8K',
    pricing: 'Open Weights',
    status: 'Active',
    likes: 2890,
    description: '开源社区旗舰大模型，性能匹敌前代 405B 模型，低成本单机推理部署性价比极高。',
    badge: 'Popular',
    createdAt: '2025-12-06T00:00:00.000Z',
  },
  {
    id: 'prod-7',
    name: 'DeepSeek-V3',
    provider: 'DeepSeek',
    category: 'General',
    contextWindow: '128K',
    maxOutput: '8K',
    pricing: '$0.14 / $0.28',
    status: 'Active',
    likes: 3610,
    description: '671B 参数的高效稀疏 MoE 架构通用模型，每 Token 激活 37B，以极致性价比提供强悍通用生成力。',
    badge: 'High Value',
    createdAt: '2025-12-26T00:00:00.000Z',
  },
  {
    id: 'prod-8',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    category: 'Code',
    contextWindow: '200K',
    maxOutput: '8K',
    pricing: '$0.80 / $4.00',
    status: 'Active',
    likes: 1820,
    description: '新一代轻量级高速模型，兼备卓越的推理速度与优异的代码能力，适合构建高频调用和交互型智能体。',
    badge: 'Speed & Code',
    createdAt: '2025-11-04T00:00:00.000Z',
  },
];

export const productService = {
  /**
   * 获取大模型产品列表（支持 404 容错兜底）
   */
  getProducts: async (params?: ProductQueryParams): Promise<Product[]> => {
    try {
      return await request.get('/products', { params });
    } catch (err: unknown) {
      console.warn(
        '[productService] Mock 服务 /products 返回异常（通常是 Mock 服务在追加数据前已启动，重启 npm run mock 即可读取真实 db.json）。当前启用预置大模型数据兜底展示。',
        err
      );
      return DEFAULT_FALLBACK_PRODUCTS;
    }
  },

  /**
   * 根据 ID 获取单个大模型信息
   */
  getProductById: (id: string): Promise<Product> => {
    return request.get(`/products/${id}`);
  },

  /**
   * 创建/发布新的大模型产品
   */
  createProduct: (data: ProductFormData): Promise<Product> => {
    return request.post('/products', {
      ...data,
      likes: 0,
      createdAt: new Date().toISOString(),
    });
  },

  /**
   * 变更点赞数 / 评分
   */
  likeProduct: (id: string, currentLikes: number): Promise<Product> => {
    return request.patch(`/products/${id}`, {
      likes: currentLikes + 1,
    });
  },

  /**
   * 删除大模型记录
   */
  deleteProduct: (id: string): Promise<void> => {
    return request.delete(`/products/${id}`);
  },
};

export default productService;
