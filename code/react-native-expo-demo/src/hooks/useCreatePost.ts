import { useState, useCallback } from 'react';
import { postApi } from '../api/postApi';
import { CreatePostPayload, Post } from '../api/types';

interface FormState {
  title: string;
  body: string;
  userId: string;
}

const INITIAL_STATE: FormState = {
  title: '',
  body: '',
  userId: '1',
};

/**
 * 【函数式纯验证函数 (Pure Validation Functions)】
 * 纯函数特性：相同的输入必然得到相同的输出，无任何外界副作用
 */
export const validatePostForm = (form: FormState) => {
  const isTitleInvalid = form.title.length > 0 && form.title.trim().length < 3;
  const isBodyInvalid = form.body.length > 0 && form.body.trim().length < 5;
  const canSubmit = form.title.trim().length >= 3 && form.body.trim().length >= 5;

  return {
    isTitleInvalid,
    isBodyInvalid,
    canSubmit,
  };
};

/**
 * 【函数式自定义 Hook: useCreatePost】
 * 封装表单状态、输入变动、纯校验与异步提交逻辑
 */
export const useCreatePost = () => {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [loading, setLoading] = useState<boolean>(false);

  // 函数式字段更新器：高阶函数生成器
  const updateField = useCallback((field: keyof FormState) => (value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // 重置表单为初始不可变状态
  const resetForm = useCallback(() => {
    setForm(INITIAL_STATE);
  }, []);

  // 计算当前的纯校验结果
  const validation = validatePostForm(form);

  // 提交表单处理函数
  const submit = useCallback(async (): Promise<Post | null> => {
    if (!validation.canSubmit || loading) return null;

    try {
      setLoading(true);
      const payload: CreatePostPayload = {
        title: form.title.trim(),
        body: form.body.trim(),
        userId: parseInt(form.userId, 10) || 1,
      };

      const result = await postApi.createPost(payload);
      resetForm();
      return result;
    } finally {
      setLoading(false);
    }
  }, [form, validation.canSubmit, loading, resetForm]);

  return {
    form,
    loading,
    validation,
    updateField,
    resetForm,
    submit,
  };
};
