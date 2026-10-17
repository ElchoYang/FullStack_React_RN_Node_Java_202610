import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

async function prepareApp() {
  // 环境变量为开发模式或显式开启时，初始化 MSW 工作线程
  const isMockAllowed = import.meta.env.VITE_ENABLE_MOCK !== 'false';

  if (isMockAllowed) {
    const { worker } = await import('./mocks/browser');
    await worker.start();
    console.info('[MSW] Service Worker 已注册 (支持顶部 UI 开关实时暂停/放行)');
  } else {
    console.info('[MSW] 环境变量已彻底禁用 (VITE_ENABLE_MOCK=false)，网络请求直连后端');
  }
}

prepareApp().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
