import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';

/**
 * 【生产级 Axios 单例封装】
 * 核心设计思想：
 * 1. 使用 axios.create 创建独立实例，避免污染全局 axios 默认配置
 * 2. 统一管理 BaseURL、网络超时时间 (timeout) 和默认 Headers
 * 3. 集中使用请求拦截器 (request interceptor) 和响应拦截器 (response interceptor)
 */
const apiClient: AxiosInstance = axios.create({
  // 后端 REST API 统一基地址（请求时只需写相对路径如 '/posts'）
  baseURL: 'https://jsonplaceholder.typicode.com',
  // 超时阈值：10 秒后未响应自动中断请求并触发 timeout 错误
  timeout: 10000,
  // 默认请求头规范
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * 【请求拦截器 (Request Interceptor)】
 * 在每一个 HTTP 请求真正发送到网络之前执行
 * 典型应用场景：
 * - 动态注入 JWT Token（如 Authorization: Bearer xxx）
 * - 打印请求调试日志（只在开发模式下输出）
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 真实业务中通常从本地安全存储读取 token：
    // const token = await SecureStore.getItemAsync('user_token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    // 【__DEV__ 是 React Native 内置全局变量】为 true 表示当前处于开发模式，生产打包后自动为 false
    if (__DEV__) {
      console.log(`[API Request] [${config.method?.toUpperCase()}] ${config.url}`);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]:', error);
    return Promise.reject(error);
  }
);

/**
 * 【响应拦截器 (Response Interceptor)】
 * 在客户端接收到服务器响应、进入具体业务页面代码之前执行
 * 典型应用场景：
 * - 统一过滤 HTTP 状态码并转义为用户看得懂的中文提示
 * - 捕获 401 并触发全局登出或跳转登录页
 * - 处理网络超时 (ECONNABORTED) 和完全断网错误
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (__DEV__) {
      console.log(`[API Response] Status: ${response.status} from ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    let errorMessage = '网络请求发生未知错误';

    if (error.response) {
      // 场景 1：服务器响应了，但 HTTP 状态码不在 2xx 范围内
      const status = error.response.status;
      switch (status) {
        case 400:
          errorMessage = '请求参数有误 (400)';
          break;
        case 401:
          errorMessage = '登录已过期，请重新登录 (401)';
          break;
        case 403:
          errorMessage = '权限不足，拒绝访问 (403)';
          break;
        case 404:
          errorMessage = '请求的资源未找到 (404)';
          break;
        case 500:
          errorMessage = '服务器内部错误 (500)';
          break;
        default:
          errorMessage = `服务器异常 (${status})`;
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      // 场景 2：请求超过了前面设置的 10000ms 超时限制
      errorMessage = '网络请求超时，请检查网络后重试';
    } else if (error.request) {
      // 场景 3：请求已发送，但未收到任何响应（如手机处于飞行模式、断网或服务端宕机）
      errorMessage = '无法连接到服务器，请检查设备网络';
    }

    console.error(`[API Error]: ${errorMessage}`, error.message);
    // 将友好的错误消息通过 Error 对象向下传递给页面 try...catch 捕获
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
