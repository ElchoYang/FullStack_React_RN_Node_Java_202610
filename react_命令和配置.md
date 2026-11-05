# React 核心库安装、导入及配置速查手册

---

## 1. 所有安装命令 (Install Commands)

### 核心库与工具
```bash
npm install react-router-dom
npm install @reduxjs/toolkit react-redux
npm install zustand
npm install axios
npm install react-hook-form
npm install zod
```

### React Navigation (React Native 导航，按需分行安装)

#### 1. 核心与基础 Stack 导航 (必选基础)
```bash
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
```

#### 2. Drawer 抽屉导航 (按需)
```bash
npm install @react-navigation/drawer
npm install react-native-gesture-handler
npm install react-native-reanimated
```

#### 3. Bottom Tabs 底部标签栏导航 (按需)
```bash
npm install @react-navigation/bottom-tabs
```

---

## 2. 所有导入方式 (Import Statements)

```javascript
// React Router (Web 路由)
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

// Redux Toolkit (状态切片与存储)
import { createSlice, configureStore } from '@reduxjs/toolkit';

// React-Redux (React 绑定库)
import { Provider, useSelector, useDispatch } from 'react-redux';

// Zustand (轻量级状态管理)
import { create } from 'zustand';

// React Navigation (核心容器)
import { NavigationContainer } from '@react-navigation/native';

// React Navigation Stack (堆栈导航)
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// React Navigation Drawer (抽屉侧边栏导航)
import { createDrawerNavigator } from '@react-navigation/drawer';

// React Navigation Bottom Tabs (底部标签栏导航)
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Axios (网络请求)
import axios from 'axios';

// React Hook Form (表单状态与校验)
import { useForm, Controller } from 'react-hook-form';

// Zod (Schema 数据验证)
import { z } from 'zod';
```

---

## 3. 基础配置与初始化样例 (Configuration & Usage Examples)

### 3.1 React Router (Web 路由)

```jsx
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 3.2 Redux Toolkit & React-Redux

```javascript
// 1. 创建 Slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
  },
});

// 2. 配置 Store
const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});

// 3. 全局包裹组件
// <Provider store={store}><App /></Provider>
```

### 3.3 Zustand (轻量级状态管理)

```javascript
// 创建 Store
const useCounterStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
}));

// 组件内使用: const { count, increase } = useCounterStore();
```

### 3.4 React Navigation (React Native 导航)

```jsx
// 实例化导航器
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Native Stack 导航示例
function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 3.5 Axios (网络请求)

```javascript
// 创建实例
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
});

// 发起请求: api.get('/users').then(res => console.log(res.data));
```

### 3.6 React Hook Form & Zod

```jsx
// 1. 定义 Zod 校验规则
const userSchema = z.object({
  username: z.string().min(2, "用户名至少 2 个字符"),
  email: z.string().email("请输入有效的邮箱"),
});

// 2. 使用 React Hook Form
function LoginForm() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("username")} />
      <button type="submit">提交</button>
    </form>
  );
}
```