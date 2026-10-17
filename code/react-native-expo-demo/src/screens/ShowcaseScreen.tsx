import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Appbar,           // 【Paper】顶部应用栏
  Badge,            // 【Paper】角标/红点组件（可用于未读消息、数量计数）
  Button,           // 【Paper】按钮组件
  Card,             // 【Paper】卡片
  Chip,             // 【Paper】标签/药丸组件
  Dialog,           // 【Paper】对话框模态窗口（Material Design 3 标准弹窗）
  Divider,          // 【Paper】细分隔线组件
  List,             // 【Paper】列表项组件（提供规范的左图标、标题、副标题、右控件排版）
  Portal,           // 【Paper 传送门组件】用于将弹窗（Dialog/Menu）渲染到顶层根节点，脱离局部组件的 zIndex 堆叠层级
  SegmentedButtons, // 【Paper】分段选择器（类似于单选 Radio 或 iOS 分段控件）
  Switch,           // 【Paper】开关切换器（原生触控微动效）
  Text,             // 【Paper】排版文本
  useTheme,         // 【Paper Hook】获取当前主题
} from 'react-native-paper';

interface ShowcaseScreenProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const ShowcaseScreen: React.FC<ShowcaseScreenProps> = ({
  isDarkMode,
  onToggleTheme,
}) => {
  const theme = useTheme();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [segmentedValue, setSegmentedValue] = useState('daily');
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Paper UI 组件大厅" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/**
         * 【卡片 1：主题与模式切换】
         */}
        <Card style={styles.card} mode="elevated">
          <Card.Title title="🎨 主题与模式" subtitle="Material Design 3 动态色彩" />
          <Card.Content>
            <View style={styles.rowBetween}>
              <View>
                <Text variant="titleMedium">深色模式 (Dark Theme)</Text>
                {/* 使用 theme.colors.outline 获取柔和的副文本灰色 */}
                <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                  当前: {isDarkMode ? '开启 (Dark)' : '关闭 (Light)'}
                </Text>
              </View>
              {/**
               * 【Switch 开关】
               * - value: 当前是否开启的布尔值
               * - onValueChange: 状态改变触发回调
               */}
              <Switch value={isDarkMode} onValueChange={onToggleTheme} />
            </View>
          </Card.Content>
        </Card>

        {/**
         * 【卡片 2：分段选择器与徽标】
         */}
        <Card style={styles.card} mode="elevated">
          <Card.Title title="🔘 分段选择器 (SegmentedButtons)" />
          <Card.Content>
            {/**
             * 【SegmentedButtons 分段单选组件】
             * - value: 当前选中的选项值
             * - onValueChange: 切换选项后的回调
             * - buttons: 选项配置数组，每个对象包含 value, label, icon
             */}
            <SegmentedButtons
              value={segmentedValue}
              onValueChange={setSegmentedValue}
              buttons={[
                { value: 'daily', label: '日榜', icon: 'calendar-today' },
                { value: 'weekly', label: '周榜', icon: 'calendar-week' },
                { value: 'monthly', label: '月榜', icon: 'calendar-month' },
              ]}
              style={styles.segmented}
            />
            <View style={styles.badgeRow}>
              <Text variant="bodyMedium">选中视图: {segmentedValue}</Text>
              {/**
               * 【Badge 角标】
               * - size: 徽标大小（直径像素）
               */}
              <Badge size={24} style={{ backgroundColor: theme.colors.primary }}>
                99+
              </Badge>
            </View>
          </Card.Content>
        </Card>

        {/**
         * 【卡片 3：按钮预设样式展示】
         */}
        <Card style={styles.card} mode="elevated">
          <Card.Title title="👆 按钮体系 (Buttons)" subtitle="多种 Material 风格" />
          <Card.Content>
            <View style={styles.buttonGrid}>
              {/* contained: 实心填充 */}
              <Button mode="contained" icon="check" style={styles.btn}>
                Contained
              </Button>
              {/* elevated: 带背景阴影浮起 */}
              <Button mode="elevated" icon="star" style={styles.btn}>
                Elevated
              </Button>
              {/* outlined: 细线框边框 */}
              <Button mode="outlined" icon="pencil" style={styles.btn}>
                Outlined
              </Button>
              {/* text: 纯文本按钮 */}
              <Button mode="text" icon="arrow-right" style={styles.btn}>
                Text Button
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/**
         * 【卡片 4：标签与 Chip】
         */}
        <Card style={styles.card} mode="elevated">
          <Card.Title title="🏷️ 标签与徽章 (Chips)" />
          <Card.Content>
            <View style={styles.chipRow}>
              {/* selected: 选中高亮状态 */}
              <Chip icon="react" style={styles.chip} selected>
                React Native
              </Chip>
              <Chip icon="application" style={styles.chip}>
                Expo SDK 57
              </Chip>
              <Chip icon="palette" style={styles.chip}>
                MD3 Paper
              </Chip>
              <Chip icon="cloud-sync" style={styles.chip}>
                Axios
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/**
         * 【卡片 5：列表项与操作弹窗】
         */}
        <Card style={styles.card} mode="elevated">
          <Card.Title title="💬 交互弹窗与列表项" />
          <Card.Content>
            {/**
             * 【List.Item 列表单元项】
             * - title: 主标题
             * - description: 描述副标题
             * - left: 左侧渲染插槽（常用于图标）
             * - right: 右侧渲染插槽（常用于 Switch、Chevron 箭头）
             */}
            <List.Item
              title="推送通知设置"
              description="启用或禁用应用内系统通知"
              left={(props) => <List.Icon {...props} icon="bell-ring-outline" />}
              right={() => (
                <Switch
                  value={notificationEnabled}
                  onValueChange={setNotificationEnabled}
                />
              )}
            />
            {/* Divider: 列表分割横线 */}
            <Divider style={styles.divider} />
            <List.Item
              title="确认操作对话框"
              description="点击唤起 Material Design 标准 Dialog"
              left={(props) => <List.Icon {...props} icon="alert-circle-outline" />}
              onPress={() => setDialogVisible(true)}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/**
       * 【Portal 传送门组件】
       * 核心学习点：React Native 中如果直接在父组件中嵌套弹窗，可能会受到父组件 overflow:hidden
       * 或者 zIndex 的限制。PaperProvider 在顶层注入了 Portal 上下文，
       * 被 <Portal> 包裹的内容会在最外层全屏层级渲染。
       */}
      <Portal>
        {/**
         * 【Dialog 对话框】
         * - visible: 弹窗显隐控制
         * - onDismiss: 点击遮罩层空白处或按物理返回键时的关闭回调
         */}
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>系统确认提示</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              这是基于 React Native Paper Portal 渲染的 Material Design 对话框，
              具备完整的蒙层点击遮罩及无障碍访问支持。
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>取消</Button>
            <Button mode="contained" onPress={() => setDialogVisible(false)}>
              确定
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 14,
    borderRadius: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  segmented: {
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  btn: {
    flexGrow: 1,
    minWidth: '45%',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginVertical: 4,
  },
  divider: {
    marginVertical: 6,
  },
});
