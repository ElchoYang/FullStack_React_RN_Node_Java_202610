import type { SSEEventType, SSEPacketData } from '../types/agent';

export interface SSECallbacks {
  onThought?: (content: string) => void;
  onToolStart?: (toolCallId: string, toolName: string, args: any) => void;
  onToolEnd?: (toolCallId: string, toolName: string, result: any) => void;
  onToken?: (token: string) => void;
  onDone?: (finishReason?: 'stop' | 'tool_calls' | 'abort' | 'error', usage?: SSEPacketData['usage']) => void;
  onError?: (error: string) => void;
}

/**
 * 【SSE 流式协议解析器】
 * 针对 POST 请求的 ReadableStream 进行健壮的切片与事件派发
 */
export async function parseSSEStream(
  responseStream: ReadableStream<Uint8Array>,
  callbacks: SSECallbacks,
  signal?: AbortSignal
): Promise<void> {
  const reader = responseStream.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  try {
    while (true) {
      if (signal?.aborted) {
        callbacks.onDone?.('abort');
        break;
      }

      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      // 将最新到达的二进制块解码并拼入缓冲区
      buffer += decoder.decode(value, { stream: true });

      // 按照标准规范的双换行符 (\n\n 或 \r\n\r\n) 拆解独立事件
      const normalized = buffer.replace(/\r\n/g, '\n');
      const eventChunks = normalized.split('\n\n');

      // 最后一个可能还不完整，保留在缓冲区等待下一次 read()
      buffer = eventChunks.pop() || '';

      for (const chunk of eventChunks) {
        if (!chunk.trim()) continue;

        let eventType: SSEEventType = 'token';
        let dataPayload: SSEPacketData = {};

        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            eventType = line.replace('event: ', '').trim() as SSEEventType;
          } else if (line.startsWith('data: ')) {
            const rawJson = line.replace('data: ', '').trim();
            if (rawJson) {
              try {
                dataPayload = JSON.parse(rawJson);
              } catch (e) {
                console.warn('[SSEParser] JSON parse error:', rawJson, e);
                dataPayload = { content: rawJson };
              }
            }
          }
        }

        // 依据事件类型进行精准派发
        switch (eventType) {
          case 'thought':
            if (dataPayload.content) {
              callbacks.onThought?.(dataPayload.content);
            }
            break;

          case 'tool_start':
            if (dataPayload.toolName) {
              callbacks.onToolStart?.(
                dataPayload.toolCallId || `tool_${Date.now()}`,
                dataPayload.toolName,
                dataPayload.args || {}
              );
            }
            break;

          case 'tool_end':
            callbacks.onToolEnd?.(
              dataPayload.toolCallId || '',
              dataPayload.toolName || '',
              dataPayload.result
            );
            break;

          case 'token':
            if (dataPayload.content) {
              callbacks.onToken?.(dataPayload.content);
            }
            break;

          case 'done':
            callbacks.onDone?.(dataPayload.finishReason, dataPayload.usage);
            break;

          case 'error':
            callbacks.onError?.(dataPayload.error || '后端 Agent 返回异常');
            break;

          default:
            // 兼容普通未分类 token
            if (dataPayload.content) {
              callbacks.onToken?.(dataPayload.content);
            }
            break;
        }
      }
    }
  } catch (err: any) {
    if (signal?.aborted || err.name === 'AbortError') {
      callbacks.onDone?.('abort');
      return;
    }
    console.error('[SSEParser] 流读取中断:', err);
    callbacks.onError?.(err.message || '网络连接中断');
  } finally {
    reader.releaseLock();
  }
}
