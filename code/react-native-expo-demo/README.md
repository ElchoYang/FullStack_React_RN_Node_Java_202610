# React Native Demo (企业级标准规范工程)

本项目基于 **React Native + Expo SDK 57 + React 19 + TypeScript** 构建，严格遵循行业工业级标准方案：
- **拒绝手动造轮子与手搓底层样式**，全面采用 **React Native Paper (Material Design 3)** 作为 UI 基础设施；
- **网络请求统一使用 Axios 封装**，内置请求/响应拦截器、全局超时、状态码分流与错误包装；
- **路由导航采用 React Navigation 7** 底部选项卡体系，深度融合主题色与全面屏安全区。

---

## 一、技术架构总览与选型理由

| 架构层级 | 选型方案 | 版本 / 规范 | 选型原因与工业优势 |
| :--- | :--- | :--- | :--- |
| **运行时底座** | **Expo SDK (Managed Workflow)** | SDK ~57 (React Native 0.86, React 19) | 官方推荐开发模式，彻底摆脱原生 Android Gradle / iOS CocoaPods 配置地狱，支持 Web/iOS/Android 三端一致体验与 OTA 热更新能力。 |
| **语言规范** | **TypeScript** | ~6.0 (Strict Mode) | 全链路严格类型约束，从 API 请求参数、响应泛型，到组件 Props 和主题变量，全部提供精确类型推导与编译期保障。 |
| **UI 组件库** | **React Native Paper** | MD3 (Material Design 3) | 业界最成熟且活跃度最高的移动端组件库。内置按钮、卡片、表单输入、弹窗、徽标、底栏、无障碍与深色模式，免除手动编写易碎 CSS/StyleSheet。 |
| **网络通信层** | **Axios** | 最新稳定版 | 成熟的 Promise HTTP 客户端，具备请求拦截（Token 自动装载）、响应拦截（统一错误捕获与提示解包）、超时控制及与后端 RESTful API 的解耦设计。 |
| **路由导航** | **@react-navigation/bottom-tabs** | React Navigation 7 | 移动端业界标准的导航体系，原生性能优化（依赖 `react-native-screens`），支持流畅的手势和状态持久化。 |
| **安全区适配** | **react-native-safe-area-context** | 官方推荐标准 | 精准计算刘海屏、灵动岛、底部手势条（Home Indicator）的安全间距，杜绝元素贴边与穿透遮挡。 |

---

## 二、从零初始化与依赖安装指南

### 1. 从零初始化项目命令
在目标工作目录下（如 `code/`），执行以下命令快速生成纯净的 TypeScript 项目骨架：

```bash
# 步骤 1：使用 Expo 官方 CLI 创建 TypeScript 空白模板项目
npx create-expo-app@latest react-native-demo --template blank-typescript

# 步骤 2：进入生成的项目目录
cd react-native-demo
```

### 2. 生产级成熟核心库安装命令
> 💡 **提示**：在 Expo 工程中，推荐优先使用 `npx expo install` 代替原生 `npm install`。`expo install` 会自动校验并锁定与当前 Expo SDK 版本（SDK 57）严格兼容的底层原生驱动版本，避免 peerDependencies 版本冲突。

```bash
# 安装 UI 核心库 (Paper)、安全区处理、图标库与 Axios 网络请求库
npx expo install react-native-paper react-native-safe-area-context @expo/vector-icons axios

# 安装 React Navigation 导航路由体系及原生屏幕驱动
npx expo install @react-navigation/native @react-navigation/bottom-tabs react-native-screens

# 安装 Web 端跨端适配核心库（必装，使项目支持浏览器运行）
npx expo install react-dom react-native-web @expo/metro-runtime
```

### 3. 已有项目拉取后的全新安装
如果您是直接 Clone 或复制了本仓库代码，在项目根目录下直接安装全部依赖即可：

```bash
npm install
```

---

## 三、项目目录架构

