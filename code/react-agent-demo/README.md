# React AI Agent Studio (智能体流式交互工作台)

本项目是一个基于 **React 19 + Vite + TypeScript + Tailwind CSS** 构建的 **AI Agent（智能体）前端交互工作台**。  
专门用于调用并可视化展示 **`code/nodejs-agent-demo`** 后端服务提供的 **SSE (Server-Sent Events) 流式接口** 与 **ReAct (Reasoning + Acting)** 智能体执行过程。

---

## 🌟 核心特性与技术亮点

| 核心特性 | 实现方案 | 交互与业务价值 |
| :--- | :--- | :--- |
| **🧠 CoT 深度思考流 (Thought)** | 动态折叠手风琴卡片 (`ThoughtAccordion`) | 实时展示 AI 的意图理解与任务规划步骤，透明化呈现推理链（类似 DeepSeek-R1 / OpenAI o1/o3 思考过程）。 |
| **🛠️ 工具调用追踪 (Tool Calling)** | 状态卡片 + JSON 检查器 (`ToolCallCard`) | 实时可视化展示工具执行状态（执行中、耗时、执行成功），支持展开查看输入入参与工具真实执行返回值。 |
| **⚡ 毫秒级打字机推流 (SSE)** | `ReadableStream` + 缓冲区切片解码器 (`sseParser.ts`) | 原生支持流式数据块解析，逐字打字机推流输出，告别死等加载圈。 |
| **⏹️ 随时中止生成 (Abort)** | 原生 `AbortController` 绑定 | 用户可随时点击「停止生成」，前端即时中断网络管道，后端同步感知挂断连接，避免资源空耗。 |
| **🩺 后端服务自检与延迟探测** | 自动化心跳轮询 Hook (`useBackendHealth`) | 顶部实时显示后端在线状态（绿灯/红灯）以及心跳延迟 (ms)，若后端离线支持一键重试检测。 |
| **🎨 现代化深色主题 & Markdown** | Tailwind CSS + 自研轻量级 Markdown 渲染器 | 支持粗体、行内代码、段落排版，代码块自带一键复制按钮 (`CopyButton`)。 |
| **💡 快捷提问预设 (Prompt Presets)** | 一键触发工具预设标签栏 (`PromptPresets`) | 内置天气查询、高精度数学计算、服务器时间获取等多种预设，开箱即测。 |
| **💾 本地会话持久化** | `localStorage` 同步 Hook (`useAgentChat`) | 自动保存聊天历史与偏好配置，刷新页面不丢失会话上下文。 |

---

## 📂 目录结构与架构设计

```text
code/react-agent-demo/
├── src/
│   ├── types/
│   │   └── agent.ts             # 强类型规范 (ChatMessage, ToolCallItem, ThoughtStep, SSEPacket)
│   ├── services/
│   │   ├── sseParser.ts         # SSE 规范流式解码引擎 (双换行拆包、JSON校验、事件派发)
│   │   └── agentApi.ts          # API 通信层 (健康探测、流式请求、动态基地址解析)
│   ├── hooks/
│   │   ├── useAgentChat.ts      # 聊天核心状态管理 (消息流合并、思考链追加、工具状态、中止生成)
│   │   └── useBackendHealth.ts  # 后端连通性与网络延迟监测 Hook
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatContainer.tsx    # 消息瀑布流主容器与空状态引导页
│   │   │   ├── MessageBubble.tsx    # 消息气泡 (区分 User 与 Assistant，集成思考与工具)
│   │   │   ├── ThoughtAccordion.tsx # 深度思考推理手风琴组件
│   │   │   ├── ToolCallCard.tsx     # 工具调用卡片 (入参与出参折叠、状态指示)
│   │   │   ├── MarkdownRenderer.tsx # 优雅的轻量 Markdown/代码块渲染器
│   │   │   ├── ChatInput.tsx        # 智能输入框 (Enter发送、Shift+Enter换行、停止生成)
│   │   │   └── PromptPresets.tsx    # 预设推荐提问标签条
│   │   ├── layout/
│   │   │   ├── Header.tsx           # 顶部导航栏 (服务在线状态指示、清空、设置)
│   │   │   ├── Sidebar.tsx          # 侧边栏 (ReAct 循环范式科普、工具箱清单)
│   │   │   └── SettingsModal.tsx    # 通信设置弹窗 (后端地址修改、实时测速、偏好切换)
│   │   └── common/
│   │       └── CopyButton.tsx       # 通用文本复制按钮
│   ├── utils/
│   │   └── format.ts            # 耗时格式化、时间戳美化、JSON安全格式化
│   ├── App.tsx                  # 主页面布局与状态装配
│   ├── index.css                # Tailwind CSS 样式基底与滚动条美化
│   └── main.tsx                 # React 19 应用入口挂载
├── vite.config.ts               # Vite 8 配置 (集成 Tailwind CSS、开发代理 /api -> 3001)
├── package.json                 # 依赖配置
└── tsconfig.json                # TypeScript 配置
```

