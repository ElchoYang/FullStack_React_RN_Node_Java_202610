import React from 'react';
// 【React Navigation】createBottomTabNavigator: 底部标签栏导航器的创建工厂函数
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// 【Expo 图标库】MaterialCommunityIcons: 移动端常用的矢量图标库组件（免引入本地图片文件，矢量缩放不失真）
import { MaterialCommunityIcons } from '@expo/vector-icons';
// 【React Native Paper】useTheme: Hook，用于获取当前应用生效的 MD3 主题对象（包含颜色 colors、字体 fonts、圆角 roundness 等）
import { useTheme } from 'react-native-paper';

// 引入三个展示页面组件
import { PostListScreen } from '../screens/PostListScreen';
import { PostCreateScreen } from '../screens/PostCreateScreen';
import { ShowcaseScreen } from '../screens/ShowcaseScreen';

/**
 * 【TypeScript 路由参数映射表】
 * 定义当前导航器包含哪些路由名称（Route Name），以及跳转该页面时需要携带的参数类型
 * - Posts: undefined -> 表示跳转到 Posts 页面不需要传参
 * - Create: undefined -> 表示跳转到 Create 页面不需要传参
 * - Showcase: undefined -> 表示跳转到 Showcase 页面不需要传参
 *
 * 作用：在 React Navigation 中提供严格的 TypeScript 类型提示与代码补全，防止拼错路由名称。
 */
export type RootTabParamList = {
  Posts: undefined;
  Create: undefined;
  Showcase: undefined;
};

/**
 * 调用 createBottomTabNavigator 并传入参数表范型
 * 返回包含 Navigator（容器组件）和 Screen（屏幕组件）的对象
 */
const Tab = createBottomTabNavigator<RootTabParamList>();

// 导航组件的入参定义：接收顶层传递的深色模式状态与切换回调函数
interface AppNavigatorProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({
  isDarkMode,
  onToggleTheme,
}) => {
  // 获取当前生效的 Paper 主题，以便将 Tab 栏的颜色与全应用保持一致
  const theme = useTheme();

  return (
    /**
     * 【Tab.Navigator 底部标签栏导航容器】
     * 负责管理所有底栏页面切换、标签点击动效及底栏样式
     *
     * 【screenOptions 属性】针对该 Navigator 下所有 Tab.Screen 的全局通用配置：
     * - headerShown: false -> 隐藏 React Navigation 自带的原生顶部标题栏（因为我们在各个页面内使用了更美观的 Paper Appbar）
     * - tabBarActiveTintColor: 当前被选中的 Tab 项（文字和图标）的高亮前景色
     * - tabBarInactiveTintColor: 未被选中的 Tab 项的失焦弱化前景色（灰色）
     * - tabBarStyle: 底栏最外层视图的样式对象（设置背景色、顶部细边框线、高度与内边距）
     */
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.surface, // 跟随深浅色模式自动切换底色
          borderTopColor: theme.colors.outlineVariant, // 顶部细分割线颜色
          height: 60, // 底栏总高度
          paddingBottom: 8, // 底部内边距，避让全面屏手势横条
          paddingTop: 6, // 顶部内边距
        },
      }}
    >
      {/**
       * 【Tab.Screen 标签页项 1：文章列表】
       * - name="Posts": 路由唯一标识符，代码中通过 navigation.navigate('Posts') 进行跳转
       * - component: 该路由对应的页面渲染组件（标准函数组件写法）
       * - options: 专属该屏幕的个性化配置：
       *   - tabBarLabel: 底部 Tab 上展示给用户的文字标题
       *   - tabBarIcon: 图标渲染回调函数，接收 React Navigation 动态注入的 { color, size }
       *     color 会根据当前是否选中自动匹配 activeTintColor 或 inactiveTintColor
       */}
      <Tab.Screen
        name="Posts"
        component={PostListScreen}
        options={{
          tabBarLabel: '文章列表',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="newspaper-variant-outline" // 图标名称
              size={size} // 图标大小（默认通常为 24）
              color={color} // 图标颜色（动态跟随选中/失焦状态）
            />
          ),
        }}
      />

      {/**
       * 【Tab.Screen 标签页项 2：发文章】
       */}
      <Tab.Screen
        name="Create"
        component={PostCreateScreen}
        options={{
          tabBarLabel: '发文章',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/**
       * 【Tab.Screen 标签页项 3：UI 展示大厅】
       * 特殊写法演示：当需要向目标 Screen 传递额外自定义 Props（例如父组件传递的切换主题回调）时，
       * 可以不使用 component 属性，改用 children 渲染函数返回目标组件
       */}
      <Tab.Screen
        name="Showcase"
        options={{
          tabBarLabel: 'UI 大厅',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="palette-outline"
              size={size}
              color={color}
            />
          ),
        }}
      >
        {() => (
          <ShowcaseScreen
            isDarkMode={isDarkMode}
            onToggleTheme={onToggleTheme}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
