import type { HealthCheckResponse } from '../types/agent';
import { parseSSEStream } from './sseParser';
import type { SSECallbacks } from './sseParser';

export class AgentApiService {
  /**
   * 获取解析后的基地址，兼容相对路径 /api (走 Vite 代理) 与完整绝对路径
   */
  public static resolveUrl(endpoint: string, customBaseUrl?: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    if (!customBaseUrl || customBaseUrl.trim() === '') {
      return `/api${cleanEndpoint}`;
    }
    const base = customBaseUrl.replace(/\/+$/, '');
    // 如果 base 已经包含 /api，则不再重复拼接
    if (base.endsWith('/api')) {
      return `${base}${cleanEndpoint}`;
    }
    return `${base}/api${cleanEndpoint}`;
  }

  /**
   * 后端健康检查
   */
  public static async checkHealth(customBaseUrl?: string): Promise<HealthCheckResponse> {
    const url = this.resolveUrl('/health', customBaseUrl);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`服务返回非 200 状态: ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        throw new Error('健康检查请求超时 (4s)');
      }
      throw new Error(err.message || '无法连接到后端服务');
    }
  }

  /**
   * 发起流式 Agent 对话请求并消费 SSE 流
   */
  public static async streamChat(
    prompt: string,
    callbacks: SSECallbacks,
    options?: {
      customBaseUrl?: string;
      signal?: AbortSignal;
    }
  ): Promise<void> {
    const url = this.resolveUrl('/agent/chat/stream', options?.customBaseUrl);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({ prompt }),
      signal: options?.signal,
    });

    if (!response.ok) {
      let errorMsg = `HTTP 错误 ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson.error) {
          errorMsg = errorJson.error;
        }
      } catch {
        // ignore
      }
      callbacks.onError?.(errorMsg);
      return;
    }

    if (!response.body) {
      callbacks.onError?.('服务器响应未包含数据流体 (ReadableStream)');
      return;
    }

    // 交给 SSE 流解析器处理
    await parseSSEStream(response.body, callbacks, options?.signal);
  }
}
