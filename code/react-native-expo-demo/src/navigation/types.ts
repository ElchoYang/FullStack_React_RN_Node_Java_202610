import { NavigatorScreenParams } from '@react-navigation/native';

/**
 * 1. 底部 Tab 导航参数列表
 */
export type BottomTabParamList = {
  Posts: undefined;
  Create: undefined;
  Showcase: undefined;
};

/**
 * 2. 侧边抽屉 (Drawer) 导航参数列表
 */
export type MainDrawerParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>; // 嵌套了底部 Tab 导航
  About: undefined; // "关于应用" 抽屉页
};

/**
 * 3. 根栈 (Root Stack) 导航参数列表
 */
export type RootStackParamList = {
  DrawerRoot: NavigatorScreenParams<MainDrawerParamList>; // 嵌套了侧边抽屉导航
  PostDetail: { postId: number }; // 栈推入的详情页，携带 postId 参数
};
