# React Native 原生 Demo (ReactNativeDemo)

本项目使用 React Native 官方社区 CLI（`@react-native-community/cli`）采用**纯原生（Bare 模式）**方式初始化构建，已扩展配置 `react-native-web` 与 Vite，支持在电脑浏览器中直接极速预览。

---

## 目录结构介绍

```text
react-native-demo/
├── android/                  # 🤖 原生 Android 工程目录（Gradle 构建设施）
│   ├── app/                  # Android 应用核心模块（代码、配置、资源）
│   │   ├── build.gradle      # Android 应用级构建配置（版本号、依赖等）
│   │   └── src/main/         # Android 原生源码与资源
│   │       ├── AndroidManifest.xml # 系统清单文件（声明应用权限、页面等）
│   │       ├── java/...      # Java / Kotlin 原生入口（MainActivity / MainApplication）
│   │       └── res/          # 原生资源目录（各分辨率的 App 图标、启动图等）
│   ├── build.gradle          # Android 项目全局构建脚本
│   └── settings.gradle       # Gradle 模块定义与原生插件链接配置
│
├── ios/                      # 🍎 原生 iOS 工程目录（Xcode 构建设施）
│   ├── ReactNativeDemo/      # iOS 应用主工程源码与配置
│   │   ├── AppDelegate.mm    # iOS 应用主入口与生命周期管理
│   │   ├── Info.plist        # iOS 属性列表（权限文案、应用名称等系统配置）
│   │   └── Images.xcassets   # iOS 静态资源（App 图标与素材集合）
│   ├── ReactNativeDemo.xcodeproj   # Xcode 工程文件
│   ├── ReactNativeDemo.xcworkspace # Xcode 工作空间文件（整合 CocoaPods 依赖）
│   └── Podfile               # CocoaPods 原生依赖管理清单
│
├── src/                      # 📁 核心跨平台业务代码目录
│   └── screens/              # 页面模块
│       └── HomeScreen.tsx    # 示例首页（计数器、列表动态交互、平台识别）
│
├── __tests__/                # 单元测试目录（Jest 预置测试文件）
├── .bundle/                  # Ruby Bundler 配置文件（供 iOS 依赖管理）
├── .eslintrc.js              # ESLint 代码规范与校验配置
├── .prettierrc.js            # Prettier 代码格式化配置
├── .watchmanconfig           # Watchman 文件监听工具配置
├── app.json                  # 应用基础元数据配置（应用展示名、原生模块注册名）
├── App.tsx                   # 📱 UI 界面根组件（引入 src/ 页面）
├── babel.config.js           # Babel 转译配置（预置 Metro 打包 preset）
├── Gemfile                   # Ruby 依赖管理文件（用于锁定 CocoaPods 版本）
├── index.js                  # 🚀 移动端原生总入口（AppRegistry 注册）
├── index.html                # 🌐 Web 浏览器端 HTML 入口模板
├── index.web.tsx             # 🌐 Web 端打包加载入口
├── vite.config.mjs           # ⚡ Vite Web 运行配置（react-native -> react-native-web 别名映射）
├── jest.config.js            # Jest 测试框架运行配置
├── metro.config.js           # Metro 打包器配置（移动端 JS/TS 资源构建服务）
├── package.json              # Node.js 项目依赖与运行脚本
└── tsconfig.json             # TypeScript 编译器配置
```

---

## 核心开发与运行说明

### 1. 两端代码如何编写？
- **业务代码通用**：在 `App.tsx` 和 `src/` 目录下编写的 TypeScript / React 代码是 **Android、iOS 与 Web 浏览器通用的**，90% 以上的界面和逻辑无需区分平台。
- **差异化处理**：如需根据平台区分样式或逻辑，可使用 React Native 内置的 `Platform.OS` 或 `Platform.select()`。
- **原生目录维护**：`android/` 和 `ios/` 主要用于修改权限配置（如相机权限）、配置 App 图标、配置签名与原生打包，日常写业务无需改动。

---

## 本地运行步骤

### 运行方式一：电脑浏览器直接预览（最推荐，即开即看）

无需安装庞大的 Android Studio 或模拟器，秒级在浏览器中打开：

```bash
# 启动 Web 开发服务
npm run web
```
启动后在浏览器打开终端提示的地址（如 `http://localhost:3000`），即可看到带有手机边框容器的 React Native 实时界面。

---

### 运行方式二：运行到移动设备/模拟器

#### 运行前准备
- **Node.js**: >= 22.11.0
- **Android 环境**：需安装 Java JDK（已检测有 JDK 17）与 Android Studio（配置 SDK 及环境变量 `ANDROID_HOME`），并启动 Android 模拟器或连接开启 USB 调试的真机。
- **iOS 环境**：需在 macOS 系统下运行，且已安装 Xcode 与 CocoaPods。

#### 步骤 1：启动 Metro 打包服务
```bash
npm start
```

#### 步骤 2：编译并安装运行 App
打开新的终端窗口，执行：
- **运行在 Android**：
  ```bash
  npm run android
  ```
- **运行在 iOS（仅限 macOS）**：
  ```bash
  bundle exec pod install --project-directory=ios
  npm run ios
  ```

---

## 调试与快捷键

在开发调试过程中，如果修改代码，**Fast Refresh** 会自动热重载。如果需要手动刷新或调出调试菜单：

- **浏览器端 (Web)**：直接保存代码自动热更新，或按 `F5` / `Ctrl+R` 刷新，按 `F12` 打开控制台调试。
- **Android 模拟器**：
  - 双击键盘 `R` 键可强制重新加载。
  - 按 `Ctrl + M` 可调出**开发者调试菜单（Dev Menu）**。
- **iOS 模拟器**：
  - 按键盘 `R` 键强制重新加载。
  - 按 `Cmd ⌘ + D` 调出开发者调试菜单。

---

## 常见脚本一览

| 命令 | 说明 |
| :--- | :--- |
| `npm run web` | ⚡ 启动 Web 端浏览器预览（推荐日常快速开发 UI） |
| `npm run build:web` | 打包生成 Web 端静态生产资源 |
| `npm start` | 📱 启动 Metro 打包开发服务（用于移动端） |
| `npm run android` | 编译并安装运行 Android 原生应用 |
| `npm run ios` | 编译并安装运行 iOS 原生应用（仅限 Mac） |
| `npm run lint` | 执行 ESLint 代码检查 |
| `npm test` | 执行 Jest 单元测试 |
