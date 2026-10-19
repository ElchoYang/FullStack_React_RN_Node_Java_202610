import React from 'react';
// 【React Navigation Drawer】创建抽屉侧边栏导航器
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { MainDrawerParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigator';
import { AboutScreen } from '../screens/AboutScreen';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

interface DrawerNavigatorProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

/**
 * 【2. 侧边抽屉导航器 (DrawerNavigator)】
 * 核心设计模式：抽屉导航作为外层容器，将 BottomTabNavigator 作为主体内容包装在内
 * 这样用户可以：
 * - 从屏幕左边缘向右侧滑呼出侧边栏
 * - 点击 Appbar 上的 menu 汉堡按钮呼出侧边栏
 * - 侧边栏包含“主页（底栏合辑）”与“关于应用（独立全屏项）”
 */
export const DrawerNavigator: React.FC<DrawerNavigatorProps> = ({
  isDarkMode,
  onToggleTheme,
}) => {
  const theme = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false, // 隐藏抽屉默认的顶部原生 Bar，采用 Paper Appbar
        drawerActiveTintColor: theme.colors.primary, // 选中的侧边菜单高亮颜色
        drawerInactiveTintColor: theme.colors.onSurfaceVariant, // 未选中的菜单字体颜色
        drawerStyle: {
          backgroundColor: theme.colors.surface, // 抽屉面板底色（跟随深浅色主题）
          width: 280, // 抽屉滑出宽度
        },
      }}
    >
      {/* 抽屉项 1：主界面（嵌套底部 Tab 导航） */}
      <Drawer.Screen
        name="MainTabs"
        options={{
          drawerLabel: '首页中心',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" size={size} color={color} />
          ),
        }}
      >
        {() => (
          <BottomTabNavigator
            isDarkMode={isDarkMode}
            onToggleTheme={onToggleTheme}
          />
        )}
      </Drawer.Screen>

      {/* 抽屉项 2：关于应用独立页 */}
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          drawerLabel: '关于应用 (Drawer)',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="information-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
