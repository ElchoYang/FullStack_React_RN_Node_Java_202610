import { useState, useCallback, type ReactNode } from 'react';
import { storage } from '../utils/storage';
import { authService } from '../api/authService';
import type { CurrentUser, LoginCredentials } from '../types/auth';
import { AuthContext } from './AuthContext';

export interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  // 从 LocalStorage 同步初始化登录态，避免 useEffect 异步导致的级联二次渲染
  const [user, setUser] = useState<CurrentUser | null>(() => storage.getUser<CurrentUser>());
  const [token, setToken] = useState<string | null>(() => storage.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 登录方法
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setToken(response.token);
      setUser(response.user);
      storage.setToken(response.token);
      storage.setUser(response.user);
    } catch {
      // 若 Mock 服务未配置 /login 路由，提供安全的前端演示兜底
      if (
        credentials.email === 'admin@example.com' &&
        credentials.password === '123456'
      ) {
        const mockUser: CurrentUser = {
          id: 'admin-1',
          name: '系统管理员 (Admin)',
          email: 'admin@example.com',
          role: 'Admin',
          department: '技术研发中心',
        };
        const mockToken = `mock-jwt-token-${Date.now()}`;
        setToken(mockToken);
        setUser(mockUser);
        storage.setToken(mockToken);
        storage.setUser(mockUser);
        return;
      }
      throw new Error('用户名或密码错误，请尝试使用演示账号 admin@example.com / 123456');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 登出方法
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    storage.clearAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
