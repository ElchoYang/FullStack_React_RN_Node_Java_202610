export type ModelCategory = 'Reasoning' | 'General' | 'Code' | 'Multimodal';

export type ModelStatus = 'Active' | 'Beta' | 'Preview';

export interface Product {
  id: string;
  name: string;
  provider: string; // Anthropic, OpenAI, DeepSeek, Google, Alibaba, Meta 等
  category: ModelCategory;
  contextWindow: string; // 如 "200K", "128K", "1M"
  maxOutput: string; // 如 "64K", "16K"
  pricing: string; // 如 "$3.00 / $15.00"
  status: ModelStatus;
  likes: number; // 点赞数/热度值
  description: string;
  badge?: string; // 如 "Recommended", "Top Open-Source"
  createdAt: string;
}

export interface ProductQueryParams {
  q?: string;
  provider?: string;
  category?: string;
  _sort?: string;
  _order?: 'asc' | 'desc';
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'likes'>;
