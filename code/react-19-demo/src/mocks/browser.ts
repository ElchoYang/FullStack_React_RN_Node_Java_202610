import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// 初始化浏览器端 MSW Service Worker
export const worker = setupWorker(...handlers);
