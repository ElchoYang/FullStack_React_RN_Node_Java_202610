import { useAppConfigStore } from '@/store';
export { httpClient, request, type ApiResponse } from './axiosInstance';

/**
 * 模拟网络请求延迟与可能抛出的异常
 * 通过 Zustand 的 useAppConfigStore.getState() 直接在 React 外部异步函数中读取全局状态
 */
export async function mockFetch<T>(dataFactory: () => T, customDelay?: number): Promise<T> {
  const { networkDelay, simulateError } = useAppConfigStore.getState();
  const delay = customDelay ?? networkDelay;

  await new Promise((resolve) => setTimeout(resolve, delay));

  if (simulateError) {
    throw new Error('【Axios 模拟错误】接口响应 500 异常或网络中断');
  }

  return dataFactory();
}
