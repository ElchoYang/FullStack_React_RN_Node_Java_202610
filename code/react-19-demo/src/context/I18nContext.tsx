import { type ReactNode } from 'react';
import { useI18nStore } from '@/store';

/**
 * I18nProvider 现在由 Zustand (useI18nStore) 驱动
 * 自动接管持久化、状态派发与 React 19 细粒度渲染订阅
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useI18n() {
  const locale = useI18nStore((s) => s.locale);
  const setLocale = useI18nStore((s) => s.setLocale);
  const t = useI18nStore((s) => s.t);
  const antdLocale = useI18nStore((s) => s.getAntdLocale());

  return {
    locale,
    setLocale,
    antdLocale,
    t,
  };
}
