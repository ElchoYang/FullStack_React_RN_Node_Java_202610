import request from './request';
import type { LoginCredentials, AuthResponse, CurrentUser } from '../types/auth';

export const authService = {
  /**
   * 用户登录
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return request.post('/login', credentials);
  },

  /**
   * 获取当前登录用户信息
   */
  getCurrentUser: async (): Promise<CurrentUser> => {
    return request.get('/me');
  },

  /**
   * 用户登出
   */
  logout: async (): Promise<void> => {
    return request.post('/logout');
  },
};

export default authService;
