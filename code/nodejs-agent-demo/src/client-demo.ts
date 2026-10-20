/**
 * 【客户端流式消费演示脚本】
 * 演示作为前端应用（React / React Native / CLI）如何消费后端的 SSE 流式数据
 * 运行方式：npm run test:client
 */
const API_URL = 'http://localhost:3001/api/agent/chat/stream';

async function testAgentStream(prompt: string) {
  console.log(`\n======================================================`);
  console.log(`👤 用户提问: "${prompt}"`);
  console.log(`📡 正在连接 Agent SSE 流式接口...`);
  console.log(`======================================================\n`);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok || !response.body) {
      console.error('连接失败，状态码:', response.status);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // 按 SSE 规范的 \n\n 分隔符拆分事件
      const chunks = buffer.split('\n\n');
      buffer = chunks.pop() || ''; // 最后一段可能不完整，放回缓冲区

      for (const chunk of chunks) {
        if (!chunk.trim()) continue;

        let eventType = 'message';
        let dataStr = '';

        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            eventType = line.replace('event: ', '').trim();
          } else if (line.startsWith('data: ')) {
            dataStr = line.replace('data: ', '').trim();
          }
        }

        if (!dataStr) continue;

        try {
          const payload = JSON.parse(dataStr);

          switch (eventType) {
            case 'thought':
              console.log(`🧠 [思考过程]: ${payload.content}`);
              break;

            case 'tool_start':
              console.log(`🛠️ [调用工具]: ${payload.toolName}(${JSON.stringify(payload.args)})`);
              break;

            case 'tool_end':
              console.log(`✅ [工具返回]: ${JSON.stringify(payload.result)}`);
              break;

            case 'token':
              // 模拟实时打字机输出，不换行
              process.stdout.write(payload.content);
              break;

            case 'done':
              console.log(`\n\n🎉 [流式结束]: finishReason=${payload.finishReason}`);
              break;

            case 'error':
              console.error(`\n❌ [发生错误]: ${payload.error}`);
              break;
          }
        } catch {
          // JSON 解析错误忽略
        }
      }
    }
  } catch (err: any) {
    console.error('网络请求失败:', err.message);
    console.log('💡 提示：请确保后端服务已经启动 (npm run dev)');
  }
}

// 自动测试一条天气问题
const testPrompt = process.argv[2] || '帮我查一下北京今天的天气，另外算一下 128 * 64 等于多少';
testAgentStream(testPrompt);
