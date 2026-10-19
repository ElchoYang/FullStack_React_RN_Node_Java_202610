import { RootStackNavigator } from './RootStackNavigator';

interface AppNavigatorProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

/**
 * 【总导航出口 AppNavigator】
 * 统一渲染三层复合导航架构：
 * RootStackNavigator (Stack 栈)
 *   └── DrawerNavigator (Drawer 侧边抽屉)
 *         └── BottomTabNavigator (Tab 底部选项卡)
 *               ├── PostListScreen (文章列表)
 *               ├── PostCreateScreen (发文章)
 *               └── ShowcaseScreen (UI 大厅)
 *   └── PostDetailScreen (Stack 推入的文章详情页)
 */
export function AppNavigator(props: AppNavigatorProps) {
  return <RootStackNavigator {...props} />;
}
