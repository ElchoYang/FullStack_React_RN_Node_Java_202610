/**
 * Agent 角色类型
 */
export type MessageRole = 'user' | 'assistant' | 'system' | 'tool' | 'thought';

/**
 * 历史消息结构
 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  name?: string; // 如果是 tool 角色，记录工具名称
  toolCalls?: ToolCall[];
  timestamp: number;
}

/**
 * 工具调用定义
 */
export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
}

/**
 * 工具定义规范
 */
export interface AgentTool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required: string[];
  };
  execute: (args: any) => Promise<any> | any;
}

/**
 * SSE 流式事件类型
 */
export type SSEEventType =
  | 'thought'      // Agent 思考中 (CoT 推理过程)
  | 'tool_start'   // 开始调用外部工具
  | 'tool_end'     // 外部工具执行完毕返回结果
  | 'token'        // 最终回答文本流式 Token
  | 'done'         // 全部流式传输完成
  | 'error';       // 异常错误

/**
 * SSE 数据包体规范
 */
export interface SSEPacket {
  event: SSEEventType;
  data: {
    messageId?: string;
    content?: string;
    toolCallId?: string;
    toolName?: string;
    args?: any;
    result?: any;
    error?: string;
    finishReason?: 'stop' | 'tool_calls' | 'abort' | 'error';
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  };
}
