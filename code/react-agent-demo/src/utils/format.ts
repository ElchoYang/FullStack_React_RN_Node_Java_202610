/**
 * 格式化时间戳为时:分:秒
 */
export function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * 格式化执行耗时 (ms)
 */
export function formatDuration(ms?: number): string {
  if (ms === undefined || ms === null) return '';
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * 安全格式化 JSON 字符串
 */
export function safeFormatJson(data: any): string {
  if (data === undefined || data === null) return '';
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return data;
    }
  }
  return JSON.stringify(data, null, 2);
}
