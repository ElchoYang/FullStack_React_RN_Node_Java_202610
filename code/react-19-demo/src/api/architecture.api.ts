import { request } from './client';

export interface ArchitectureLayer {
  name: string;
  role: string;
  files: string[];
  description: string;
  color: string;
}

export interface FlowStep {
  step: number;
  title: string;
  status: 'pending' | 'resolved' | 'rejected' | 'transition';
  detail: string;
  codeSnippet: string;
}

export interface PatternComparison {
  dimension: string;
  traditional: string;
  react19Use: string;
  dataRouter: string;
  winner: 'react19' | 'dataRouter' | 'draw';
}

export interface ArchitectureData {
  projectName: string;
  version: string;
  reactVersion: string;
  layers: ArchitectureLayer[];
  flowSteps: FlowStep[];
  comparisons: PatternComparison[];
  coreDesignRules: { rule: string; explanation: string; badExample: string; goodExample: string }[];
}

/**
 * 真实网络请求（由 Axios 发出，由 MSW Service Worker 拦截）
 */
export function fetchArchitectureData(): Promise<ArchitectureData> {
  return request.get<ArchitectureData>('/architecture');
}
