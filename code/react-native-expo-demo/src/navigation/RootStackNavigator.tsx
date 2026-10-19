import React from 'react';
// 【React Navigation Stack】原生性能堆栈导航器（底层依赖 react-native-screens）
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { DrawerNavigator } from './DrawerNavigator';
import { PostDetailScreen } from '../screens/PostDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootStackNavigatorProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

/**
 * 【3. 根堆栈导航器 (RootStackNavigator)】
 * 移动端顶层骨架（最外层栈）：
 * - 栈底是 DrawerRoot（抽屉导航包裹着的底栏主界面）
 * - 当在列表页点击某个卡片时，调用 navigation.navigate('PostDetail', { postId: 1 })
 * - 栈顶会推入 (Push) PostDetail 详情页面，自带 iOS / Android 原生右滑返回手势与过渡动效
 */
export const RootStackNavigator: React.FC<RootStackNavigatorProps> = ({
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // 统一隐藏默认原生顶部导航条，由各页面内的 Paper Appbar 接管
        animation: 'slide_from_right', // 页面从右侧滑入的经典移动端动效
      }}
    >
      {/* 根页面：侧边抽屉 + 底部 Tab 复合主容器 */}
      <Stack.Screen name="DrawerRoot">
        {() => (
          <DrawerNavigator
            isDarkMode={isDarkMode}
            onToggleTheme={onToggleTheme}
          />
        )}
      </Stack.Screen>

      {/* 堆栈推入页面：文章详情页（接收 postId 参数） */}
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
