import { Request, Response } from 'express';
import { SSESender } from '../utils/sse.js';
import { AgentExecutor } from '../agent/executor.js';

export const agentController = {
  /**
   * 【核心接口】处理 Agent 流式聊天
   * POST /api/agent/chat/stream
   * Body: { prompt: string }
   */
  async streamChat(req: Request, res: Response) {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: '请求参数缺少必须的 prompt 字符串' });
      return;
    }

    console.log(`[Agent Controller] 收到新提问: "${prompt}"`);

    // 初始化 SSE 发送器
    const sseSender = new SSESender(res);
    sseSender.initHeaders();

    // 运行 Agent
    await AgentExecutor.run({
      prompt: prompt.trim(),
      sender: sseSender,
    });
  },

  /**
   * 健康检查接口
   * GET /api/health
   */
  async healthCheck(_req: Request, res: Response) {
    res.json({
      status: 'ok',
      service: 'nodejs-agent-demo',
      time: new Date().toISOString(),
      features: ['SSE-Streaming', 'ReAct-Agent', 'Tool-Calling'],
    });
  },
};
