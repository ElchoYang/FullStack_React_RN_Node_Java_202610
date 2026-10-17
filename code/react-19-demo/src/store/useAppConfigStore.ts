import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppConfigState {
  enableMock: boolean;
  networkDelay: number;
  simulateError: boolean;
  setEnableMock: (val: boolean) => void;
  toggleEnableMock: () => void;
  setNetworkDelay: (ms: number) => void;
  setSimulateError: (simulate: boolean) => void;
  toggleSimulateError: () => void;
}

export const useAppConfigStore = create<AppConfigState>()(
  persist(
    (set) => ({
      // 默认初始值优先考虑环境变量，默认开启
      enableMock: import.meta.env.VITE_ENABLE_MOCK !== 'false',
      networkDelay: 800,
      simulateError: false,
      setEnableMock: (enableMock) => set({ enableMock }),
      toggleEnableMock: () => set((state) => ({ enableMock: !state.enableMock })),
      setNetworkDelay: (networkDelay) => set({ networkDelay }),
      setSimulateError: (simulateError) => set({ simulateError }),
      toggleSimulateError: () => set((state) => ({ simulateError: !state.simulateError })),
    }),
    {
      name: 'zustand_app_config',
    }
  )
);
