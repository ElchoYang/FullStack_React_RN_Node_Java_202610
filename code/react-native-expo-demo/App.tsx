import { useState, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import {
  NavigationContainer,
  DefaultTheme as NavLightTheme,
  DarkTheme as NavDarkTheme,
  LinkingOptions,
} from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { lightTheme, darkTheme } from './src/theme';
import { AppNavigator } from './src/navigation/AppNavigator';
import { RootStackParamList } from './src/navigation/types';

/**
 * 【深度链接 (Deep Linking) 配置】
 * 支持两种唤起方式：
 * 1. 自定义协议头 (Custom Scheme)：reactnativedemo://
 * 2. 通用域名 (Universal / App Links)：https://demo.example.com
 *
 * 路径映射规则：
 * • reactnativedemo://posts        -> 文章列表页
 * • reactnativedemo://create       -> 发布文章页
 * • reactnativedemo://showcase     -> UI 组件大厅
 * • reactnativedemo://about        -> 关于应用 (Drawer)
 * • reactnativedemo://post/123     -> 文章详情 (Stack，携带参数 postId=123)
 */
const prefix = Linking.createURL('/');

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, 'reactnativedemo://', 'https://demo.example.com'],
  config: {
    screens: {
      DrawerRoot: {
        screens: {
          MainTabs: {
            screens: {
              Posts: 'posts',
              Create: 'create',
              Showcase: 'showcase',
            },
          },
          About: 'about',
        },
      },
      PostDetail: 'post/:postId',
    },
  },
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 动态计算 Paper 主题
  const paperTheme = useMemo(() => {
    return isDarkMode ? darkTheme : lightTheme;
  }, [isDarkMode]);

  // 动态同步 React Navigation 导航主题
  const navTheme = useMemo(() => {
    const base = isDarkMode ? NavDarkTheme : NavLightTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: paperTheme.colors.primary,
        background: paperTheme.colors.background,
        card: paperTheme.colors.surface,
        text: paperTheme.colors.onSurface,
        border: paperTheme.colors.outlineVariant,
      },
    };
  }, [isDarkMode, paperTheme]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    // 1. 全面屏安全区上下文容器：在顶层接管刘海屏、灵动岛、底部手势条的安全内边距计算
    <SafeAreaProvider>
      {/* 2. UI 组件库上下文：向全应用注入 React Native Paper (MD3) 配色、排版、Portal 及主题 tokens */}
      <PaperProvider theme={paperTheme}>
        {/* 3. 路由导航总容器：管理路由状态与导航栈，并将导航栏底色/文字与 Paper 主题配色对齐，注入 linking 支持深度链接 */}
        <NavigationContainer theme={navTheme} linking={linking}>
          {/* 4. 业务总导航器：复合集成 Stack + Drawer + Tab 三大导航器 */}
          <AppNavigator
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
          />
          {/* 5. 移动端系统顶部状态栏：根据当前主题自动切换电量、时间、WiFi 图标为白字或黑字 */}
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
