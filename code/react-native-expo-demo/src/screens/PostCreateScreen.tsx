import { useState, useMemo } from 'react';
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
// 【React Hook Form 核心】useForm 驱动表单，Controller 用于桥接 React Native 原生输入框
import { useForm, Controller } from 'react-hook-form';
// 【Zod 模式校验器】声明式数据校验规范
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// 【i18next 国际化 Hook】
import { useTranslation } from 'react-i18next';
import { postApi } from '../api/postApi';

/**
 * 动态根据当前语言生成 Zod Schema 工厂函数
 */
const createPostSchema = (t: (key: string) => string) =>
  z.object({
    title: z
      .string()
      .min(1, t('createPost.errors.titleRequired'))
      .min(3, t('createPost.errors.titleMin'))
      .max(50, t('createPost.errors.titleMax')),
    body: z
      .string()
      .min(1, t('createPost.errors.bodyRequired'))
      .min(5, t('createPost.errors.bodyMin')),
    userId: z
      .string()
      .min(1, t('createPost.errors.userIdRequired'))
      .regex(/^\d+$/, t('createPost.errors.userIdNumber')),
  });

// 表单数据类型定义
interface PostFormData {
  title: string;
  body: string;
  userId: string;
}

/**
 * 【页面组件：PostCreateScreen】
 * 融合：react-hook-form + zod + react-i18next 国际化中英文
 */
export function PostCreateScreen() {
  const theme = useTheme();
  // 1. 获取 i18n 翻译函数 t 和当前语言实例
  const { t } = useTranslation();

  // 2. 根据当前语言动态生成 Zod 校验 Schema
  const postSchema = useMemo(() => createPostSchema(t), [t]);

  // 3. 初始化 react-hook-form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      body: '',
      userId: '1',
    },
    mode: 'onBlur',
  });

  // 提示信息状态
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  /**
   * 【表单提交处理函数】
   */
  const onSubmit = async (data: PostFormData) => {
    try {
      const createdPost = await postApi.createPost({
        title: data.title.trim(),
        body: data.body.trim(),
        userId: parseInt(data.userId, 10),
      });

      setSnackbar({
        visible: true,
        message: t('createPost.successMessage', { id: createdPost.id }),
      });

      // 成功后重置表单
      reset();
    } catch {
      setSnackbar({
        visible: true,
        message: t('createPost.failMessage'),
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title={t('createPost.appbarTitle')} />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={styles.formCard} mode="elevated">
            <Card.Title
              title={t('createPost.title')}
              subtitle={t('createPost.subtitle')}
            />
            <Card.Content>
              {/**
               * 【文章标题输入框】
               */}
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      label={t('createPost.titleLabel')}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      mode="outlined"
                      placeholder={t('createPost.titlePlaceholder')}
                      error={!!errors.title}
                      left={<TextInput.Icon icon="format-title" />}
                      style={styles.input}
                    />
                    <HelperText type="error" visible={!!errors.title}>
                      {errors.title?.message}
                    </HelperText>
                  </>
                )}
              />

              {/**
               * 【文章正文输入框】
               */}
              <Controller
                control={control}
                name="body"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      label={t('createPost.bodyLabel')}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      mode="outlined"
                      multiline
                      numberOfLines={4}
                      placeholder={t('createPost.bodyPlaceholder')}
                      error={!!errors.body}
                      left={<TextInput.Icon icon="text-box-outline" />}
                      style={styles.input}
                    />
                    <HelperText type="error" visible={!!errors.body}>
                      {errors.body?.message}
                    </HelperText>
                  </>
                )}
              />

              {/**
               * 【作者 ID 输入框】
               */}
              <Controller
                control={control}
                name="userId"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      label={t('createPost.userIdLabel')}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      mode="outlined"
                      keyboardType="numeric"
                      error={!!errors.userId}
                      left={<TextInput.Icon icon="account-outline" />}
                      style={styles.input}
                    />
                    <HelperText type="error" visible={!!errors.userId}>
                      {errors.userId?.message}
                    </HelperText>
                  </>
                )}
              />

              {/**
               * 【提交按钮】
               */}
              <Button
                mode="contained"
                icon="send"
                onPress={handleSubmit(onSubmit)}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={styles.submitButton}
              >
                {isSubmitting ? t('common.submitting') : t('common.submit')}
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
          label: t('common.confirm'),
          onPress: () => setSnackbar((prev) => ({ ...prev, visible: false })),
        }}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}

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
