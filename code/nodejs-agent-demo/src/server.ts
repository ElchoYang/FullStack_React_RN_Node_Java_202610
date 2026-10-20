import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import agentRoutes from './routes/agentRoutes.js';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 跨域与基础中间件
app.use(cors({
  origin: '*', // 允许移动端与网页端跨域调用
  methods: ['GET', 'POST', 'OPTIONS'],
}));
app.use(express.json());

// 注册路由
app.use('/api', agentRoutes);

// 根路由提示
app.get('/', (_req, res) => {
  res.json({
    message: '🚀 AI Agent Node.js Backend is Running!',
    endpoints: {
      health: 'GET /api/health',
      streamChat: 'POST /api/agent/chat/stream',
    },
    demoPrompt: 'curl -X POST http://localhost:' + PORT + '/api/agent/chat/stream -H "Content-Type: application/json" -d \'{"prompt":"北京今天天气怎么样？"}\'',
  });
});

// 启动服务
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🤖 AI Agent Node.js 后端服务启动成功!`);
  console.log(`📡 服务监听端口: http://localhost:${PORT}`);
  console.log(`🩺 健康检查地址: http://localhost:${PORT}/api/health`);
  console.log(`⚡ SSE 流式接口: http://localhost:${PORT}/api/agent/chat/stream`);
  console.log(`======================================================\n`);
});
