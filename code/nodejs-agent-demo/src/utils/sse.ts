import { Response } from 'express';
import { SSEEventType, SSEPacket } from '../types/agent.js';

/**
 * 【SSE (Server-Sent Events) 工具类】
 * 封装底层的流式事件头与换行符协议规则
 */
export class SSESender {
  private res: Response;
  private isClosed = false;

  constructor(res: Response) {
    this.res = res;

    // 监听客户端连接断开（例如前端关闭了浏览器或调用了 abortController.abort()）
    this.res.on('close', () => {
      this.isClosed = true;
    });
  }

  /**
   * 初始化并发送 SSE 协议专属响应头
   */
  public initHeaders() {
    this.res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // 禁用 Nginx 等反向代理的缓冲区，实现即写即推
      'Access-Control-Allow-Origin': '*', // 支持跨域流式请求
    });
    // 立即冲刷响应头
    this.res.flushHeaders?.();
  }

  /**
   * 发送单条 SSE 规范消息
   * 标准规范格式：
   * event: <event_name>\n
   * data: <json_string>\n\n
   */
  public send(event: SSEEventType, data: SSEPacket['data']) {
    if (this.isClosed) return;

    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    this.res.write(payload);
  }

  /**
   * 发送思考推理碎片 (Thought)
   */
  public sendThought(thought: string) {
    this.send('thought', { content: thought });
  }

  /**
   * 发送工具调用开始事件
   */
  public sendToolStart(toolCallId: string, toolName: string, args: any) {
    this.send('tool_start', { toolCallId, toolName, args });
  }

  /**
   * 发送工具执行完毕结果
   */
  public sendToolEnd(toolCallId: string, toolName: string, result: any) {
    this.send('tool_end', { toolCallId, toolName, result });
  }

  /**
   * 发送单个流式 Token
   */
  public sendToken(token: string) {
    this.send('token', { content: token });
  }

  /**
   * 结束当前流并关闭连接
   */
  public complete(usage?: SSEPacket['data']['usage']) {
    if (this.isClosed) return;

    this.send('done', {
      finishReason: 'stop',
      usage: usage || { promptTokens: 30, completionTokens: 85, totalTokens: 115 },
    });
    this.res.end();
  }

  /**
   * 发生异常时向前端通知错误并挂断
   */
  public error(errorMessage: string) {
    if (this.isClosed) return;

    this.send('error', { error: errorMessage, finishReason: 'error' });
    this.res.end();
  }

  public get closed(): boolean {
    return this.isClosed;
  }
}
