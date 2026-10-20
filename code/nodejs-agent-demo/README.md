# Node.js AI Agent Demo (企业级流式智能体后台)

本项目是一个基于 **Node.js + Express + TypeScript** 构建的 **AI Agent（智能体）流式后台服务**。
完整实现了业界大模型主流的 **SSE (Server-Sent Events) 流式传输协议** 与 **ReAct (Reasoning + Acting) 架构**。

---

## 一、核心特性与技术架构

| 模块 | 实现方案 | 解决的问题与业务价值 |
| :--- | :--- | :--- |
| **传输层协议** | **SSE (Server-Sent Events)** | 区别于传统一次性 JSON 响应，建立持久化 HTTP 管道，实现像 ChatGPT / Claude 一样的毫秒级打字机逐字推流。 |
| **智能体架构** | **ReAct 范式 (Thought + Tool Calling)** | 具备完整的生命周期：分析意图 (Thought) -> 决定工具 (Tool Start) -> 执行工具 (Tool End) -> 最终综合回答 (Token Stream)。 |
| **工具箱体系** | **可扩展插件化工具库** | 内置天气查询 (`get_weather`)、精确数学运算器 (`calculator`)、时区时间获取 (`get_current_time`) 等工具。 |
| **开发环境** | **TypeScript + tsx** | 全链路强类型约束，秒级热重载（无需重复构建即可保存即测）。 |
| **客户端消费脚本** | **Node.js Fetch Stream Client** | 自带一个终端流式消费演示客户端 (`client-demo.ts`)，开箱即可看到彩色实时流式输出。 |

---

## 二、目录结构

```text
code/nodejs-agent-demo/
├── src/
│   ├── types/
│   │   └── agent.ts             # 强类型定义 (Message, ToolCall, SSEEventType, SSEPacket)
│   ├── tools/
│   │   └── index.ts             # 工具库 (get_weather, calculator, get_current_time)
│   ├── utils/
│   │   └── sse.ts               # SSE 格式化发送器封装 (负责 event, data, 换行符与断连监听)
│   ├── agent/
│   │   └── executor.ts          # ReAct 智能体执行引擎 (意图分流、执行工具、切片打字机推流)
│   ├── controllers/
│   │   └── agentController.ts   # Express 控制器 (流式聊天接口、健康检查)
│   ├── routes/
│   │   └── agentRoutes.ts       # 路由挂载
│   ├── server.ts                # 服务端启动入口 (CORS, 环境变量, 端口监听)
│   └── client-demo.ts           # 终端流式消费测试脚本
├── .env                         # 环境变量配置 (端口、可选 API Key)
├── package.json                 # 依赖声明与脚本
└── tsconfig.json                # TypeScript 编译配置
```

---

## 三、快速启动与测试

### 1. 启动后端开发服务器
```bash
cd code/nodejs-agent-demo
npm run dev
```
启动成功后会看到：
```text
======================================================
🤖 AI Agent Node.js 后端服务启动成功!
📡 服务监听端口: http://localhost:3001
🩺 健康检查地址: http://localhost:3001/api/health
⚡ SSE 流式接口: http://localhost:3001/api/agent/chat/stream
======================================================
```

### 2. 方式 A：使用内置客户端脚本测试（最直观、推荐！）
打开另一个终端，运行：
```bash
npm run test:client
```
你会看到终端以打字机形式动态实时输出：
```text
👤 用户提问: "帮我查一下北京今天的天气，另外算一下 128 * 64 等于多少"
📡 正在连接 Agent SSE 流式接口...

🧠 [思考过程]: 正在分析用户意图并制定解决计划...
🧠 [思考过程]: 识别到用户在咨询天气，准备调用外部天气查询工具 (get_weather)...
🛠️ [调用工具]: get_weather({"city":"北京"})
✅ [工具返回]: {"temp":"22℃","condition":"晴朗无云","wind":"微风","humidity":"45%"}
🧠 [思考过程]: 工具返回完成，正在结合城市 [北京] 的天气情况生成最终答复...
为您查询到【北京】的实时天气如下：
• 当前气温：22℃
• 天气状况：晴朗无云
• 空气湿度：45%
• 风力情况：微风
出行建议：今日天气适宜外出，注意保暖。

🎉 [流式结束]: finishReason=stop
```

### 3. 方式 B：使用 `curl` 命令行实时捕获流
```bash
curl -N -X POST http://localhost:3001/api/agent/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"prompt":"北京今天天气怎么样？"}'
```
*(注意：`-N` 参数表示禁用缓冲区，实时查看一个个到达的数据块)*

### 4. 方式 C：浏览器 GET /api/health
直接在浏览器访问：`http://localhost:3001/api/health` 即可查看服务健康状态。