```text
code/react-native-expo-demo/
├── src/
│   ├── api/                    # 网络请求层 (Axios 统一封装)
│   │   ├── client.ts           # Axios 实例、BaseURL、超时、请求/响应拦截器
│   │   ├── postApi.ts          # 业务 RESTful API 接口定义 (getPosts, createPost, deletePost)
│   │   └── types.ts            # API 请求 Payload 与响应数据 TypeScript 接口
│   ├── hooks/                  # 函数式自定义 Hooks (状态与副作用彻底下沉)
│   │   ├── usePosts.ts         # 文章获取、刷新、不可变删除纯函数 Hook
│   │   └── useCreatePost.ts    # 表单受控输入、纯校验函数与异步提交 Hook
│   ├── theme/                  # 主题系统
│   │   └── index.ts            # React Native Paper MD3 浅色 / 深色定制主题
│   ├── screens/                # 页面层
│   │   ├── PostListScreen.tsx  # 文章列表页：Axios GET 请求、下拉刷新、打开抽屉、跳详情 (Stack)
│   │   ├── PostCreateScreen.tsx# 发布文章页：Paper Outlined TextInput、表单校验、Axios POST 提交
│   │   ├── PostDetailScreen.tsx# 文章详情页 (Stack 栈推入)：接收 postId 参数、Scheme 唤起直达
│   │   ├── AboutScreen.tsx     # 关于应用页 (Drawer 抽屉菜单项)：深度链接规则汇总、汉堡菜单
│   │   └── ShowcaseScreen.tsx  # UI 组件大厅：分段选择器、Badge、Dialog 弹窗、按钮组、深色模式切换
│   └── navigation/             # 路由与导航配置 (Stack + Drawer + Tab 复合架构)
│       ├── types.ts            # 严格类型路由参数表 (RootStack, MainDrawer, BottomTab)
│       ├── BottomTabNavigator.tsx # 底部选项卡导航 (Posts, Create, Showcase)
│       ├── DrawerNavigator.tsx    # 侧边抽屉导航 (MainTabs, About)
│       ├── RootStackNavigator.tsx # 根堆栈导航 (DrawerRoot, PostDetail)
│       └── AppNavigator.tsx       # 总导航出口组件
├── App.tsx                     # 根入口：集成 PaperProvider、NavigationContainer(含 Scheme linking)
├── app.json                    # Expo 项目配置文件
├── package.json                # 依赖包声明与脚本
└── tsconfig.json               # TypeScript 严格模式配置
```

---

## 四、核心模块设计与落地细节

### 1. 网络请求层封装 (`src/api/client.ts`)
- **BaseURL 与超时**：统一收敛到配置中（默认 10 秒超时），避免零散分散在代码中。
- **请求拦截器 (Request Interceptor)**：
  - 自动注入 `Authorization: Bearer <token>` 请求头；
  - 开发环境打印详细请求日志。
- **响应拦截器 (Response Interceptor)**：
  - 统一捕获 `400 / 401 / 403 / 404 / 500` 错误码；
  - 超时和断网错误捕获并转换为业务友好的中文异常提示，界面直接展示。

### 2. UI 框架规范 (`react-native-paper`)
- 避免手写容器与按钮样式，页面全部采用 Paper 内置标准组件：
  - `Card`, `Card.Title`, `Card.Content`, `Card.Actions`
  - `TextInput`, `HelperText`（原生表单与错误提示）
  - `Button`, `SegmentedButtons`, `Chip`, `Badge`
  - `Dialog`, `Portal`（模态弹窗与顶层层级）
  - `Snackbar`（操作结果轻提示）
  - `ActivityIndicator`（加载中动效）

### 3. 深色模式与主题响应 (`src/theme/index.ts` & `App.tsx`)
- 一键切换全局浅色（Light）与深色（Dark）主题；
- Paper 主题与 React Navigation 导航栏主题联动同步。

### 4. 三层复合导航架构 (Stack + Drawer + Tab)
本项目实现了移动端最为完整成熟的复合嵌套导航系统：
- **最外层 (RootStackNavigator)**：管理卡片压栈与出栈（Push/Pop）。点击列表文章卡片，右侧滑入详情页 `PostDetailScreen`；
- **中间层 (DrawerNavigator)**：管理左侧滑出式抽屉侧边栏。提供「首页中心」与「关于应用 `AboutScreen`」两大独立功能区，支持手势侧滑或点击汉堡菜单唤出；
- **最内层 (BottomTabNavigator)**：管理主要界面的底部底栏平级切换（文章列表、发文章、UI 大厅）。

### 5. 深度链接 (Scheme URL) 唤起与测试
已在 `app.json` 中配置协议：`"scheme": "reactnativedemo"`，并在 `App.tsx` 中绑定规则。

可在开发阶段通过 Expo 官方工具模拟手机外部点击链接进行测试：
```bash
# 1. 唤醒直达文章列表
npx uri-scheme open "reactnativedemo://posts" --android

# 2. 唤醒直达发文章页
npx uri-scheme open "reactnativedemo://create" --android

# 3. 唤醒直达文章详情页 (自动传递路由参数 postId=123)
npx uri-scheme open "reactnativedemo://post/123" --android

# 4. 唤醒直达抽屉中的“关于”页面
npx uri-scheme open "reactnativedemo://about" --android
```
*(如果是 iOS 模拟器，将末尾的 `--android` 换成 `--ios` 即可)*

---

## 六、快速启动与多端运行指南

### 1. 启动开发服务器 (Expo CLI)
```bash
npm start
# 或使用: npx expo start
```

### 2. 选择运行终端
控制台出现二维码与交互按键后，可任意选择以下平台进行预览：
- **Web 端运行 (免模拟器最快体验)**：
  - 在终端按下键盘 `w` 键，或直接运行 `npm run web`，即可在浏览器直接调试完整页面与接口。
