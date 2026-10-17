# React Week 2：React 进阶与生产级 Web 应用实战指南

本指南根据 **[CPA_FSD_Reskill_5_Week_Learning_Plan.xlsx](CPA_FSD_Reskill_5_Week_Learning_Plan.xlsx)** 第 2 周规划制定。

Week 2 的核心方向为 **React 进阶 (React Advanced)**，重点从基础语法过渡到**生产级架构设计、全局状态、JWT 鉴权体系、受保护路由、错误边界与企业级 UI 模式**，最终交付一个**具备完整登录鉴权与受保护业务模块的生产级 Web 应用**。

---

## 目录
1. [Week 2 学习目标与交付物概览](#1-week-2-学习目标与交付物概览)
2. [Week 2 任务清单与工时拆解](#2-week-2-任务清单与工时拆解)
3. [生产级进阶技术栈选型](#3-生产级进阶技术栈选型)
4. [项目进阶架构与完整目录结构](#4-项目进阶架构与完整目录结构)
5. [核心知识点与生产级代码骨架](#5-核心知识点与生产级代码骨架)
   - 5.1 [JWT Token 管理与 Axios 拦截器升级](#51-jwt-token-管理与-axios-拦截器升级)
   - 5.2 [全局鉴权 Context (`AuthContext` 与 `useAuth`)](#52-全局鉴权-context-authcontext-与-useauth)
   - 5.3 [路由守卫与受保护路由 (`ProtectedRoute`)](#53-路由守卫与受保护路由-protectedroute)
   - 5.4 [全局错误边界组件 (`ErrorBoundary`)](#54-全局错误边界组件-errorboundary)
   - 5.5 [通用异步状态管理 Hook (`useAsync`)](#55-通用异步状态管理-hook-useasync)
   - 5.6 [登录页实现与表单校验 (`LoginPage`)](#56-登录页实现与表单校验-loginpage)
   - 5.7 [进阶路由表设计（公开路由与受保护路由分离）](#57-进阶路由表设计公开路由与受保护路由分离)
6. [运行与验证流程（含 Mock 鉴权）](#6-运行与验证流程含-mock-鉴权)
7. [Week 2 能力达标自测清单 (Checklist)](#7-week-2-能力达标自测清单-checklist)

---

## 1. Week 2 学习目标与交付物概览

- **学习主题**：React Advanced（React 进阶架构与工程化）
- **预估总工时**：**35 小时**
- **核心交付物**：**生产级 React Web 应用 (Complete React Web App)**
  - 具备真实的 **登录 / 登出** 认证全流程；
  - 本地 Token 持久化存储与 Axios 自动挂载 `Authorization: Bearer <token>`；
  - 401 鉴权失效自动拦截、清理状态并重定向回登录页；
  - **路由守卫 (Protected Routes)**：未登录用户拦截访问后台受保护页面，登录后自动重定向回原访问目标；
  - **React Context 全局状态管理**：用户上下文 (AuthContext) 跨组件状态共享；
  - **优雅的健壮性设计**：React 错误边界 (Error Boundary)、全局加载态 (Loading)、空状态 (Empty) 与全局错误提示 (Notification/Toast)；
  - **自定义 Hook (Custom Hooks)**：高内聚封装鉴权、异步请求与业务数据。

---

## 2. Week 2 任务清单与工时拆解

根据计划表任务拆解如下（共 10 项核心任务，35 小时）：

| 序号 | 任务名称 (Task) | 优先级 | 预估工时 | 里程碑交付成果 (Deliverable) |
| :---: | :--- | :---: | :---: | :--- |
| **1** | **组件设计与工程结构** (Component design & structure) | High | 3h | 组织符合生产规范的模块化前端架构（分层隔离、清晰边界） |
| **2** | **自定义 Hooks** (Custom Hooks) | High | 3h | 抽取可复用的状态逻辑（如 `useAuth`, `useAsync`, `useLocalStorage`） |
| **3** | **Context API 状态共享** (Context API) | Medium | 2h | 掌握 `createContext`、`useContext` 与 Context Provider 设计 |
| **4** | **状态管理概念对比** (State management concepts) | Medium | 3h | 理解局部状态 (Local State) 与全局状态 (Global State) 适用边界 |
| **5** | **异步数据与加载态体验** (Async data & states) | High | 3h | 优雅处理 Loading 加载骨架屏、Empty 缺省与 Error 异常反馈 |
| **6** | **前端错误处理体系** (Error handling) | High | 2h | 实现 React 错误边界 (ErrorBoundary) 与 API 统一异常兜底 |
| **7** | **身份认证与鉴权流程** (Authentication flow) | High | 4h | 掌握 Login/Logout、JWT Token 本地持久化与 Header 自动携带 |
| **8** | **受保护路由与权限控制** (Protected routes) | High | 2h | 实现基于 React Router 的路由守卫拦截与登录后回跳 |
| **9** | **可复用 UI 模式** (Reusable UI patterns) | Medium | 3h | 封装标准表格、表单弹窗、全局通知 (Toast/Message) 等交互模式 |
| **10** | **综合交付：生产级 React Web 应用** | High | 8h | 整合上述全部进阶能力，交付端到端生产级标准 Web 应用程序 |

---

## 3. 生产级进阶技术栈选型

| 分类 | 选用技术 | 说明与用途 |
| :--- | :--- | :--- |
| **前端框架** | React 19 / 18 + TypeScript | 强类型、最新 Hooks API |
| **路由与守卫** | React Router v7 / v6 | 客户端 SPA 路由分发、路由拦截守卫、重定向 |
| **状态管理** | React Context API + Custom Hooks | 零额外重型依赖，轻量高效管理用户登录与全局配置 |
| **网络请求** | Axios | 双向拦截器、401 自动跳转、Token 自动附加 |
| **UI 方案** | Ant Design (antd 5.x) 或 Tailwind CSS + Lucide | 提供企业级 Form、Table、Modal、Message、Result 等组件 |
| **持久化存储** | LocalStorage / SessionStorage | Token 与用户基本信息缓存 |
| **Mock 服务** | JSON Server (带 Auth 规则) | 模拟用户登录、Token 颁发与 REST 接口 |

---

## 4. 项目进阶架构与完整目录结构

相比 Week 1，Week 2 增加了 **鉴权层 (`contexts/`)**、**守卫与安全边界 (`components/guard/`, `components/boundary/`)**、**认证页面 (`pages/auth/`)** 与 **全局工具库**：

```text
react-advanced-app/
├── mock/
│   ├── db.json                      # Mock 业务数据源（用户、角色等）
│   └── server.cjs                   # 自定义 JSON Server 脚本（模拟 /login 登录接口）
├── src/
│   ├── api/                         # 【数据服务层】
│   │   ├── request.ts               # Axios 实例：注入 Token 拦截器与 401 错误统一处理
│   │   ├── authService.ts           # 认证接口（login, logout, getCurrentUser）
│   │   └── userService.ts           # 业务 CRUD 接口
│   ├── components/                  # 【UI 与结构组件】
│   │   ├── boundary/                # 异常安全边界
│   │   │   └── ErrorBoundary.tsx    # 全局错误捕获边界（防止页面崩溃白屏）
│   │   ├── common/                  # 通用原子组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingSpinner.tsx   # 全局加载指示器
│   │   │   └── Modal.tsx
│   │   ├── guard/                   # 权限安全守卫
│   │   │   └── ProtectedRoute.tsx   # 路由守卫（未登录自动拦截并记录回跳地址）
│   │   ├── layout/                  # 主题布局
│   │   │   ├── Header.tsx           # 顶部栏（展示当前用户信息、登出按钮）
│   │   │   ├── Sidebar.tsx          # 侧边导航栏
│   │   │   └── MainLayout.tsx       # 整体后台框架
│   │   └── user/                    # 业务组件（Table, Search, Form）
│   ├── contexts/                    # 【全局状态上下文】
│   │   └── AuthContext.tsx          # 用户鉴权 Context（user, token, login, logout, isLoading）
│   ├── hooks/                       # 【自定义 Hooks 业务复用】
│   │   ├── useAuth.ts               # 便捷消费 AuthContext 的 Hook
│   │   ├── useAsync.ts              # 通用异步状态机（loading, data, error, execute）
│   │   ├── useDebounce.ts           # 输入防抖
│   │   └── useUsers.ts              # 用户模块业务 Hook
│   ├── pages/                       # 【页面视图】
│   │   ├── auth/                    # 认证相关页面
│   │   │   └── LoginPage.tsx        # 登录页面（账号密码输入、表单校验、登录提交）
│   │   ├── dashboard/               # 控制台仪表盘
│   │   │   └── DashboardPage.tsx    # 欢迎概览页
│   │   ├── user/                    # 业务管理页面
│   │   │   ├── UserListPage.tsx     # 用户列表
│   │   │   ├── UserDetailPage.tsx   # 用户详情
│   │   │   └── UserFormPage.tsx     # 用户编辑/新建
│   │   └── error/                   # 缺省状态页
│   │       ├── ForbiddenPage.tsx    # 403 无权限页面
│   │       └── NotFoundPage.tsx     # 404 未找到页面
│   ├── router/                      # 【路由定义】
│   │   └── index.tsx                # 声明式路由表（区分公开路由 Public 与私有路由 Protected）
│   ├── types/                       # 【TypeScript 类型声明】
│   │   ├── auth.ts                  # 登录请求参数、Token、当前用户类型
│   │   ├── user.ts                  # 用户业务实体类型
│   │   └── api.ts                   # 接口通用格式
│   ├── utils/                       # 【工具库】
│   │   ├── storage.ts               # LocalStorage 安全读写与 Token 缓存
│   │   ├── format.ts                # 日期与格式转换
│   │   └── validate.ts              # 表单校验正则
│   ├── App.tsx                      # 根组件（注入 AuthProvider 与 RouterProvider）
│   ├── index.css                    # 全局样式
│   └── main.tsx                     # 挂载入口
├── package.json
└── vite.config.ts
```

---

## 5. 核心知识点与生产级代码骨架

### 5.1 JWT Token 管理与 Axios 拦截器升级

在生产项目中，用户的 Token 必须统一由存储工具管理，并在每个 API 请求中自动挂载 `Authorization: Bearer <token>`；当后端返回 `401 Unauthorized` 时，必须立即清理本地失效凭证并触发登出逻辑。

#### 1. 本地存储工具 (`src/utils/storage.ts`)
```typescript
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const storage = {
  // Token 存取
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  // 用户信息存取
  getUser: <T>(): T | null => {
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser: <T>(user: T): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  removeUser: () => localStorage.removeItem(USER_KEY),

  // 清空全部认证信息
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
```

#### 2. Axios 请求与 401 拦截器 (`src/api/request.ts`)
```typescript
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { storage } from '../utils/storage';

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

// 响应拦截器：统一处理 401 鉴权失效
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
```

---

### 5.2 全局鉴权 Context (`AuthContext` 与 `useAuth`)

使用 React Context 保持登录状态在整个应用组件树中同步。

#### 1. 认证上下文 (`src/contexts/AuthContext.tsx`)
```tsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { authService } from '../api/authService';
import type { CurrentUser, LoginCredentials } from '../types/auth';

export interface AuthContextType {
  user: CurrentUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 应用初始化时从 LocalStorage 恢复登录态
  useEffect(() => {
    const savedToken = storage.getToken();
    const savedUser = storage.getUser<CurrentUser>();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  // 登录方法
  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    // 更新 Context 状态
    setToken(response.token);
    setUser(response.user);
    // 持久化到存储
    storage.setToken(response.token);
    storage.setUser(response.user);
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
};
```

#### 2. 自定义消费 Hook (`src/hooks/useAuth.ts`)
```typescript
import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必须在 <AuthProvider> 内部使用！');
  }
  return context;
}
```

---

### 5.3 路由守卫与受保护路由 (`ProtectedRoute`)

拦截未登录用户的非法访问，并记住用户试图访问的页面 URL，以便登录后无缝跳转回原页面。

```tsx
// src/components/guard/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[]; // 可选：支持基于角色的权限判断 (RBAC)
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // 初始化鉴权状态读取中，展示骨架屏或 Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  // 1. 未登录：重定向到登录页，并通过 state 记录当前试图访问的路径
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. 权限不足：已登录但角色不符
  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  // 3. 鉴权通过：正常放行渲染子组件
  return <>{children}</>;
};
```

---

### 5.4 全局错误边界组件 (`ErrorBoundary`)

利用 React 错误边界捕获渲染树中出现的任何未捕获 JavaScript 错误，防止整个应用崩溃白屏。

```tsx
// src/components/boundary/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary 捕获到全局渲染异常:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.fallback) return this.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-gray-200 shadow-lg text-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">应用遇到了问题</h2>
            <p className="text-sm text-gray-600 mb-4">
              {this.state.error?.message || '组件渲染过程中发生了意外错误。'}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>重新加载页面</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

### 5.5 通用异步状态管理 Hook (`useAsync`)

将所有请求中的 `loading`、`data`、`error` 与异常捕获标准化为一个 Hook：

```typescript
// src/hooks/useAsync.ts
import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (promise: Promise<T>): Promise<T | null> => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await promise;
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err: any) {
      const errorMsg = err.message || '请求失败';
      setState({ data: null, loading: false, error: errorMsg });
      return null;
    }
  }, []);

  return { ...state, execute };
}
```

---

### 5.6 登录页实现与表单校验 (`LoginPage`)

```tsx
// src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取登录前用户原本试图访问的目标路径
  const from = (location.state as any)?.from?.pathname || '/users';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('请输入邮箱与登录密码');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login({ email, password });
      // 登录成功重定向回原访问页面
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || '登录失败，请检查账号密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-md font-bold text-xl">
            R
          </div>
          <h2 className="text-2xl font-bold text-gray-900">系统管理后台登录</h2>
          <p className="text-sm text-gray-500 mt-1">Week 2 生产级 React 鉴权演示</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱账号</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">登录密码</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 transition"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>立即登录</span>
              </>
            )}
          </button>
        </form>

        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 text-center">
          演示账号: <span className="font-semibold text-gray-700">admin@example.com</span> / 密码: <span className="font-semibold text-gray-700">123456</span>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
```

---

### 5.7 进阶路由表设计（公开路由与受保护路由分离）

```tsx
// src/router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/guard/ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { UserListPage } from '../pages/user/UserListPage';
import { UserDetailPage } from '../pages/user/UserDetailPage';
import { UserFormPage } from '../pages/user/UserFormPage';
import { NotFoundPage } from '../pages/error/NotFoundPage';

export const router = createBrowserRouter([
  // 1. 公开路由 (无需登录)
  {
    path: '/login',
    element: <LoginPage />,
  },

  // 2. 受保护的后台业务路由 (必须登录，由 ProtectedRoute 拦截)
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/users" replace />,
      },
      {
        path: 'users',
        element: <UserListPage />,
      },
      {
        path: 'users/new',
        element: <UserFormPage />,
      },
      {
        path: 'users/:id',
        element: <UserDetailPage />,
      },
      {
        path: 'users/:id/edit',
        element: <UserFormPage />,
      },
    ],
  },

  // 3. 404 兜底路由
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
```

---

## 6. 运行与验证流程（含 Mock 鉴权）

在 `mock/` 中可配合自定义简单的 Node 登录脚本或直接由 JSON Server 支撑：

```bash
# 启动 Mock 服务与 Vite 开发服务器
npm run start
```

**核心验证步骤：**
1. **未登录拦截测试**：清空 LocalStorage，在浏览器直接输入 `http://localhost:5173/users`，确认被拦截并自动重定向至 `http://localhost:5173/login`。
2. **登录回跳测试**：在登录页输入凭据登录，登录成功后自动回跳到 `/users`。
3. **Token 自动携带测试**：打开浏览器 Network 选项卡，查看向 `http://localhost:4000/users` 发起的请求，Header 中包含 `Authorization: Bearer ...`。
4. **登出测试**：点击右上角「退出登录」，清除 Token 并重定向回 `/login`。
5. **401 模拟测试**：手动篡改 LocalStorage 中的 Token，刷新列表，确认 Axios 响应拦截器触发并自动清除凭证回跳登录页。

---

## 7. Week 2 能力达标自测清单 (Checklist)

完成本周学习与实战后，请逐项核对是否掌握以下关键能力：

- [ ] **生产级工程分层**：能够清晰划分 `api/`、`contexts/`、`hooks/`、`components/guard/` 与 `pages/` 的职责边界。
- [ ] **Context 全局状态**：熟练运用 `createContext` + `useContext` 实现跨组件状态共享（如用户身份、主题模式）。
- [ ] **自定义 Hook 抽象**：能独立封装包含完整 `loading`、`error` 与业务动作的高阶 Hook。
- [ ] **端到端鉴权闭环**：理解并实现 JWT 存储、Axios Request 拦截器注入 Token、Response 拦截器处理 401。
- [ ] **路由守卫 (Protected Routes)**：掌握 `Navigate`、`useLocation` 实现未登录拦截与 `state.from` 登录原路回跳。
- [ ] **异常与健壮性**：掌握 React 类组件 `componentDidCatch` 实现 `ErrorBoundary` 防白屏机制。
- [ ] **企业级 UI 模式**：能熟练运用弹窗二次确认、全局消息提示、加载中骨架屏与空状态组件。
