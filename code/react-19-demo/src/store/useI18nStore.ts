import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale as AntdLocale } from 'antd/es/locale';
import antdZhCN from 'antd/locale/zh_CN.js';
import antdEnUS from 'antd/locale/en_US.js';
import { resources, type LocaleType } from '@/locales';

export type I18nParams = Record<string, string | number>;

interface I18nStoreState {
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
  getAntdLocale: () => AntdLocale;
  /**
   * 国际化翻译函数
   * @param path 点路径，如 'user.totalMembers' 或深层 'a.b.c.d'
   * @param paramsOrFallback 插值参数对象 { total: 10 } 或降级文本
   * @param fallback 降级文本 (当第二参数为插值对象时使用)
   */
  t: (
    path: string,
    paramsOrFallback?: I18nParams | string,
    fallback?: string
  ) => string;
}

/**
 * 将字符串中的 {key} 变量占位符替换为 params 中的实际值
 * 例如: "共 {total} 位成员", { total: 12 } => "共 12 位成员"
 */
function interpolate(template: string, params: I18nParams): string {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
    if (key in params) {
      return String(params[key]);
    }
    return match; // 若未传参则保留原占位符
  });
}

export const useI18nStore = create<I18nStoreState>()(
  persist(
    (set, get) => ({
      locale: 'zh-CN',
      setLocale: (locale) => set({ locale }),

      getAntdLocale: () => {
        return get().locale === 'en-US' ? antdEnUS : antdZhCN;
      },

      t: (
        path: string,
        paramsOrFallback?: I18nParams | string,
        fallback?: string
      ): string => {
        // 参数归一化处理
        const isParamObj =
          paramsOrFallback !== null &&
          typeof paramsOrFallback === 'object';
        const params: I18nParams | undefined = isParamObj
          ? (paramsOrFallback as I18nParams)
          : undefined;
        const defaultFallback: string = isParamObj
          ? fallback || path
          : typeof paramsOrFallback === 'string'
          ? paramsOrFallback
          : path;

        const currentLocale = get().locale;
        const currentDict = resources[currentLocale] || resources['zh-CN'];
        const keys = path.split('.');
        let current: unknown = currentDict;

        // 逐层遍历（支持任意深层、孙子层、曾孙层）
        for (const k of keys) {
          if (current && typeof current === 'object' && k in current) {
            current = (current as Record<string, unknown>)[k];
          } else {
            return params ? interpolate(defaultFallback, params) : defaultFallback;
          }
        }

        if (typeof current === 'string') {
          return params ? interpolate(current, params) : current;
        }

        return params ? interpolate(defaultFallback, params) : defaultFallback;
      },
    }),
    {
      name: 'zustand_user_locale',
      partialize: (state) => ({ locale: state.locale }),
    }
  )
);
