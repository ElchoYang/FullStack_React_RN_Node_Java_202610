import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import zh from './locales/zh.json';
import en from './locales/en.json';

// 1. 获取手机当前操作系统的首选语言代码（如 'zh' 或 'en'）
const deviceLocales = getLocales();
const deviceLanguageCode = deviceLocales[0]?.languageCode || 'zh';

// 仅支持 zh 和 en，其余默认回退至 zh
const initialLanguage = deviceLanguageCode.startsWith('en') ? 'en' : 'zh';

// 2. 初始化 i18next
i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    en: { translation: en },
  },
  lng: initialLanguage, // 初始加载语言
  fallbackLng: 'zh',     // 缺失对应翻译时的降级语言
  interpolation: {
    escapeValue: false,  // React 天生防 XSS，无需多余转义
  },
});

/**
 * 切换全局语言助手函数
 * @param lang 'zh' | 'en'
 */
export const changeLanguage = (lang: 'zh' | 'en') => {
  return i18n.changeLanguage(lang);
};

export default i18n;
