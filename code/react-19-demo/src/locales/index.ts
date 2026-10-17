import { zhCN, type LocaleResource } from './zh-CN';
import { enUS } from './en-US';

export type LocaleType = 'zh-CN' | 'en-US';

export const resources: Record<LocaleType, LocaleResource> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

export { zhCN, enUS };
export type { LocaleResource };
