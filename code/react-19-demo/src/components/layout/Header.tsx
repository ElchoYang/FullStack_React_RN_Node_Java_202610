import { Badge, Select, Space, Switch, Tag, Tooltip, message } from 'antd';
import {
  BugOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { useAppConfigStore, useI18nStore } from '@/store';
import type { LocaleType } from '@/locales';

export function Header() {
  const {
    enableMock,
    toggleEnableMock,
    networkDelay,
    setNetworkDelay,
    simulateError,
    toggleSimulateError,
  } = useAppConfigStore();
  const { locale, setLocale, t } = useI18nStore();

  const handleToggleMock = () => {
    toggleEnableMock();
    const next = !enableMock;
    if (next) {
      message.success('已开启 MSW Mock 拦截服务（使用模拟数据）');
    } else {
      message.warning('已暂停 MSW Mock 服务（所有接口请求穿透直连后端服务）');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <Badge status={enableMock ? 'processing' : 'default'} color={enableMock ? '#1677ff' : '#94a3b8'} />
        <div className="flex items-center gap-2">
          <Tag color={enableMock ? 'processing' : 'default'} className="font-semibold m-0">
            {t('header.tag')}
          </Tag>
          <span className="text-xs text-slate-500 font-medium hidden md:inline">
            {t('header.desc')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 text-xs">
        {/* 1. UI 动态控制：Mock 开启 / 暂停开关 */}
        <Tooltip placement="bottom" title={t('header.mockTooltip')}>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition ${
              enableMock
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}
          >
            <ApiOutlined className={enableMock ? 'text-blue-600' : 'text-amber-600'} />
            <span className="font-semibold text-xs">
              {enableMock ? t('header.mockActive') : t('header.mockPaused')}
            </span>
            <Switch
              size="small"
              checked={enableMock}
              onChange={handleToggleMock}
              className={enableMock ? 'bg-blue-600' : ''}
            />
          </div>
        </Tooltip>

        {/* 2. 自定义中英文语言切换器 (基于 Zustand) */}
        <Space size="small">
          <GlobalOutlined className="text-slate-400" />
          <Select<LocaleType>
            size="small"
            value={locale}
            onChange={(val) => setLocale(val)}
            style={{ width: 110 }}
            options={[
              { value: 'zh-CN', label: '🇨🇳 中文' },
              { value: 'en-US', label: '🇺🇸 English' },
            ]}
          />
        </Space>

        {/* 3. 网络延迟选择器 (基于 Zustand persist) */}
        <Space size="small" className="hidden lg:inline-flex">
          <ClockCircleOutlined className="text-slate-400" />
          <span className="text-slate-500 font-medium">{t('header.latencyLabel')}:</span>
          <Select
            size="small"
            value={networkDelay}
            onChange={setNetworkDelay}
            disabled={!enableMock}
            style={{ width: 140 }}
            options={[
              { value: 300, label: t('header.speedFast') },
              { value: 800, label: t('header.speedSmooth') },
              { value: 1500, label: t('header.speedSlow') },
              { value: 2500, label: t('header.speedLong') },
            ]}
          />
        </Space>

        {/* 4. 模拟故障切换开关 (基于 Zustand) */}
        <Tooltip placement="bottom" title={t('header.errorTooltip')}>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition ${
              simulateError
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            {simulateError ? (
              <BugOutlined className="text-rose-600 animate-bounce" />
            ) : (
              <CheckCircleOutlined className="text-emerald-600" />
            )}
            <span className="font-semibold text-xs">
              {simulateError ? t('header.simulateError') : t('header.normalMode')}
            </span>
            <Switch
              size="small"
              checked={simulateError}
              onChange={toggleSimulateError}
              disabled={!enableMock}
              className={simulateError ? 'bg-rose-600' : ''}
            />
          </div>
        </Tooltip>

        <Tag icon={<ThunderboltOutlined />} color="purple" className="hidden xl:inline-flex m-0">
          {t('header.nativeSuspense')}
        </Tag>
      </div>
    </header>
  );
}
