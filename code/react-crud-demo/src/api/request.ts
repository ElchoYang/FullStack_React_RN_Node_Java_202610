import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { storage } from '../utils/storage';

// 创建全局统一 Axios 实例
const request = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：自动注入 Bearer Token
request.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：统一处理 401 鉴权失效与通用异常
request.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // 1. 清理本地过期凭证
      storage.clearAuth();
      // 2. 避免在登录页无限重定向
      if (!window.location.pathname.includes('/login')) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }

    const message = error.response?.data?.message || error.message || '网络请求发生错误';
    return Promise.reject(new Error(message));
  }
);

export default request;
