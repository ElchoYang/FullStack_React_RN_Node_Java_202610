import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Appbar,
  Button,
  Card,
  HelperText,
  Snackbar,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { useCreatePost } from '../hooks/useCreatePost';

/**
 * 【函数式组件：PostCreateScreen】
 * 表单业务逻辑、受控输入与验证完全由自定义 Hook useCreatePost 提供
 * 组件本身保持极度纯粹，仅承载 UI 布局与用户触发事件
 */
export const PostCreateScreen: React.FC = () => {
  const theme = useTheme();

  // 1. 调用自定义表单 Hook
  const { form, loading, validation, updateField, submit } = useCreatePost();

  // 2. 局部浮层反馈状态
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  // 3. 提交包装器
  const handleFormSubmit = async () => {
    const createdPost = await submit();
    if (createdPost) {
      setSnackbar({
        visible: true,
        message: `文章创建成功！ID: ${createdPost.id}`,
      });
    } else {
      setSnackbar({
        visible: true,
        message: '提交失败，请重试',
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="发布文章 (函数式 Hook)" />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={styles.formCard} mode="elevated">
            <Card.Title
              title="新建文章表单"
              subtitle="基于函数式 Custom Hook (useCreatePost) 管理"
            />
            <Card.Content>
              {/* 标题输入 */}
              <TextInput
                label="文章标题"
                value={form.title}
                onChangeText={updateField('title')}
                mode="outlined"
                placeholder="请输入文章标题 (至少3个字)"
                error={validation.isTitleInvalid}
                left={<TextInput.Icon icon="format-title" />}
                style={styles.input}
              />
              <HelperText type="error" visible={validation.isTitleInvalid}>
                标题长度不能少于 3 个字符
              </HelperText>

              {/* 内容输入 */}
              <TextInput
                label="文章内容"
                value={form.body}
                onChangeText={updateField('body')}
                mode="outlined"
                multiline
                numberOfLines={4}
                placeholder="请输入详细文章正文内容 (至少5个字)"
                error={validation.isBodyInvalid}
                left={<TextInput.Icon icon="text-box-outline" />}
                style={styles.input}
              />
              <HelperText type="error" visible={validation.isBodyInvalid}>
                正文内容不能少于 5 个字符
              </HelperText>

              {/* 用户 ID */}
              <TextInput
                label="作者 ID (User ID)"
                value={form.userId}
                onChangeText={updateField('userId')}
                mode="outlined"
                keyboardType="numeric"
                left={<TextInput.Icon icon="account-outline" />}
                style={styles.input}
              />

              <Button
                mode="contained"
                icon="send"
                onPress={handleFormSubmit}
                loading={loading}
                disabled={!validation.canSubmit || loading}
                style={styles.submitButton}
              >
                {loading ? '正在提交...' : '立即发布'}
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar((prev) => ({ ...prev, visible: false }))}
        duration={3500}
        action={{
          label: '好的',
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formCard: {
    borderRadius: 14,
    paddingVertical: 8,
  },
  input: {
    marginBottom: 4,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 4,
    borderRadius: 10,
  },
});
