/**
 * 消息发送方角色
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * 后端工具执行状态
 */
export type ToolCallStatus = 'pending' | 'running' | 'success' | 'error';

/**
 * 单次工具调用记录
 */
export interface ToolCallItem {
  id: string;
  toolName: string;
  args: Record<string, any>;
  result?: any;
  status: ToolCallStatus;
  startTime: number;
  endTime?: number;
  duration?: number; // 毫秒
}

/**
 * 思考步骤记录 (Thought Chain-of-Thought)
 */
export interface ThoughtStep {
  id: string;
  content: string;
  timestamp: number;
}

/**
 * Token 使用统计
 */
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/**
 * 聊天会话消息体
 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  thoughts: ThoughtStep[];
  toolCalls: ToolCallItem[];
  timestamp: number;
  isStreaming?: boolean;
  error?: string;
  usage?: TokenUsage;
  finishReason?: 'stop' | 'tool_calls' | 'abort' | 'error';
}

/**
 * 后端 SSE 事件类型 (严格与 nodejs-agent-demo 对齐)
 */
export type SSEEventType =
  | 'thought'      // 思考流片段
  | 'tool_start'   // 工具调用开始
  | 'tool_end'     // 工具调用返回
  | 'token'        // 最终回答文本打字机流
  | 'done'         // 推流完成
  | 'error';       // 异常事件

/**
 * 后端 SSE 原始数据包 Payload
 */
export interface SSEPacketData {
  messageId?: string;
  content?: string;
  toolCallId?: string;
  toolName?: string;
  args?: any;
  result?: any;
  error?: string;
  finishReason?: 'stop' | 'tool_calls' | 'abort' | 'error';
  usage?: TokenUsage;
}

/**
 * 后端健康状态检查响应
 */
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  service: string;
  time: string;
  features?: string[];
}

/**
 * 智能体对话配置
 */
export interface AgentConfig {
  backendUrl: string; // 默认空字符串（走 Vite 代理 /api）或指定 http://localhost:3001
  autoScroll: boolean;
  showThoughtStream: boolean;
  showToolCalls: boolean;
}
