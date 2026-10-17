// 通用分页响应包装类型
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// 统一 API 错误格式
export interface ApiError {
  message: string;
  code?: string | number;
  details?: Record<string, string>;
}
