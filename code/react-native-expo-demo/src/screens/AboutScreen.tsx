import React from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import {
  Appbar,
  Card,
  Text,
  List,
  Divider,
  Chip,
  useTheme,
} from 'react-native-paper';
import { useNavigation, DrawerActions } from '@react-navigation/native';

/**
 * 【页面组件：AboutScreen（关于应用页面）】
 * 演示重点：
 * 1. 作为 Drawer (抽屉) 导航中的独立项展示
 * 2. 演示通过点击按钮呼起左侧抽屉（DrawerActions.toggleDrawer()）
 * 3. 集中展示已支持的 Scheme URL 路由规则
 */
export const AboutScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        {/* 点击汉堡按钮打开侧边抽屉 */}
        <Appbar.Action
          icon="menu"
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
        <Appbar.Content title="关于应用 (Drawer 导航)" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {/* 应用介绍卡片 */}
        <Card style={styles.card} mode="elevated">
          <Card.Title
            title="React Native Expo Demo"
            subtitle="v1.0.0 企业级多层级路由架构"
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.desc}>
              本项目完整融合了移动端开发的三大经典导航模式：
              {'\n'}• 底部 Tab 导航 (BottomTabNavigator)
              {'\n'}• 侧边抽屉导航 (DrawerNavigator)
              {'\n'}• 页面堆栈导航 (NativeStackNavigator)
            </Text>
          </Card.Content>
        </Card>

        {/* 深度链接 Scheme 说明卡片 */}
        <Card style={styles.card} mode="elevated">
          <Card.Title title="🔗 深度链接 (Deep Linking) 规则" />
          <Card.Content>
            <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
              外部可通过在短信、浏览器输入以下自定义 Scheme URL 唤醒 App 直达：
            </Text>
            <View style={styles.schemeList}>
              <View style={styles.schemeItem}>
                <Chip icon="home" compact>文章列表</Chip>
                <Text variant="labelMedium" style={styles.schemeUrl}>reactnativedemo://posts</Text>
              </View>
              <View style={styles.schemeItem}>
                <Chip icon="plus" compact>发文章页</Chip>
                <Text variant="labelMedium" style={styles.schemeUrl}>reactnativedemo://create</Text>
              </View>
              <View style={styles.schemeItem}>
                <Chip icon="card-text" compact>文章详情</Chip>
                <Text variant="labelMedium" style={styles.schemeUrl}>reactnativedemo://post/1</Text>
              </View>
              <View style={styles.schemeItem}>
                <Chip icon="information" compact>关于页面</Chip>
                <Text variant="labelMedium" style={styles.schemeUrl}>reactnativedemo://about</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* 技术栈列表 */}
        <Card style={styles.card} mode="elevated">
          <Card.Title title="🛠️ 核心架构方案" />
          <Card.Content>
            <List.Item
              title="React Navigation 7"
              description="Stack + Tab + Drawer 复合嵌套"
              left={(props) => <List.Icon {...props} icon="routes" />}
            />
            <Divider />
            <List.Item
              title="React Native Paper"
              description="Material Design 3 标准组件"
              left={(props) => <List.Icon {...props} icon="palette" />}
            />
            <Divider />
            <List.Item
              title="Axios 统一网络层"
              description="全链路拦截器与类型安全"
              left={(props) => <List.Icon {...props} icon="cloud-sync" />}
            />
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 14,
    borderRadius: 14,
  },
  desc: {
    lineHeight: 22,
    color: '#555',
  },
  schemeList: {
    marginTop: 12,
    gap: 10,
  },
  schemeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  schemeUrl: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#1976D2',
  },
});
