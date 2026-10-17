import { useState, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import {
  NavigationContainer,
  DefaultTheme as NavLightTheme,
  DarkTheme as NavDarkTheme,
} from '@react-navigation/native';
import { lightTheme, darkTheme } from './src/theme';
import { AppNavigator } from './src/navigation/AppNavigator';

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
        {/* 3. 路由导航总容器：管理路由状态与导航栈，并将导航栏底色/文字与 Paper 主题配色对齐 */}
        <NavigationContainer theme={navTheme}>
          {/* 4. 业务导航器：底部选项卡导航，挂载文章列表、发文章、UI 大厅三个核心屏幕 */}
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
