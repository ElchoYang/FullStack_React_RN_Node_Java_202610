import { useState, useRef, useCallback, useEffect } from 'react';
import { AgentApiService } from '../services/agentApi';
import type { ChatMessage, AgentConfig, ToolCallItem, ThoughtStep } from '../types/agent';

const LOCAL_STORAGE_KEY = 'REACT_AGENT_CHAT_MESSAGES_V1';
const CONFIG_STORAGE_KEY = 'REACT_AGENT_CONFIG_V1';

const DEFAULT_CONFIG: AgentConfig = {
  backendUrl: '', // 默认空，自动走 Vite 代理 /api
  autoScroll: true,
  showThoughtStream: true,
  showToolCalls: true,
};

export function useAgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [config, setConfig] = useState<AgentConfig>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 持久化存储
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('保存历史消息到 localStorage 失败:', e);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('保存配置到 localStorage 失败:', e);
    }
  }, [config]);

  const updateConfig = useCallback((newConfig: Partial<AgentConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  /**
   * 中止当前正在流式响应的生成
   */
  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.role === 'assistant' && last.isStreaming) {
        return [
          ...prev.slice(0, -1),
          {
            ...last,
            isStreaming: false,
            finishReason: 'abort',
          },
        ];
      }
      return prev;
    });
  }, []);

  /**
   * 发送新提问并建立 SSE 连接
   */
  const sendMessage = useCallback(
    async (promptText: string) => {
      const trimmed = promptText.trim();
      if (!trimmed || isStreaming) return;

      // 如果有之前的未完成流，先中断
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const userMsgId = `user_${Date.now()}`;
      const assistantMsgId = `assistant_${Date.now()}`;

      const userMessage: ChatMessage = {
        id: userMsgId,
        role: 'user',
        content: trimmed,
        thoughts: [],
        toolCalls: [],
        timestamp: Date.now(),
      };

      const assistantMessage: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        thoughts: [],
        toolCalls: [],
        timestamp: Date.now(),
        isStreaming: true,
      };

      // 更新消息列表
      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsStreaming(true);

      try {
        await AgentApiService.streamChat(
          trimmed,
          {
            onThought: (thoughtContent: string) => {
              setMessages((prev) => {
                const list = [...prev];
                const last = list[list.length - 1];
                if (last && last.id === assistantMsgId) {
                  const newStep: ThoughtStep = {
                    id: `thought_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                    content: thoughtContent,
                    timestamp: Date.now(),
                  };
                  list[list.length - 1] = {
                    ...last,
                    thoughts: [...last.thoughts, newStep],
                  };
                }
                return list;
              });
            },

            onToolStart: (toolCallId: string, toolName: string, args: any) => {
              setMessages((prev) => {
                const list = [...prev];
                const last = list[list.length - 1];
                if (last && last.id === assistantMsgId) {
                  const newToolItem: ToolCallItem = {
                    id: toolCallId,
                    toolName,
                    args,
                    status: 'running',
                    startTime: Date.now(),
                  };
                  list[list.length - 1] = {
                    ...last,
                    toolCalls: [...last.toolCalls, newToolItem],
                  };
                }
                return list;
              });
            },

            onToolEnd: (toolCallId: string, toolName: string, result: any) => {
              setMessages((prev) => {
                const list = [...prev];
                const last = list[list.length - 1];
                if (last && last.id === assistantMsgId) {
                  const updatedToolCalls = last.toolCalls.map((item) => {
                    if (item.id === toolCallId || (!item.result && item.toolName === toolName)) {
                      const endTime = Date.now();
                      return {
                        ...item,
                        result,
                        status: 'success' as const,
                        endTime,
                        duration: endTime - item.startTime,
                      };
                    }
                    return item;
                  });
                  list[list.length - 1] = {
                    ...last,
                    toolCalls: updatedToolCalls,
                  };
                }
                return list;
              });
            },

            onToken: (token: string) => {
              setMessages((prev) => {
                const list = [...prev];
                const last = list[list.length - 1];
                if (last && last.id === assistantMsgId) {
                  list[list.length - 1] = {
                    ...last,
                    content: last.content + token,
                  };
                }
                return list;
              });
            },

            onDone: (finishReason = 'stop', usage) => {
              setIsStreaming(false);
              abortControllerRef.current = null;
              setMessages((prev) => {
                const list = [...prev];
                const last = list[list.length - 1];
                if (last && last.id === assistantMsgId) {
                  list[list.length - 1] = {
                    ...last,
                    isStreaming: false,
                    finishReason,
                    usage,
                  };
                }
                return list;
              });
            },

            onError: (errMsg: string) => {
              setIsStreaming(false);
              abortControllerRef.current = null;
              setMessages((prev) => {
                const list = [...prev];
                const last = list[list.length - 1];
                if (last && last.id === assistantMsgId) {
                  list[list.length - 1] = {
                    ...last,
                    isStreaming: false,
                    error: errMsg,
                    finishReason: 'error',
                  };
                }
                return list;
              });
            },
          },
          {
            customBaseUrl: config.backendUrl,
            signal: controller.signal,
          }
        );
      } catch (err: any) {
        if (controller.signal.aborted) return;
        setIsStreaming(false);
        abortControllerRef.current = null;
        setMessages((prev) => {
          const list = [...prev];
          const last = list[list.length - 1];
          if (last && last.id === assistantMsgId) {
            list[list.length - 1] = {
              ...last,
              isStreaming: false,
              error: err.message || '网络连接异常，未能完成 Agent 推流',
              finishReason: 'error',
            };
          }
          return list;
        });
      }
    },
    [isStreaming, config.backendUrl]
  );

  /**
   * 清空会话历史
   */
  const clearMessages = useCallback(() => {
    if (isStreaming) {
      stopStream();
    }
    setMessages([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, [isStreaming, stopStream]);

  return {
    messages,
    isStreaming,
    config,
    updateConfig,
    sendMessage,
    stopStream,
    clearMessages,
  };
}