- **手机扫码真机预览 (推荐体验移动端触控交互)**：
  - **Android**：手机应用商店安装 **Expo Go**，使用 App 内扫码；
  - **iOS**：App Store 安装 **Expo Go**，使用系统相机扫码打开。
- **Android 模拟器**：
  - 打开 Android Studio 模拟器后，在终端按下键盘 `a` 键。
- **iOS 模拟器 (需 macOS 环境)**：
  - 在终端按下键盘 `i` 键。

### 3. 代码类型检查
```bash
npx tsc --noEmit
```
项目已全量开启 TypeScript 严格模式校验，确保零类型错误。

---

## 六、生产打包构建指南 (Android / iOS / Web)

在 React Native (Expo) 生态中，针对 Android 和 iOS 有两种成熟的打包方案：
1. **方案 A：EAS Build（官方推荐工业级方案）** —— 免除本地繁重的 Android SDK 与 macOS Xcode 配套环境，支持免费云端打包或本地构建，自动输出 `.apk` 与 `.ipa`。
2. **方案 B：本地原生构建 (Native Prebuild)** —— 一键导出原生 `android/` 和 `ios/` 工程代码，通过本地 Gradle 与 Xcode 离线编译。

### 方案 A：使用 EAS Build 打包（推荐）

#### 1. 全局安装 EAS CLI 并登录
```bash
# 全局安装 Expo 官方打包工具
npm install -g eas-cli

# 登录 Expo 账号（没有可免费注册一个：https://expo.dev）
eas login
```

#### 2. Android 打包命令
项目已预先配置好 `eas.json` 与 `app.json` 包名，可直接运行：

```bash
# 打包测试用 APK（可在任意安卓手机直接安装体验）
npm run build:android
# 或直接调用：
eas build -p android --profile preview

# 本地离线打包 APK（需本机已配置 Android SDK 与 Java 环境）
npm run build:android:apk
# 或直接调用：
eas build -p android --profile preview --local

# 打包用于 Google Play 上架的 AAB 格式
npm run build:android:prod
```

#### 3. iOS 打包命令
```bash
# 打包 iOS 模拟器专用包（可在 Mac 模拟器上直接拖拽安装运行）
npm run build:ios
# 或直接调用：
eas build -p ios --profile preview

# 打包用于 App Store / TestFlight 发布的 IPA 安装包（需苹果开发者证书）
npm run build:ios:prod
```

---

### 方案 B：本地原生构建模式 (Expo Prebuild)

如果您需要在本地完全离线、或者需要将项目直接用 Android Studio / Xcode 打开进行原生修改：

```bash
# 步骤 1：一键生成真正的原生 android/ 和 ios/ 文件夹
npm run prebuild
# 或：npx expo prebuild

# 步骤 2.1：Android 本地离线编译生成 Release APK
cd android
./gradlew assembleRelease
# 生成的 APK 位于：android/app/build/outputs/apk/release/app-release.apk

# 步骤 2.2：iOS 本地编译（需 macOS 环境）
cd ios
pod install
# 使用 Xcode 打开 ios/reactnativedemo.xcworkspace 并在菜单栏选择 Product -> Archive 导出
```

---

### 方案 C：Web 静态网页打包

```bash
# 导出 Web 生产静态资源（输出至 dist/ 目录）
npm run build:web
# 或：npx expo export -p web
```
打包后生成的 `dist/` 静态文件夹可直接部署到 Nginx、Vercel、Netlify 或任何云静态托管服务。

---

## 七、常见问题排查 (FAQ)

### Q1: 为什么执行 `npm run web` 无法跑起 Web 端？
通常由以下两个原因导致，本项目现已全部处理完毕：

1. **原因一：缺少 Web 端运行时包（最常见）**
   - **原理**：Expo 默认创建的移动端空白模板仅包含 Native 驱动（iOS/Android），无法直接解析浏览器 DOM。需要安装 `react-dom`、`react-native-web`（将 RN 组件如 View/Text 转换为 HTML div/span）以及 `@expo/metro-runtime`。
   - **解决**：执行以下命令安装：
     ```bash
     npx expo install react-dom react-native-web @expo/metro-runtime
     ```
   - *(注：本项目已安装完毕)*

2. **原因二：端口 8081 被其他进程占用**
   - **原理**：Metro Bundler 默认使用 `8081` 端口。如果后台此前已经有旧的 Node/Metro/开发服务正在运行，非交互式终端会直接退出并提示 `Port 8081 is being used by another process`。
   - **解决方式 1（指定其他端口启动）**：
     ```bash
     npx expo start --web --port 8082
     ```
   - **解决方式 2（关闭占用 8081 的旧进程）**：
     在 Windows PowerShell 或 CMD 中查找并结束该进程：
     ```bash
     # 查找 8081 端口对应的 PID
     netstat -ano | findstr 8081
     # 终止对应进程（假设 PID 为 12345）
     taskkill /F /PID 12345
     ```
