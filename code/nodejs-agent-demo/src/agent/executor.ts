import { agentTools } from '../tools/index.js';
import { SSESender } from '../utils/sse.js';

interface RunAgentOptions {
  prompt: string;
  sender: SSESender;
}

/**
 * 【ReAct (Reasoning + Acting) Agent 执行器】
 * 演示完整的智能体流式生命周期：
 * 1. 意图理解与规划 (Thought 思考流)
 * 2. 外部工具调用 (Tool Calling 流)
 * 3. 观察工具返回 (Observation)
 * 4. 汇总结论并生成最终回答 (Token 打字机流)
 * 5. 结束流 (Done)
 */
export class AgentExecutor {
  /**
   * 运行 Agent 处理流程
   */
  public static async run({ prompt, sender }: RunAgentOptions) {
    try {
      // 步骤 1：思考过程 (Thought)
      sender.sendThought('正在分析用户意图并制定解决计划...');
      await this.sleep(400);

      // 智能分流与意图判定
      const lower = prompt.toLowerCase();
      const isWeatherQuery = lower.includes('天气') || lower.includes('气温') || lower.includes('下雨');
      const isMathQuery = lower.includes('计算') || lower.includes('+') || lower.includes('*') || lower.includes('/') || /\d+[\s*+\-/]\d+/.test(prompt);
      const isTimeQuery = lower.includes('几点') || lower.includes('时间') || lower.includes('日期');

      // 步骤 2：判断是否需要调用工具
      if (isWeatherQuery) {
        sender.sendThought('识别到用户在咨询天气，准备调用外部天气查询工具 (get_weather)...');
        await this.sleep(300);

        // 提取城市名称（默认北京）
        let city = '北京';
        if (prompt.includes('上海')) city = '上海';
        else if (prompt.includes('深圳')) city = '深圳';
        else if (prompt.includes('广州')) city = '广州';

        const toolCallId = `call_${Date.now()}`;
        // 发送工具开始事件
        sender.sendToolStart(toolCallId, 'get_weather', { city });

        // 执行真实工具
        const weatherResult = await agentTools['get_weather'].execute({ city });
        // 发送工具结束事件
        sender.sendToolEnd(toolCallId, 'get_weather', weatherResult);

        sender.sendThought(`工具返回完成，正在结合城市 [${city}] 的天气情况生成最终答复...`);
        await this.sleep(200);

        // 最终流式输出回答
        const finalAnswer = `为您查询到【${city}】的实时天气如下：\n` +
          `• 当前气温：${weatherResult.temp}\n` +
          `• 天气状况：${weatherResult.condition}\n` +
          `• 空气湿度：${weatherResult.humidity}\n` +
          `• 风力情况：${weatherResult.wind}\n` +
          `出行建议：今日天气${weatherResult.condition.includes('雨') ? '有雨，请随身携带雨具' : '适宜外出，注意保暖'}。`;

        await this.streamTokens(finalAnswer, sender);

      } else if (isMathQuery) {
        sender.sendThought('识别到数学计算任务，调用精确计算器工具 (calculator)...');
        await this.sleep(300);

        // 提取算式
        const expressionMatch = prompt.match(/[\d+\-*/().\s]+/);
        const expression = expressionMatch ? expressionMatch[0].trim() : '1024 * 8';

        const toolCallId = `call_${Date.now()}`;
        sender.sendToolStart(toolCallId, 'calculator', { expression });

        const calcResult = await agentTools['calculator'].execute({ expression });
        sender.sendToolEnd(toolCallId, 'calculator', calcResult);

        sender.sendThought('运算完毕，整理公式与推导步骤...');
        await this.sleep(200);

        const finalAnswer = `数学计算结果如下：\n` +
          `• 待求算式：${calcResult.expression}\n` +
          `• 计算结果：${calcResult.result}\n` +
          `（该计算由后端精确数学工具执行验证无误）`;

        await this.streamTokens(finalAnswer, sender);

      } else if (isTimeQuery) {
        sender.sendThought('查询当前系统时间，调用 get_current_time 工具...');
        const toolCallId = `call_${Date.now()}`;
        sender.sendToolStart(toolCallId, 'get_current_time', { timezone: 'Asia/Shanghai' });

        const timeResult = await agentTools['get_current_time'].execute({ timezone: 'Asia/Shanghai' });
        sender.sendToolEnd(toolCallId, 'get_current_time', timeResult);

        const finalAnswer = `当前北京标准时间为：${timeResult.formatted} (${timeResult.timezone})`;
        await this.streamTokens(finalAnswer, sender);

      } else {
        // 普通对话无需工具，直接流式生成回复
        sender.sendThought('问题属于通用常识问答，无需调用额外工具，开始生成回复...');
        await this.sleep(300);

        const finalAnswer = `您好！我是基于 Node.js 与 SSE 流式协议构建的 AI Agent。\n\n` +
          `我支持以下核心能力：\n` +
          `1. 🧠 思考流（CoT / Thought）：展示我的推导过程；\n` +
          `2. 🛠️ 外部工具调用（Tool Calling）：如查天气、精确数学计算、查服务器时间；\n` +
          `3. ⚡ 毫秒级流式推送（SSE Streaming）：打字机般实时输出。\n\n` +
          `您可以试着问我：\n` +
          `• “北京今天天气怎么样？”\n` +
          `• “帮我算一下 256 * 48 + 1024 / 2”\n` +
          `• “现在几点了？”`;

        await this.streamTokens(finalAnswer, sender);
      }

      // 步骤 5：完成
      sender.complete();

    } catch (err: any) {
      console.error('[Agent Execution Error]:', err);
      sender.error(err.message || 'Agent 执行发生未知错误');
    }
  }

  /**
   * 将长文本切成 Token 流，模拟真实 LLM 打字机输出
   */
  private static async streamTokens(text: string, sender: SSESender, delay = 35) {
    // 按字和标点拆解为 Token
    for (let i = 0; i < text.length; i++) {
      if (sender.closed) break; // 如果前端断开，立即终止推流

      const char = text[i];
      sender.sendToken(char);
      await this.sleep(delay);
    }
  }

  private static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
