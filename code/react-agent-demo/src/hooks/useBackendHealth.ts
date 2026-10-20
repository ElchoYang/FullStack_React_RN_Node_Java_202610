import { useState, useEffect, useCallback } from 'react';
import { AgentApiService } from '../services/agentApi';
import type { HealthCheckResponse } from '../types/agent';

export interface BackendHealthState {
  isOnline: boolean;
  isChecking: boolean;
  latency: number | null;
  info: HealthCheckResponse | null;
  error: string | null;
  recheck: () => Promise<void>;
}

export function useBackendHealth(customBaseUrl?: string): BackendHealthState {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [latency, setLatency] = useState<number | null>(null);
  const [info, setInfo] = useState<HealthCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => {
    setIsChecking(true);
    const start = performance.now();
    try {
      const res = await AgentApiService.checkHealth(customBaseUrl);
      const end = performance.now();
      setLatency(Math.round(end - start));
      setIsOnline(true);
      setInfo(res);
      setError(null);
    } catch (err: any) {
      setIsOnline(false);
      setLatency(null);
      setInfo(null);
      setError(err.message || '后端连接失败');
    } finally {
      setIsChecking(false);
    }
  }, [customBaseUrl]);

  useEffect(() => {
    check();
    // 每 30 秒自动心跳轮询一次
    const timer = setInterval(check, 30000);
    return () => clearInterval(timer);
  }, [check]);

  return {
    isOnline,
    isChecking,
    latency,
    info,
    error,
    recheck: check,
  };
}
