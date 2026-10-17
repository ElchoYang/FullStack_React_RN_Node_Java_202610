# React & TypeScript 全面精讲与对比实战笔记

> 本笔记基于 `React_Notes.xlsx` 学习要点与实战总结提炼，涵盖 **TypeScript 核心语法**、**React 核心心智模型**、**Vue vs React 全面对比**、**Hooks 泛型实践**、**React Router 路由生态**、**受控表单校验** 及 **REST API 集成规范**。

---

## 目录
1. [TypeScript 核心基础与 React 常用类型](#1-typescript-核心基础与-react-常用类型)
2. [函数类型与单向数据流 (Function Types & Callback)](#2-函数类型与单向数据流-function-types--callback)
3. [高级 Utility Types 工具类型实战](#3-高级-utility-types-工具类型实战)
4. [React 核心心智模型与 Hooks 泛型实践](#4-react-核心心智模型与-hooks-泛型实践)
5. [路由生态：React Router 与 Vue Router 对比](#5-路由生态react-router-与-vue-router-对比)
6. [表单体系：受控组件与 Vue vs React 响应式对比](#6-表单体系受控组件与-vue-vs-react-响应式对比)
7. [状态管理演进：React Hooks vs Redux](#7-状态管理演进react-hooks-vs-redux)
8. [API 网络请求与 TypeScript 类型闭环](#8-api-网络请求与-typescript-类型闭环)

---

## 1. TypeScript 核心基础与 React 常用类型

### 1.1 基础数据类型与语法 (Types & Syntax)

| 语法 (Syntax) | 含义 (Meaning) | React 常见用途 (React Use Case) | 代码示例 |
| :--- | :--- | :--- | :--- |
| `string` | 字符串 | 文本 Props、API 字符字段 | `name: string;` |
| `number` | 数字 | ID、金额、计数器、页码 | `id: number;` |
| `boolean` | true / false 布尔值 | 开关状态 (Toggle/Modal/Loading) | `isOpen: boolean;` |
| `string[]` | 字符串数组 | 标签列表、选项列表 | `tags: string[];` |
| `User[]` | 对象数组 | API 返回的数据列表、表格数据源 | `users: User[];` |
| `interface` | 定义对象结构 | Props 定义、API 数据模型规范 | `interface UserProps { ... }` |
| `type` | 定义类型别名 | 状态枚举、联合类型、交叉类型 | `type Role = 'Admin' \| 'User';` |
| `?` | 可选属性 | Optional Props（允许不传） | `avatarUrl?: string;` |
| `\|` | 联合类型 (Union Type) | 限定参数范围、多态状态 | `status: "loading" \| "success";` |

### 1.2 联合类型与状态限制实战
```typescript
// 1. 限制业务状态值
type Status = "loading" | "success" | "error";

// 2. 联合类型变量（既可以是 string 也可以是 number）
let id: string | number;

// 3. 判别联合类型 (Discriminated Unions - 常用于网络响应)
type ApiResponse<T> = 
  | { status: "success"; data: T }
  | { status: "error"; message: string };
```

---

## 2. 函数类型与单向数据流 (Function Types & Callback)

### 2.1 核心定义
- **核心作用：** 严格规定“这个变量/参数必须是一个什么样入参和返回值的函数”。
- **定义示例：**
  ```typescript
  type OnSelect = (id: number) => void;
  type OnSubmit = (values: Record<string, any>) => Promise<boolean>;
  ```

### 2.2 React 中最重要的用途：Callback 回调通信
React 遵循严格的**单向数据流 (Unidirectional Data Flow)**，父子组件通信的经典闭环为：

```text
       ┌──────────────┐
       │ Parent 父组件 │
       └──────┬───────┘
              │  1. 通过 Props 向下传递数据与回调函数
              │     (data={users}, onDelete={handleDelete})
              ▼
       ┌──────────────┐
       │ Child 子组件  │
       └──────┬───────┘
              │  2. 用户触发事件，调用 Callback 回调函数
              │     (onDelete(user.id))
              ▼
       ┌──────────────┐
       │ Parent 父组件 │  3. 接收通知并更新状态 (setUsers)
       └──────────────┘
```

> **数据流转向闭环：** `Parent` $\rightarrow$ `Child` $\rightarrow$ `Callback` $\rightarrow$ `Parent`

---

## 3. 高级 Utility Types 工具类型实战

TypeScript 内置的高级工具类型能够极大地减少重复类型定义，是大型 React 项目不可或缺的利器：

| 工具类型 | 结构 | 实际场景示例 | 作用与含义 | 推荐应用场景 |
| :--- | :--- | :--- | :--- | :--- |
| `Partial<T>` | `Partial<T>` | `Partial<User>` | 将 `User` 的所有属性都变成**可选 (`optional`)** | 表单修改时的 PATCH 局部更新 |
| `Pick<T, K>` | `Pick<T, K>` | `Pick<User, "id" \| "name">` | 从原类型中**精挑细选**指定的几个属性组成新类型 | 卡片列表仅需简略信息时 |
| `Omit<T, K>` | `Omit<T, K>` | `Omit<User, "id">` | **除了指定的属性外，保留其他全部属性** | **API 创建数据时**（新建通常没有 id） |
| `Readonly<T>`| `Readonly<T>`| `Readonly<User>` | 锁定对象，所有属性变为只读，不可修改 | Redux/Context 中的不可变状态 (Immutable State) |
| `Record<K, T>`| `Record<K, T>`| `Record<string, User>` | 快速定义字典/映射对象，指定 Key 和 Value 类型 | 缓存表、字典映射表、ID 索引哈希表 |
| `keyof T` | `keyof T` | `keyof User` | 提取对象所有属性名构成的联合类型 (`"id" \| "name" \| ...`) | 通用表单处理函数 `(field: keyof User, value: any)` |

### 🛠️ 工具类型代码演示：
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  role: 'Admin' | 'Developer';
}

// 1. 新建用户表单：不需要 id
type CreateUserDto = Omit<User, 'id'>;

// 2. 用户表格仅展示部分摘要
type UserSummary = Pick<User, 'id' | 'name' | 'role'>;

// 3. 用户资料修改：所有字段均可单独更新
type UpdateUserDto = Partial<CreateUserDto>;

// 4. 用户字典映射表（通过 id 快速查找用户）
type UserMap = Record<string, User>;
```

---

## 4. React 核心心智模型与 Hooks 泛型实践

### 4.1 React 核心知识全景树
```text
React
 │
 ├── JSX (JavaScript XML 语法扩展)
 ├── Components (函数式组件、UI 纯函数)
 ├── Props (外部入参、只读、单向流动)
 ├── State (内部可变状态、驱动 UI 重渲染)
 ├── Events (合成事件 SyntheticEvent、驼峰命名)
 ├── Hooks (逻辑复用机制)
 │    ├── useState (状态管理)
 │    ├── useEffect (副作用执行与清理)
 │    └── useCallback (函数引用缓存，避免重复创建)
 ├── Router (SPA 客户端路由: react-router-dom)
 └── API Integration (网络请求闭环: Axios / Fetch)
```

### 4.2 `useState` 泛型声明与最佳实践

TypeScript 在 React 中对 `useState` 的类型推导规则：

```typescript
import { useState } from 'react';

// 1. 基础类型（自动推导，无需手动泛型）
const [count, setCount] = useState(0);        // 推导为: number
const [name, setName] = useState("Tom");      // 推导为: string

// 2. 初始为 null 的复杂对象（必须显式标注联合类型）
const [user, setUser] = useState<User | null>(null);

// 3. 数组列表（必须显式标注数组泛型，否则会被推导为 never[]）
const [users, setUsers] = useState<User[]>([]);

// 4. 函数式状态更新（避免异步闭包陷阱）
setCount((prevCount) => prevCount + 1);
setUsers((prevUsers) => prevUsers.filter(u => u.id !== targetId));
```

---

## 5. 路由生态：React Router 与 Vue Router 对比

对于有 Vue 背景的开发者，React Router v6/v7 的对应关系如下：

| 功能维度 | Vue Router 概念 | React Router (v6/v7) 概念 | 说明与 React 示例 |
| :--- | :--- | :--- | :--- |
| **路由配置文件** | `router/index.ts` | `router/index.tsx` | 使用 `createBrowserRouter([...])` 声明 |
| **路由视图插槽** | `<router-view>` | `<Outlet />` | 嵌套布局中渲染子路由匹配组件的位置 |
| **声明式跳转** | `<router-link to="...">` | `<Link to="...">` / `<NavLink>` | 无刷新 SPA 客户端导航链接 |
| **路由参数读取** | `useRoute()` (`route.params` / `route.query`) | `useParams()` / `useSearchParams()` / `useLocation()` | `const { id } = useParams<{ id: string }>();` |
| **编程式导航** | `router.push('/path')` | `const navigate = useNavigate(); navigate('/path')` | JS 函数触发跳转与回退 (`navigate(-1)`) |
| **动态路由定义** | `{ path: '/users/:id', component: ... }` | `<Route path="/users/:id" element={<UserDetail />} />` | 冒号定义动态路径参数 |

---

## 6. 表单体系：受控组件与 Vue vs React 响应式对比

### 6.1 受控组件 (Controlled Component)
在 React 中，表单元素（`<input>`, `<select>`, `<textarea>`）的“内部状态”完全交由 React 的 `state` 控制，这种模式称为**受控组件**。

```tsx
// React 受控组件标准范式
const [name, setName] = useState('');

<input 
  value={name} 
  onChange={(e) => setName(e.target.value)} 
  placeholder="请输入姓名"
/>
```

### 6.2 响应式语法核心对比表 (Vue vs React)

| 场景 | Vue (3.x Composition API) | React (Hooks) | 核心差异解析 |
| :--- | :--- | :--- | :--- |
| **双向绑定** | `v-model="name"` | `value={name} onChange={e => setName(e.target.value)}` | Vue 是语法糖双向绑定；React 是显式“单向绑定 + 事件回调” |
| **状态响应定义** | `const count = ref(0)` | `const [count, setCount] = useState(0)` | Vue 基于 Proxy 劫持对象；React 每次调用 `setState` 触发重新执行组件函数 |
| **值变化事件** | `@change="handleChange"` | `onChange={handleChange}` | React 驼峰命名，底层封装为 SyntheticEvent 合成事件 |
| **点击事件** | `@click="handleClick"` | `onClick={handleClick}` | React 直接传入函数引用 |
| **副作用侦听** | `watch(count, () => ...)` | `useEffect(() => { ... }, [count])` | React 需显式指定依赖项数组 (Dependency Array) |

---

## 7. 状态管理演进：React Hooks vs Redux

随着项目规模的扩大，状态管理会经历以下演进：

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. 局部状态 (Local State)                                    │
│    • useState: 组件内私有状态                                  │
│    • useCallback / useMemo: 计算与性能缓存                   │
└──────────────────────────────┬──────────────────────────────┘
                               │ 跨组件共享状态
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. 上下文状态 (Context API)                                   │
│    • createContext + useContext: 用户登录态、全局主题配置       │
└──────────────────────────────┬──────────────────────────────┘
                               │ 复杂高频全局状态 / 大型团队协同
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. 集中式状态管理 (Redux Toolkit / react-redux)              │
│    • useSelector: 从 Redux Store 中切片读取状态              │
│    • useDispatch: 分发 Action 触发 Reducer 更新状态          │
└─────────────────────────────────────────────────────────────┘
```

| 方案 | 读状态 (Read) | 写状态 (Write) | 适用场景 |
| :--- | :--- | :--- | :--- |
| **React 原生** | `const [val, setVal] = useState()` | `setVal(newVal)` | 单个组件内部交互、表单输入 |
| **Context API** | `const { user } = useAuth()` | 调用 Context 暴露的方法 (`login()`) | 全局登录状态、国际化语言、主题切换 |
| **React-Redux** | `useSelector(state => state.user)` | `useDispatch()(loginAction(data))` | 超大型复杂项目、复杂状态回溯与调试 |

---

## 8. API 网络请求与 TypeScript 类型闭环

在实际开发中，将 TS 接口与 API 调用串联，形成强类型端到端保护：

```typescript
import axios from 'axios';

// 1. 定义数据结构
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Developer';
}

// 2. 泛型封装 API 方法
export const api = {
  // GET 列表：返回 Promise<User[]>
  getUsers: (): Promise<User[]> => {
    return axios.get<User[]>('/api/users').then(res => res.data);
  },

  // POST 创建：入参为 Omit<User, 'id'>，返回 Promise<User>
  createUser: (data: Omit<User, 'id'>): Promise<User> => {
    return axios.post<User>('/api/users', data).then(res => res.data);
  }
};
```

---

## 9. 💥 React 19 重大变革：组件定义与 Ref 规范

### 9.1 `React.FC` vs 现代普通函数组件

| 维度 | `React.FC` (经典) | `function Component(props: Props)` (React 19 推荐) |
| :--- | :--- | :--- |
| **书写形式** | `const Button: React.FC<ButtonProps> = ({ text }) => ...` | `export function Button({ text }: ButtonProps) { ... }` |
| **泛型组件** | 语法繁琐，难以支持泛型组件 `<Select<T>>` | **原生完美支持泛型**：`function Select<T>(props: SelectProps<T>)` |
| **代码洁净度** | 需额外引入 `React.FC` 包装类型 | 零多余包装，纯粹的 TypeScript 参数类型定义 |

### 9.2 `ref` 成为普通 Prop：告别 `React.forwardRef`！

在 **React 18 及更早版本**中，`ref` 不能直接作为参数接收，必须使用高阶函数 `React.forwardRef` 包裹：
```tsx
// ❌ React 18 及更早经典写法 (React 19 已不再需要)：
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }, ref) => {
    return <input ref={ref} {...props} />;
  }
);
```

而在 **React 19** 中，**`ref` 已经变成了一个完全普通的 Prop**：
```tsx
// ✅ React 19 现代化推荐写法：直接当作 Prop 接收，无需 forwardRef！
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({ label, ref, ...props }: InputProps) {
  return (
    <div>
      {label && <label>{label}</label>}
      {/* 直接将传入的 ref 绑定给 DOM */}
      <input ref={ref} {...props} />
    </div>
  );
}
```

---

## 总结：React + TypeScript 核心口诀
1. **类型优先**：先定义 `interface` 与 `type` 数据模型，再编写组件和 API。
2. **单向流动**：数据通过 `Props` 向下流，变更通过 `Callback` 向上报。
3. **受控表单**：输入框必须同时绑定 `value` 与 `onChange`。
4. **精确 Hook**：对象/数组 Hook 必须加泛型（`useState<User | null>`），副作用依赖数组要诚实。
5. **React 19 现代化**：淘汰 `forwardRef`，`ref` 直接作为普通 Prop 接收；组件直接采用常规函数定义。

