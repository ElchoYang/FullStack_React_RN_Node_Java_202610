import React, { useState, useCallback, useMemo } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Card,
  Chip,
  Searchbar,
  Snackbar,
  Text,
  useTheme,
} from "react-native-paper";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { usePosts } from "../hooks/usePosts";
import { Post } from "../api/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * 【函数式搜索过滤纯函数 (Pure Filter Function)】
 * 给定列表与搜索词，纯函数计算过滤后的数组，无副作用、可测试性强
 */
const filterPosts = (posts: Post[], query: string): Post[] => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return posts;
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(normalized) ||
      p.body.toLowerCase().includes(normalized),
  );
};

/**
 * 【函数式组件：PostListScreen】
 * 遵循现代 React 函数式编程原则：
 * 1. 纯声明式 UI 渲染，杜绝任何类组件 (Class Component) 写法
 * 2. 状态与副作用完全下沉至自定义 Hook (usePosts)
 * 3. 页面只关注“视图渲染 (UI = f(state))” 与“用户事件派发”
 */
export const PostListScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  // 1. 调用自定义函数式 Hook，解构出响应式状态与不可变操作函数
  const { posts, loading, refreshing, error, refresh, reload, removePost } =
    usePosts(15);

  // 2. 本地 UI 交互状态
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [snackbar, setSnackbar] = useState<{
    visible: boolean;
    message: string;
  }>({
    visible: false,
    message: "",
  });

  // 3. 函数式纯记忆计算 (useMemo)
  const filteredPosts = useMemo(
    () => filterPosts(posts, searchQuery),
    [posts, searchQuery],
  );

  // 4. 函数式删除处理
  const handleDelete = useCallback(
    async (id: number) => {
      const success = await removePost(id);
      setSnackbar({
        visible: true,
        message: success ? `文章 #${id} 已成功删除` : "删除失败，请重试",
      });
    },
    [removePost],
  );

  // 5. 纯函数列表项渲染
  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <Card style={styles.card} mode="elevated">
        <Card.Title
          title={item.title}
          titleNumberOfLines={2}
          titleVariant="titleMedium"
          left={(props) => (
            <Chip {...props} compact style={styles.chip}>
              #{item.id}
            </Chip>
          )}
        />
        <Card.Content>
          <Text variant="bodyMedium" numberOfLines={3} style={styles.cardBody}>
            {item.body}
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="text"
            icon="arrow-right"
            onPress={() => navigation.navigate("PostDetail", { postId: item.id })}
          >
            详情 (Stack)
          </Button>
          <Button
            textColor={theme.colors.error}
            icon="delete-outline"
            onPress={() => handleDelete(item.id)}
          >
            删除
          </Button>
        </Card.Actions>
      </Card>
    ),
    [theme.colors.error, handleDelete],
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View>
        <Text
          style={[
            { backgroundColor: "red", color: "#fff", padding: 5, margin: 5 },
          ]}
        >
          ceshi 1
        </Text>
        <Text
          style={[
            { backgroundColor: "blue", color: "#fff", padding: 5, margin: 5 },
          ]}
        >
          ceshi 2
        </Text>
      </View>

      {/* 顶部应用栏 */}
      <Appbar.Header elevated>
        {/* 左侧抽屉菜单按钮 */}
        <Appbar.Action
          icon="menu"
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
        <Appbar.Content title="文章列表 (函数式 + Paper)" />
        <Appbar.Action icon="reload" onPress={() => refresh()} />
      </Appbar.Header>

      {/* 搜索栏 */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="搜索文章标题或内容..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          elevation={1}
        />
      </View>

      {/* 状态分支渲染 */}
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator
            animating
            size="large"
            color={theme.colors.primary}
          />
          <Text style={styles.loadingText}>
            正在通过 Axios 函数式 Hook 加载数据...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text variant="titleMedium" style={{ color: theme.colors.error }}>
            {error}
          </Text>
          <Button
            mode="contained"
            onPress={() => reload()}
            style={styles.retryButton}
          >
            重试
          </Button>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text variant="bodyLarge">未找到相关文章</Text>
            </View>
          }
        />
      )}

      {/* 底部反馈 */}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar((prev) => ({ ...prev, visible: false }))}
        duration={3000}
        action={{
          label: "确定",
          onPress: () => setSnackbar((prev) => ({ ...prev, visible: false })),
        }}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchbar: {
    borderRadius: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    marginVertical: 6,
    borderRadius: 14,
  },
  chip: {
    marginRight: 8,
  },
  cardBody: {
    color: "#666",
    lineHeight: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
  },
  retryButton: {
    marginTop: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
});
