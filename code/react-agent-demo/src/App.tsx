import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { SettingsModal } from './components/layout/SettingsModal';
import { ChatContainer } from './components/chat/ChatContainer';
import { ChatInput } from './components/chat/ChatInput';
import { useAgentChat } from './hooks/useAgentChat';
import { useBackendHealth } from './hooks/useBackendHealth';

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const {
    messages,
    isStreaming,
    config,
    updateConfig,
    sendMessage,
    stopStream,
    clearMessages,
  } = useAgentChat();

  const health = useBackendHealth(config.backendUrl);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* 左侧架构与工具抽屉 */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectPrompt={(prompt) => sendMessage(prompt)}
      />

      {/* 右侧主聊天区 */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* 顶部导航与健康检测 */}
        <Header
          health={health}
          messageCount={messages.length}
          onClearHistory={clearMessages}
          onOpenSettings={() => setSettingsOpen(true)}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* 聊天消息流式瀑布流 */}
        <ChatContainer
          messages={messages}
          isStreaming={isStreaming}
          onSendPreset={(prompt) => sendMessage(prompt)}
          autoScroll={config.autoScroll}
        />

        {/* 底部输入框与推荐提问 */}
        <ChatInput
          onSend={sendMessage}
          onStop={stopStream}
          isStreaming={isStreaming}
        />
      </div>

      {/* 设置对话框 */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        config={config}
        onSave={updateConfig}
      />
    </div>
  );
}

export default App;
