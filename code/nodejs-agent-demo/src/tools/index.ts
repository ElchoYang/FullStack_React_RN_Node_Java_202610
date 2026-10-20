import { AgentTool } from '../types/agent.js';

/**
 * 工具 1：天气查询工具
 */
export const weatherTool: AgentTool = {
  name: 'get_weather',
  description: '查询指定城市的实时天气预报与气温信息',
  parameters: {
    type: 'object',
    properties: {
      city: {
        type: 'string',
        description: '城市名称，如 "北京"、"上海"、"New York"',
      },
    },
    required: ['city'],
  },
  execute: async ({ city }: { city: string }) => {
    // 模拟真实 API 请求延迟与业务数据
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockDb: Record<string, any> = {
      '北京': { temp: '22℃', condition: '晴朗无云', wind: '微风', humidity: '45%' },
      '上海': { temp: '26℃', condition: '小雨绵绵', wind: '东风3级', humidity: '78%' },
      '深圳': { temp: '29℃', condition: '多云转阵雨', wind: '南风2级', humidity: '82%' },
      '广州': { temp: '30℃', condition: '晴间多云', wind: '东南风', humidity: '75%' },
    };
    return mockDb[city] || { temp: '25℃', condition: '晴', wind: '微风', humidity: '50%' };
  },
};

/**
 * 工具 2：精确数学计算器工具
 */
export const calculatorTool: AgentTool = {
  name: 'calculator',
  description: '用于执行精确的数学算式运算（加减乘除、乘方等）',
  parameters: {
    type: 'object',
    properties: {
      expression: {
        type: 'string',
        description: '数学表达式，如 "128 * 45 + 1024 / 4"',
      },
    },
    required: ['expression'],
  },
  execute: async ({ expression }: { expression: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    try {
      // 安全清理，只允许数字与基础运算符号
      const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
      // 使用 Function 代替 eval 进行安全求值
      const result = new Function(`return (${sanitized})`)();
      return { expression, result };
    } catch {
      return { error: '算式格式有误，无法计算' };
    }
  },
};

/**
 * 工具 3：获取当前服务器标准时间工具
 */
export const timeTool: AgentTool = {
  name: 'get_current_time',
  description: '获取当前的真实系统时间与时区',
  parameters: {
    type: 'object',
    properties: {
      timezone: {
        type: 'string',
        description: '时区名称，如 "Asia/Shanghai" 或 "UTC"',
      },
    },
    required: [],
  },
  execute: async ({ timezone = 'Asia/Shanghai' }: { timezone?: string }) => {
    const now = new Date();
    return {
      iso: now.toISOString(),
      formatted: now.toLocaleString('zh-CN', { timeZone: timezone }),
      timezone,
    };
  },
};

/**
 * 工具注册表中心 (Tool Registry)
 */
export const agentTools: Record<string, AgentTool> = {
  [weatherTool.name]: weatherTool,
  [calculatorTool.name]: calculatorTool,
  [timeTool.name]: timeTool,
};