---

## 🚀 双端启动与联调指南

本前端项目专为联动 `code/nodejs-agent-demo` 而设计，请按以下步骤启动双端：

### 步骤 1：启动 Node.js Agent 后端

打开第一个终端窗口：
```bash
# 进入后端目录
cd code/nodejs-agent-demo

# 安装依赖 (如已安装可跳过)
npm install

# 启动后端服务 (监听 3001 端口)
npm run dev
```

启动成功后，终端将输出：
```text
======================================================
🤖 AI Agent Node.js 后端服务启动成功!
📡 服务监听端口: http://localhost:3001
🩺 健康检查地址: http://localhost:3001/api/health
⚡ SSE 流式接口: http://localhost:3001/api/agent/chat/stream
======================================================
```

---

### 步骤 2：启动 React Agent 前端

打开第二个终端窗口：
```bash
# 进入前端目录
cd code/react-agent-demo

# 安装依赖 (如已安装可跳过)
npm install

# 启动前端开发服务器
npm run dev
```

终端将提示前端服务已就绪：
```text
  VITE v8.3.4  ready in 320 ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
```

在浏览器中打开 `http://localhost:5174`，即可进入智能体工作台！  
页面顶部的连通性指示灯将自动变为 **🟢 服务在线 · Xms**。

---

## 📡 接口对接与协议细节

### 1. 健康检查接口
- **路径**：`GET /api/health`
- **说明**：React 端在挂载时及每隔 30 秒自动调用，探活后端服务并测算延迟。
- **返回示例**：
  ```json
  {
    "status": "ok",
    "service": "nodejs-agent-demo",
    "time": "2026-10-20T08:00:00.000Z",
    "features": ["SSE-Streaming", "ReAct-Agent", "Tool-Calling"]
  }
  ```

### 2. Agent 流式聊天接口
- **路径**：`POST /api/agent/chat/stream`
- **请求头**：`Content-Type: application/json`、`Accept: text/event-stream`
- **请求体**：
  ```json
  {
    "prompt": "帮我查一下北京今天的天气，另外算一下 128 * 64 等于多少"
  }
  ```
- **SSE 流式传输事件序列**：
  1. `event: thought` -> 推送思考链推理过程；
  2. `event: tool_start` -> 推送工具开始调用（包含 `toolName` 和 `args`）；
  3. `event: tool_end` -> 推送工具调用结果（包含 `result` 与执行耗时）；
  4. `event: token` -> 逐字流式打字机推送最终回答；
  5. `event: done` -> 结束标记与 Token 统计；
  6. `event: error` -> 异常时抛出错误说明。

---

## 🧪 推荐体验指令

进入页面后，可直接点击下方的快捷标签进行体验：

1. **测试天气查询工具**：
   > `北京今天天气怎么样？`  
   > 观察思考链识别天气意图，触发 `get_weather` 工具，获取气温与湿度并整合输出。

2. **测试高精度数学工具**：
   > `帮我计算一下 256 * 48 + 1024 / 2 等于多少`  
   > 观察触发 `calculator` 工具，在详情卡片中查看计算公式与结果。

3. **测试服务器时间工具**：
   > `查询现在北京时间是几点几分？`  
   > 观察触发 `get_current_time` 工具，返回精确时区时间。

4. **测试通用知识问答**：
   > `介绍一下你的 ReAct 智能体架构与支持哪些工具能力`  
   > 观察无需调用外部工具时，Agent 直接进行思考并打字机输出。

5. **测试中断功能**：
   > 发送长问题后，立即点击红色的 **「停止生成」** 按钮，验证网络流即刻中断与状态闭环。

---

## 🛠️ 项目构建与代码检查

```bash
# 生产环境打包 (TypeScript 强校验 + Vite 资源压缩)
npm run build

# 预览打包产物
npm run preview
```
