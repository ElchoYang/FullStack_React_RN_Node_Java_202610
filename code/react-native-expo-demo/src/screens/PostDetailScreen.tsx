import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Appbar,
  Card,
  Text,
  ActivityIndicator,
  Button,
  Chip,
  useTheme,
} from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { postApi } from '../api/postApi';
import { Post } from '../api/types';

type PostDetailRouteProp = RouteProp<RootStackParamList, 'PostDetail'>;

/**
 * 【页面组件：PostDetailScreen（文章详情页）】
 * 核心演示点：
 * 1. Stack 导航器推入展示（从右向左推入动画）
 * 2. 接收上一页传递的路由参数（route.params.postId）
 * 3. 支持深度链接（Scheme）直接唤醒直达：reactnativedemo://post/123
 */
export const PostDetailScreen = () => {
  const theme = useTheme();
  const route = useRoute<PostDetailRouteProp>();
  const navigation = useNavigation();

  // 提取路由传递过来的 postId
  const { postId } = route.params;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 根据 ID 获取详情数据
  const loadDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postApi.getPostById(postId);
      setPost(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '获取详情失败';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* 顶部应用栏：带返回上一级箭头 */}
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`文章详情 #${postId}`} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Scheme 深度链接提示卡片 */}
        <Card style={styles.schemeCard} mode="outlined">
          <Card.Content>
            <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
              🔗 Scheme 深度链接唤起演示
            </Text>
            <Text variant="bodySmall" style={styles.schemeText}>
              本页面支持直接通过 Scheme URL 在手机外部唤起：
            </Text>
            <Chip icon="link-variant" style={styles.chip}>
              reactnativedemo://post/{postId}
            </Chip>
          </Card.Content>
        </Card>

        {/* 详情主体 */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>正在加载详情数据...</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={{ color: theme.colors.error }}>{error}</Text>
            <Button mode="contained" onPress={loadDetail} style={styles.retryBtn}>
              重试
            </Button>
          </View>
        ) : post ? (
          <Card style={styles.card} mode="elevated">
            <Card.Title
              title={post.title}
              titleNumberOfLines={3}
              titleVariant="titleLarge"
              subtitle={`作者 User ID: ${post.userId}`}
            />
            <Card.Content>
              <Text variant="bodyLarge" style={styles.bodyText}>
                {post.body}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button icon="arrow-left" onPress={() => navigation.goBack()}>
                返回上一页
              </Button>
            </Card.Actions>
          </Card>
        ) : null}
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
  },
  schemeCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  schemeText: {
    marginTop: 4,
    marginBottom: 8,
    color: '#666',
  },
  chip: {
    alignSelf: 'flex-start',
  },
  card: {
    borderRadius: 14,
  },
  bodyText: {
    lineHeight: 24,
    color: '#444',
    marginTop: 8,
  },
  center: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  retryBtn: {
    marginTop: 16,
  },
});
