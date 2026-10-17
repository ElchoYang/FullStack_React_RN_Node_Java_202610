import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useI18nStore } from '@/store';

// 统一标准后端响应格式
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
  timestamp: number;
}

/**
 * 1. 创建全局 Axios 实例
 */
export const httpClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 2. 请求拦截器 (Request Interceptor)
 * - 动态注入 Zustand 中的多语言偏好 (Accept-Language)
 * - 动态注入 Token 鉴权凭据 (Authorization)
 */
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 Zustand 状态中心直接同步读取当前语言
    const { locale } = useI18nStore.getState();
    config.headers.set('Accept-Language', locale);

    // 示例：从本地或 store 获取 token
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 3. 响应拦截器 (Response Interceptor)
 * - 统一拦截 HTTP 异常状态码 (401, 403, 500)
 * - 直接返回解包后的 data，与 React 19 use(promise) 绝配
 */
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 若后端遵循 { code: 200, data: {...}, message: '' } 规范
    const res = response.data;

    if (res && typeof res === 'object' && 'code' in res) {
      if (res.code === 200 || res.code === 0) {
        return res.data;
      }
      // 业务错误直接抛出，触发 React 19 ErrorBoundary
      return Promise.reject(new Error(res.message || '业务逻辑异常'));
    }

    // 普通直接返回数据
    return res;
  },
  (error) => {
    let errorMsg = '网络通信异常，请稍后重试';

    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          errorMsg = '登录状态已失效，请重新登录 [401]';
          break;
        case 403:
          errorMsg = '当前账号无权访问此资源 [403 Forbidden]';
          break;
        case 404:
          errorMsg = '请求的接口资源不存在 [404 Not Found]';
          break;
        case 500:
        case 502:
        case 503:
          errorMsg = '后端服务处理失败，请联系运维团队 [50x]';
          break;
        default:
          errorMsg = error.response.data?.message || `网络异常 (${status})`;
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      errorMsg = '请求超时，后端响应过慢';
    } else if (error.message) {
      errorMsg = error.message;
    }

    // 抛出带有明确提示的 Error 对象，外层 React 19 ErrorBoundary 将完美捕获它并展示降级卡片
    return Promise.reject(new Error(errorMsg));
  }
);

/**
 * 4. 封装统一的 Promise 请求客户端
 * 返回的直接是解包后的数据 Promise<T>，供组件直接 use(promise)
 */
export const request = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return httpClient.get(url, config) as Promise<T>;
  },
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return httpClient.post(url, data, config) as Promise<T>;
  },
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return httpClient.put(url, data, config) as Promise<T>;
  },
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return httpClient.patch(url, data, config) as Promise<T>;
  },
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return httpClient.delete(url, config) as Promise<T>;
  },
};
