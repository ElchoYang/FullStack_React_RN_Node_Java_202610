# React Native Week 3：跨端移动应用开发与企业级 Demo 实战指南

本指南严格基于 **[CPA_FSD_Reskill_5_Week_Learning_Plan.xlsx](CPA_FSD_Reskill_5_Week_Learning_Plan.xlsx)** 第 3 周规划制定，与前期沉淀的 `WEEK1_REACT_CRUD_GUIDE.md` 及 `WEEK2_REACT_ADVANCED_GUIDE.md` 保持完全一致的工业级标准与规范演进节奏。

Week 3 的核心学习方向为 **React Native (移动跨端应用开发)**，旨在帮助开发人员将 Week 1/2 积累的 React Web、TypeScript、Hooks、路由及 API 集成经验平滑迁移至移动端，掌握 **RN 原生渲染底座、Expo 现代工具链、Flexbox 移动布局、移动路由导航系统、移动端网络与鉴权持久化**，最终独立交付一个**端到端功能完整、符合生产级体验的移动端应用 (React Native Demo)**。

---

## 目录
1. [Week 3 学习目标与核心交付物](#1-week-3-学习目标与核心交付物)
2. [Week 3 任务清单与工时拆解 (37h)](#2-week-3-任务清单与工时拆解-37h)
3. [技术栈选型与工业级优势](#3-技术栈选型与工业级优势)
4. [项目初始化与依赖安装指南](#4-项目初始化与依赖安装指南)
5. [移动端工程目录规范与架构分层](#5-移动端工程目录规范与架构分层)
6. [核心知识点与企业级代码骨架](#6-核心知识点与企业级代码骨架)
   - 6.1 [RN 原生渲染 vs React Web (架构差异与思维转换)](#61-rn-原生渲染-vs-react-web-架构差异与思维转换)
   - 6.2 [移动端核心组件与样式布局 (Flexbox、Paper MD3、安全区)](#62-移动端核心组件与样式布局-flexboxpaper-md3安全区)
   - 6.3 [移动端导航体系 (React Navigation 7 底部标签栏与栈路由)](#63-移动端导航体系-react-navigation-7-底部标签栏与栈路由)
   - 6.4 [Axios 移动端网络层封装与 REST API 集成](#64-axios-移动端网络层封装与-rest-api-集成)
   - 6.5 [移动端表单交互与输入校验](#65-移动端表单交互与输入校验)
   - 6.6 [移动端登录鉴权与状态流转](#66-移动端登录鉴权与状态流转)
   - 6.7 [调试体系与跨端测试构建 (Web / Android / iOS)](#67-调试体系与跨端测试构建-web--android--ios)
7. [Week 3 交付项目 (React Native Demo) 验收流程](#7-week-3-交付项目-react-native-demo-验收流程)
8. [Week 3 能力达标自测清单 (Capability Checklist)](#8-week-3-能力达标自测清单-capability-checklist)

---

## 1. Week 3 学习目标与核心交付物

- **学习主题**：React Native 跨端移动应用开发
- **预估总工时**：**37 小时**
- **核心能力基准 (Excel Checklist)**：
  - `Can create screens, navigation and API integration`（具备独立构建移动端页面、多级路由导航及后端 REST API 网络集成的端到端能力）
- **核心交付物**：**企业级移动端演示应用 (React Native Demo)**
  - 基于 **Expo SDK + TypeScript + React Native Paper (MD3)** 现代技术底座；
  - 具备 **React Navigation 7** 底部选项卡 (`Bottom Tab`) 与安全区精准自适应；
  - 具备真实的 **RESTful API 交互**：文章/业务列表展示、下拉刷新 (`Pull-to-refresh`)、本地搜索过滤、表单校验发布与状态持久反馈；
  - 具备移动端专属交互体验：软键盘规避 (`KeyboardAvoidingView`)、全面屏手势条防穿透、组件大厅与主题切换 (Light/Dark Mode)。

---

## 2. Week 3 任务清单与工时拆解 (37h)

根据 Excel 计划表，本周共划分为 11 个递进式任务单元，总计 37 小时：

| 序号 | 任务名称 (Task) | 优先级 | 预估工时 | 里程碑交付成果 (Deliverable) | 关键核心内容 |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | **React Native 架构解析**<br>*(React Native architecture)* | High | 2h | Understand RN vs React Web | 深入理解虚拟 DOM 到原生视图桥接 (Fabric / JSI 机制)，对比 Web DOM 树与 Native 组件映射关系 |
| **2** | **Expo 环境搭建与工程初始化**<br>*(Environment setup with Expo)* | High | 3h | Run first mobile application | 掌握 Expo Managed Workflow 体系，配置 Node.js、Expo CLI、模拟器/真机调试环境 |
| **3** | **移动端核心组件精通**<br>*(Core components)* | High | 3h | View, Text, Image, ScrollView, FlatList | 掌握 `View`、`Text`、`Image`、高性能滚动长列表 `FlatList` 及下拉刷新机制 |
| **4** | **移动端样式与响应式布局**<br>*(Styling and layouts)* | High | 3h | Flexbox and responsive mobile layouts | 移动端专用 `StyleSheet`、Flexbox 弹性盒（默认列主轴 `column`）、全面屏安全区适配 |
| **5** | **移动路由导航系统**<br>*(Navigation)* | High | 4h | Stack/tab navigation | 熟练使用 React Navigation 构建 Stack 堆栈导航与 Bottom Tabs 底部标签栏 |
| **6** | **移动端状态管理与 Hooks 复用**<br>*(State and Hooks)* | High | 3h | Apply React knowledge to RN | 复用 React 18/19 状态经验：`useState`、`useEffect`、`useMemo`、`useCallback` 与自定义 Hook |
| **7** | **REST API 网络集成**<br>*(REST API integration)* | High | 4h | Connect mobile app to API | 基于 Axios 封装移动端请求客户端、超时控制、网络错误转换与数据请求状态管理 |
| **8** | **移动表单设计与数据校验**<br>*(Forms and validation)* | Medium | 3h | Mobile input and validation | 软键盘弹出适配、输入聚焦、失焦校验、Paper 输入框与 HelperText 异常高亮 |
| **9** | **移动端身份认证全流程**<br>*(Authentication)* | High | 3h | Mobile login flow | 移动端 Login 流程、Token 缓存策略、未鉴权路由拦截与全局用户信息同步 |
| **10** | **调试技巧与测试构建**<br>*(Debugging and build)* | Medium | 3h | Debug and produce test build | Chrome DevTools / Expo Go 实时调试、网络抓包定位、多平台 (Web/Android/iOS) 预览与构建打包机制 |
| **11** | **综合交付：React Native Demo**<br>*(Mobile mini project)* | High | 6h | React Native Demo 完整落地 | 端到端整合 UI、列表、表单、网络请求与主题系统，完成代码评审与运行验收 |

---

## 3. 技术栈选型与工业级优势

为确保代码具有生产级生命力并避免踩入底层原生配置泥潭，技术栈采用业界公认的工业级黄金组合：

| 架构层级 | 选型技术 | 版本 / 标准 | 选型原因与工业优势 |
| :--- | :--- | :--- | :--- |
| **跨端底座** | **Expo SDK (Managed)** | SDK ~57 (RN 0.86, React 19) | 官方推荐开发模式，彻底屏蔽 Android Gradle 与 iOS CocoaPods 原生配置复杂性，支持 Web/iOS/Android 三端一致体验与 OTA 热更新能力 |
| **开发语言** | **TypeScript** | Strict Mode | 全链路强类型约束，从 API 请求参数、响应泛型，到组件 Props 和主题变量，全部提供精确类型推导与编译期保障 |
| **UI 组件库** | **React Native Paper** | Material Design 3 (MD3) | 移动端最成熟且活跃度极高的组件库，内置按钮、卡片、表单输入、弹窗、徽标、底栏、无障碍与深色模式，免除手动编写易碎底层 CSS |
| **路由导航** | **React Navigation 7** | Bottom Tabs + Screens | 移动端标准导航体系，依赖 `react-native-screens` 原生屏幕驱动保障丝滑流畅性能 |
| **网络通信** | **Axios** | 最新稳定版 | 成熟的 Promise HTTP 客户端，具备请求拦截、响应拦截、超时控制及与后端 RESTful API 解耦设计 |
| **安全区适配** | **react-native-safe-area-context** | 官方推荐标准 | 精准计算刘海屏、灵动岛、底部手势条（Home Indicator）的安全间距，杜绝元素贴边与穿透遮挡 |
| **三端运行支持** | **react-native-web** | 官方生态套件 | 支持在没有实体手机和重型模拟器的情况下，直接通过浏览器进行高保真调试与业务验证 |

---

## 4. 项目初始化与依赖安装指南

### 4.1 新工程初始化（全新构建）
在工程目录（如 `code/`）下执行以下标准步骤：

```bash
# 1. 使用 Expo 官方脚手架初始化 TypeScript 模板
npx create-expo-app@latest react-native-demo --template blank-typescript

# 2. 进入项目目录
cd react-native-demo
```

### 4.2 工业级依赖包精细化安装
> 💡 **重要实践**：在 Expo 工程中，优先使用 `npx expo install` 代替原生 `npm install`。`expo install` 会自动校验并锁定与当前 Expo SDK 版本严格兼容的原生驱动版本，彻底避免 peerDependencies 冲突。

```bash
# 步骤 1：安装 UI 框架 (Paper)、安全区驱动、图标库与网络库
npx expo install react-native-paper react-native-safe-area-context @expo/vector-icons axios

# 步骤 2：安装 React Navigation 导航核心与底层屏幕驱动
npx expo install @react-navigation/native @react-navigation/bottom-tabs react-native-screens

# 步骤 3：安装 Web 端调试适配包（保证浏览器一键调试）
npx expo install react-dom react-native-web @expo/metro-runtime
```

### 4.3 现有工程安装与启动
如果已存在项目代码（如当前工作区的 `code/react-native-demo/`），直接执行：

```bash
# 进入工程目录
cd code/react-native-demo

# 安装全部依赖
npm install

# 启动 Web 端调试（免手机/免模拟器，秒级验证）
npm run web

# 或启动 Metro 捆绑器多端服务
npm run start
```

---

## 5. 移动端工程目录规范与架构分层

标准移动端工程遵循**职责单一、分层清晰、高内聚低耦合**的架构规范：

```text
code/react-native-demo/
├── assets/                     # 静态媒体资源（应用图标、启动屏图）
├── src/
│   ├── api/                    # 【网络数据层】
│   │   ├── client.ts           # Axios 实例：BaseURL、超时、拦截器、错误包装
│   │   ├── postApi.ts          # 业务 REST 接口封装 (getPosts, createPost, deletePost)
│   │   └── types.ts            # API 请求 Payload 与响应实体 TypeScript 类型定义
│   ├── theme/                  # 【设计与主题系统】
│   │   └── index.ts            # React Native Paper MD3 浅色 / 深色定制主题
│   ├── screens/                # 【屏幕页面层】
│   │   ├── PostListScreen.tsx  # 文章列表页：FlatList 下拉刷新、搜索过滤、Paper Card
│   │   ├── PostCreateScreen.tsx# 发布页面：Paper Outlined 输入框、表单校验、提交
│   │   └── ShowcaseScreen.tsx  # 组件展示大厅：SegmentedButtons、Dialog、深色模式
│   └── navigation/             # 【路由导航配置】
│       └── AppNavigator.tsx    # 底部选项卡导航 (Bottom Tab Navigator) 与图标映射
├── App.tsx                     # 根入口：集成 SafeAreaProvider, PaperProvider, NavigationContainer
├── app.json                    # Expo 工程元数据与平台配置
├── package.json                # 依赖清单与启动脚本
└── tsconfig.json               # TypeScript 严格配置
```

---

## 6. 核心知识点与企业级代码骨架

### 6.1 RN 原生渲染 vs React Web (架构差异与思维转换)

| 维度 | React Web | React Native | 迁移注意事项 |
| :--- | :--- | :--- | :--- |
| **渲染目标** | 浏览器 DOM 节点 (`<div>`, `<span>`, `<p>`) | 操作系统原生控件 (iOS `UIView`, Android `ViewGroup`) | **不能使用任何 HTML 标签**，必须使用 RN 组件 |
| **文本渲染** | 文本可直接裸写在 `<div>` 内 | 任何文本**必须严格包裹在 `<Text>` 组件内** | 裸写字符串会在原生端直接抛出崩溃红屏 |
| **样式机制** | CSS 文件、SCSS、Tailwind、BEM 规范 | JS 驱动的 `StyleSheet.create` 对象样式 | 不支持级联选择器、`hover` 等 Web 伪类；无浏览器盒模型 |
| **布局模式** | `display: block / inline / flex` (默认水平) | **仅支持 Flexbox**，且默认主轴为**纵向 (`flexDirection: 'column'`)** | 容器必须显式声明 `flex: 1` 才能铺满屏幕 |
| **交互事件** | `onClick`, `onMouseEnter`, `onKeyDown` | `onPress`, `onLongPress`, 手势响应器 | 交互元素需使用 `Pressable`、`TouchableOpacity` 或 Paper `Button` |

---

### 6.2 移动端核心组件与样式布局 (Flexbox、Paper MD3、安全区)

#### 1. 根组件容器装配 (`App.tsx`)
```tsx
import { useState, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { lightTheme, darkTheme } from './src/theme';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 1. 动态生成 UI 组件库主题 (MD3)
  const paperTheme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  // 2. 动态同步 React Navigation 导航背景与主色调
  const navTheme = useMemo(() => {
    const base = isDarkMode ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: paperTheme.colors.primary,
        background: paperTheme.colors.background,
        card: paperTheme.colors.surface,
        text: paperTheme.colors.onSurface,
        border: paperTheme.colors.outlineVariant,
      },
    };
  }, [isDarkMode, paperTheme]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer theme={navTheme}>
          <AppNavigator isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
```

#### 2. 主题与调色板定义 (`src/theme/index.ts`)
```typescript
import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';

// 浅色主题
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1976D2',
    secondary: '#00796B',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    error: '#D32F2F',
  },
};

// 深色主题
export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#90CAF9',
    secondary: '#80CBC4',
    background: '#121212',
    surface: '#1E1E1E',
    error: '#EF5350',
  },
};
```

---

### 6.3 移动端导航体系 (React Navigation 7 底部标签栏与栈路由)

#### 底部导航与图标映射 (`src/navigation/AppNavigator.tsx`)
```tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { PostListScreen } from '../screens/PostListScreen';
import { PostCreateScreen } from '../screens/PostCreateScreen';
import { ShowcaseScreen } from '../screens/ShowcaseScreen';

export type RootTabParamList = {
  Posts: undefined;
  Create: undefined;
  Showcase: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

interface AppNavigatorProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ isDarkMode, onToggleTheme }) => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onSurface,
        tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outlineVariant },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'cube-outline';
          if (route.name === 'Posts') iconName = focused ? 'file-tray-full' : 'file-tray-full-outline';
          else if (route.name === 'Create') iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === 'Showcase') iconName = focused ? 'color-palette' : 'color-palette-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Posts" component={PostListScreen} options={{ title: '文章列表' }} />
      <Tab.Screen name="Create" component={PostCreateScreen} options={{ title: '发布内容' }} />
      <Tab.Screen
        name="Showcase"
        children={() => <ShowcaseScreen isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />}
        options={{ title: '组件大厅' }}
      />
    </Tab.Navigator>
  );
};
```

---

### 6.4 Axios 移动端网络层封装与 REST API 集成

#### 1. 移动端 Axios 基础客户端 (`src/api/client.ts`)
```typescript
import axios, { AxiosError } from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // 演示用公开标准 RESTful 服务
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 移动端 Token 挂载示例：
    // const token = await AsyncStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：统一网络异常与业务错误分流
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let friendlyMessage = '网络请求失败，请稍后重试';
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      friendlyMessage = '请求超时，请检查网络连接状态';
    } else if (error.response) {
      switch (error.response.status) {
        case 400: friendlyMessage = '请求参数错误 (400)'; break;
        case 401: friendlyMessage = '身份凭证失效，请重新登录 (401)'; break;
        case 404: friendlyMessage = '请求的服务资源不存在 (404)'; break;
        case 500: friendlyMessage = '服务端异常，请稍后重试 (500)'; break;
      }
    }
    return Promise.reject(new Error(friendlyMessage));
  }
);
```

#### 2. 高性能长列表与下拉刷新展示 (`src/screens/PostListScreen.tsx`)
```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Card, Text, Searchbar, ActivityIndicator, HelperText, useTheme } from 'react-native-paper';
import { postApi } from '../api/postApi';
import { Post } from '../api/types';

export const PostListScreen: React.FC = () => {
  const theme = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      const data = await postApi.getPosts();
      setPosts(data.slice(0, 15)); // 取前 15 条
    } catch (err: any) {
      setError(err.message || '获取列表失败');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const filteredPosts = posts.filter(
    (p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="搜索文章标题或内容..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchbar}
      />
      {error && <HelperText type="error" visible={true}>{error}</HelperText>}
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" /></View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card style={styles.card} mode="elevated">
              <Card.Title title={item.title} titleNumberOfLines={1} />
              <Card.Content>
                <Text variant="bodyMedium" numberOfLines={2}>{item.body}</Text>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchbar: { margin: 12 },
  listContent: { paddingHorizontal: 12, paddingBottom: 24 },
  card: { marginBottom: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
```

---

### 6.5 移动端表单交互与输入校验

#### 移动发布表单 (`src/screens/PostCreateScreen.tsx`)
```tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, HelperText, Snackbar, useTheme } from 'react-native-paper';
import { postApi } from '../api/postApi';

export const PostCreateScreen: React.FC = () => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hasTitleError = title.trim().length > 0 && title.trim().length < 3;
  const hasBodyError = body.trim().length > 0 && body.trim().length < 5;

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim() || hasTitleError || hasBodyError) {
      setErrorMessage('请完整填写符合要求的标题与内容');
      return;
    }
    try {
      setSubmitting(true);
      await postApi.createPost({ title, body, userId: 1 });
      setShowToast(true);
      setTitle('');
      setBody('');
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || '发布提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          label="文章标题 (至少3个字符)"
          mode="outlined"
          value={title}
          onChangeText={setTitle}
          error={hasTitleError}
          style={styles.input}
        />
        {hasTitleError && <HelperText type="error">标题长度必须大于等于 3 个字符</HelperText>}

        <TextInput
          label="正文内容 (至少5个字符)"
          mode="outlined"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={4}
          error={hasBodyError}
          style={styles.input}
        />
        {hasBodyError && <HelperText type="error">内容长度必须大于等于 5 个字符</HelperText>}

        {errorMessage ? <HelperText type="error" visible>{errorMessage}</HelperText> : null}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting || !title || !body || hasTitleError || hasBodyError}
          style={styles.button}
        >
          立即发布
        </Button>

        <Snackbar visible={showToast} onDismiss={() => setShowToast(false)} duration={3000}>
          🎉 文章创建成功！
        </Snackbar>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { marginBottom: 8 },
  button: { marginTop: 16 },
});
```

---

### 6.6 移动端登录鉴权与状态流转

在移动开发中，登录鉴权具备三大核心特征：
1. **持久化介质**：Web 端使用 `localStorage`；RN 推荐使用 `@react-native-async-storage/async-storage` 或 Expo `SecureStore`（敏感数据加密）。
2. **路由流转**：未登录时渲染 `AuthStack`（包含 Login / Register 页面）；登录成功后切换至 `MainTabNavigator`，避免通过 URL 手动强行跳转。
3. **全局状态透传**：通过 `AuthContext` 暴露 `signIn(token)`、`signOut()` 及 `userProfile`。

```tsx
// 移动端鉴权分流骨架伪代码
export const RootNavigator = () => {
  const { userToken, isLoading } = useAuth();

  if (isLoading) return <SplashScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        <Stack.Screen name="MainApp" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};
```

---

### 6.7 调试体系与跨端测试构建 (Web / Android / iOS)

| 平台 | 启动命令 | 调试工具 | 优势与使用场景 |
| :--- | :--- | :--- | :--- |
| **Web 浏览器** | `npm run web` | Chrome DevTools (F12) | **极速首选**。无需配置 Android SDK 或 Xcode，支持秒级热重载与直接抓包 |
| **Android 真机/模拟器** | `npm run android` | React Native Debugger / Logcat | 校验真实 Android Material 涟漪效果与物理返回按键行为 |
| **iOS 模拟器/真机** | `npm run ios` | Safari 调试器 / Flipper | 验证 iOS 弹性滑动动效、灵动岛与刘海屏安全边距适配 |
| **Expo Go 扫码真机** | `npm run start` | 手机安装 Expo Go App | 无需电脑数据线，通过局域网扫码直接在真实手机中体验运行 |

---

## 7. Week 3 交付项目 (React Native Demo) 验收流程

在项目根目录下完成验证闭环：

```bash
# 1. 进入 React Native 项目目录
cd code/react-native-demo

# 2. 检查依赖与类型约束
npm run build 2>/dev/null || npx tsc --noEmit

# 3. 启动应用进行功能验证
npm run web
```

### 必验关键用例表：
- [x] **页面结构与导航**：底部 Tab 成功切换三个 Tab 页面（文章列表、发布内容、组件大厅），图标与选中高亮同步切换。
- [x] **网络请求与列表**：成功请求并渲染远端文章列表，支持下拉刷新 (`Pull-to-refresh`) 与搜索框即时模糊筛选。
- [x] **表单输入与校验**：发布表单提供实时长度校验与错误提示，点击发布显示 loading，成功后弹出 Snackbar 浮窗反馈。
- [x] **UI 大厅与主题**：组件大厅中切换“深色模式”，整套 Paper 规范与 Navigation 顶/底栏能够瞬时无缝切换暗黑主题。

---

## 8. Week 3 能力达标自测清单 (Capability Checklist)

完成 Week 3 学习后，对照下表进行能力自查：

| 评估维度 | 达标检验标准 | 自测结论 |
| :--- | :--- | :---: |
| **架构认知** | 能够清晰阐明 React Native 原生视图映射、Fabric 新架构与传统 Web DOM 的本质不同 | [ ] |
| **工具链掌握** | 熟练运用 Expo Managed Workflow 进行工程初始化、依赖管理与跨端调试 | [ ] |
| **核心组件** | 熟练使用 `View`, `Text`, `Image`, `ScrollView`, `FlatList`，理解性能优化要点 | [ ] |
| **布局能力** | 掌握移动端 Flexbox 默认纵向排列机制，能独立适配刘海屏与全面屏安全区 | [ ] |
| **路由导航** | 掌握 React Navigation 7 的 Tab 与 Stack 导航结构，能够配置标题与图标映射 | [ ] |
| **网络集成** | 掌握 Axios 在移动端的封装实践，能优雅处理移动弱网超时、断网与异常分流 | [ ] |
| **交互与表单** | 熟练处理移动端键盘避让 (`KeyboardAvoidingView`) 与输入校验反馈 | [ ] |
| **设计系统** | 熟练应用 React Native Paper (MD3) 组件库，支持深浅色主题自由定制与切换 | [ ] |
| **交付物产出** | 独立运行 `code/react-native-demo` 并通过全部功能与测试用例验证 | [ ] |
