import { Router } from 'express';
import { agentController } from '../controllers/agentController.js';

const router = Router();

// 健康检查
router.get('/health', agentController.healthCheck);

// Agent 流式交互主接口 (SSE)
router.post('/agent/chat/stream', agentController.streamChat);

export default router;
