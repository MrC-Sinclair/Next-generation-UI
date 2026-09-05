---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 40c8af801da8629c99b9e5611c578fea_1b2e9cbda88511f1be88525400aeaaa3
    ReservedCode1: Npsn6Ec4zhY/4NaWKDpnTjvlNU2vBAcpNVlfQT0KEkQU7GzFLneiwVUjhm9E1vEEVsVqixbXbMD7uZveVaA3/9iN2Uy5wbW8OhX1sUS4w8KQXtrKRIrcvmojKHq5Aj5ch1zpy8cZrfqnT0dGVeMUXtBDA0Z85SvvwAYcr03gwTd3xJ/pNhwxuLzK8Ms=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 40c8af801da8629c99b9e5611c578fea_1b2e9cbda88511f1be88525400aeaaa3
    ReservedCode2: Npsn6Ec4zhY/4NaWKDpnTjvlNU2vBAcpNVlfQT0KEkQU7GzFLneiwVUjhm9E1vEEVsVqixbXbMD7uZveVaA3/9iN2Uy5wbW8OhX1sUS4w8KQXtrKRIrcvmojKHq5Aj5ch1zpy8cZrfqnT0dGVeMUXtBDA0Z85SvvwAYcr03gwTd3xJ/pNhwxuLzK8Ms=
---

# Aurora Glass · 极光液态毛玻璃个人网站

基于 **Taro 4 + React 18 + TypeScript** 的单代码库个人网站，一套代码同时产出 **PC 响应式网页 / 安卓 / iOS / 鸿蒙 / 微信小程序**。

视觉语言：**拟物 × 液态毛玻璃**（Neumorphism × Liquid Glassmorphism），配色为**极光青紫**。

---

## 一、快速开始

```bash
# 安装依赖
npm install

# 本地开发（打开 http://localhost:10086）
npm run dev:h5
```

| 目标端 | 开发 | 构建 |
| --- | --- | --- |
| **H5**（PC / 手机浏览器 / PWA） | `npm run dev:h5` | `npm run build:h5` |
| **微信小程序** | `npm run dev:weapp` | `npm run build:weapp` |
| **鸿蒙 ArkTS** | `npm run dev:harmony` | `npm run build:harmony` |
| **安卓**（React Native） | `npm run dev:android` | `npm run build:android` |
| **iOS**（React Native） | `npm run dev:ios` | `npm run build:ios` |

构建产物统一输出到 `dist/<端>/`。

---

## 二、各端真机预览

### H5（PC 响应式）
`npm run build:h5` 后 `dist/h5/index.html` 可直接双击打开（已配置 `publicPath: './'`），也可部署到任意静态托管。
断点：**< 768 手机** / **≥ 768 平板** / **≥ 1024 桌面** / **≥ 1440 大屏**。

### 微信小程序
```bash
npm run build:weapp
```
用**微信开发者工具**打开项目根目录（已配好 `project.config.json`，`miniprogramRoot` 指向 `dist/weapp`），填入自己的 AppID 即可预览。

### 鸿蒙（HarmonyOS NEXT）
```bash
npm run build:harmony     # 生成 ArkTS 源码到 harmony/entry/src/main/ets
```
用 **DevEco Studio** 打开 `harmony/` 目录，签名后运行到真机或模拟器。

### 安卓 / iOS
有两条路，按你的环境二选一：

**A. React Native（Taro 官方方案，真原生）**
```bash
npm i @tarojs/plugin-platform-react-native @tarojs/rn-runner react-native
# 在 config/index.ts 的 plugins 里加上 '@tarojs/plugin-platform-react-native'
npm run dev:android     # 需要 Android SDK / 模拟器
npm run dev:ios         # 需要 macOS + Xcode
```

**B. Capacitor（把 H5 产物直接装进 App，无需原生环境）**
```bash
npm i -D @capacitor/cli @capacitor/core
npm i @capacitor/android @capacitor/ios
npx cap add android && npx cap add ios
npm run build:h5 && npx cap sync
npx cap open android
```
> 个人主页这类内容型站点推荐 **B**：一套 H5 产物三端通吃，维护成本最低。

---

## 三、目录结构

```
├── config/                  # Taro 多端构建配置
│   ├── index.ts             # 主配置（含各端差异化策略）
│   ├── dev.ts / prod.ts
├── src/
│   ├── app.config.ts        # 全局配置（自定义导航栏，极光贯穿状态栏）
│   ├── app.scss             # 全局重置 + 工具类
│   ├── styles/
│   │   ├── _units.scss      # ★ 跨端单位系统：px() / fs() / 断点 / web|app 编译期分支
│   │   ├── _tokens.scss     # 设计令牌：极光青紫色板、渐变、圆角
│   │   ├── _mixins.scss     # ★ glass() 毛玻璃基座、neumorph-inset()、text-aurora()
│   │   ├── _animations.scss # 液态形变、漂移、入场等关键帧
│   │   ├── _accents.scss    # 强调色修饰类
│   │   └── _buttons.scss
│   ├── data/site.ts         # ★ 全部文案与数据，改这一个文件就能换成你的主页
│   ├── hooks/
│   │   ├── useEnv.ts        # 平台判断、安全区、视口断点
│   │   └── useSectionSpy.ts # 滚动联动导航高亮
│   ├── components/          # AuroraBackdrop / PointerGlow / TopNav / GlassCard / SectionHeading
│   ├── sections/            # Hero / About / Skills / Projects / Blog / Contact / Footer
│   └── pages/index/         # 单页容器（ScrollView + 锚点导航）
├── capacitor.config.ts      # 可选：H5 → 原生 App
└── project.config.json      # 微信小程序工程配置
```

---

## 四、换成你自己的内容

**只改 `src/data/site.ts` 一个文件**，其余代码不用动：

```ts
export const profile = {
  name: '你的名字',
  nameEn: 'Your Name',
  monogram: 'YZ',        // 头像字母占位，不依赖图片资源
  title: '你的头衔',
  tagline: '一句话简介',
  intro: '详细介绍……',
  city: '中国 · 杭州',
  status: '开放合作中'
}
```

同文件里还有 `stats`（数据条）、`milestones`（经历时间线）、`skillGroups`（技能分组）、
`projects`（作品集）、`posts`（文章）、`contacts`（联系方式）。全部带 TypeScript 类型提示。

**换配色**：改 `src/styles/_tokens.scss` 顶部的色板（`$c-cyan` / `$c-violet` / `$g-aurora` 等），
全站渐变、光斑、进度条、强调色会一起跟着变。

---

## 五、跨端适配的关键决策

这套代码能同时在 5 个端跑起来，靠的是下面几条设计（也是这个项目最有价值的部分）：

### 1. 单位系统：为什么不用 Taro 默认的 rem 方案
Taro 默认的 `pxtransform` 在 H5 上按视口等比缩放——在 1920px 的 PC 上会把整个页面放大 **2.5 倍**，完全不可用。

这里的做法是**分而治之**（`config/index.ts` + `styles/_units.scss`）：

| 端 | 策略 |
| --- | --- |
| 小程序 / 鸿蒙 / RN | `designWidth: 750`，pxtransform 开启，SCSS 写设计稿 px → 自动转 rpx |
| H5 | pxtransform **关闭**，改由 `px()` / `fs()` 输出 `clamp(下限, vw 中间值, 上限)` |

效果：375px 手机上 ≈ 设计稿的一半；PC 上放大到 1.46～1.62 倍后**锁死**，不会失控。
容器再用 `max-width: 1180px` 居中，桌面端自然过渡到多列栅格。

### 2. 毛玻璃降级：真玻璃 → 假玻璃
`backdrop-filter` 是 H5 的专利，小程序和鸿蒙上支持不稳定。

```scss
@include glass();   // 自动分端：
//   H5      → 半透明渐变 + backdrop-filter: blur() saturate() + 顶部内高光
//   其它端  → 提高渐变不透明度，用更实的渐变模拟玻璃质感
```

**拟物感**（顶部 1px 内高光 + 底部内反光 + 深外投影）在两端都保留，所以观感统一。

### 3. 特质效果按端裁剪
- `mask` / `conic-gradient`：小程序、鸿蒙支持不稳 → 头像旋转光环只在 H5 用 mask 方案；
  其余端改用**静态细环 + 环上运行的光点**（圆形边框旋转对称，转起来只看得到光点在跑），零兼容风险。
- `filter: blur()`：极光光斑只在 H5 做高斯模糊，其它端用纯 `radial-gradient`，观感接近但零开销。
- 鼠标跟随光晕、悬停抬升：仅 H5，通过 `@mixin web` 在**编译期**剔除，小程序产物里根本不会出现。

### 4. 入场动画的安全兜底
用 `animation-fill-mode: both` 而不是把 `opacity` 写死成 0——万一某端不支持 CSS 动画，
元素只是"不做动画"，而**不会变成一片空白**。

### 5. 导航形态随屏幕切换（纯 CSS，无 JS 判断）
- **≥ 1024px**：顶部悬浮玻璃条 + 文字导航 + 状态胶囊
- **< 1024px / 小程序 / 鸿蒙**：底部悬浮玻璃 Dock（两字标签，拇指可达）

媒体查询在小程序里按设备真实宽度求值（375px），所以同一套 CSS 自动走对分支。

---

## 六、技术栈

| | |
| --- | --- |
| 框架 | Taro 4.2.1 + React 18.3 + TypeScript 5.6 |
| 样式 | Sass（SCSS），自研跨端单位系统与材质 mixin |
| 构建 | Webpack 5（`@tarojs/webpack5-runner`） |
| 端 | H5 / 微信小程序 / 鸿蒙 ArkTS / React Native |
| 图形 | 零图片依赖——头像、光斑、纹理全部用渐变与 SVG data-URI 实现 |

---

## 七、已知限制

- **鸿蒙端**：`build:harmony` 产出的是 ArkTS 源码，需在 DevEco Studio 中编译签名才能安装到设备。
- **RN 端**：需要本地配置 Android SDK / Xcode 原生环境；若只想快速产出 App，走 Capacitor 路径。
- 小程序端 `backdrop-filter` 走的是渐变降级方案，在纯白背景下与 H5 的通透感会有细微差异。

---

## 八、视觉验收标准（拟物毛玻璃）

用于验收"看起来像不像真实拟物玻璃"的口径，以及每项对应的实现手段与代码位置（方便回归时按图索骥）。

| # | 验收项 | 达成判据 | 实现手段 | 位置 |
| --- | --- | --- | --- | --- |
| ① | **通透毛玻璃质感** | 玻璃卡真实模糊并透出背后极光光斑，而非半透明色块 | `backdrop-filter: blur() saturate()` 真背景模糊（`glass()` / `glass-strong()` 玻璃基座 mixin，H5 生效；非 H5 用高不透明度渐变降级） | `src/styles/_mixins.scss`、`src/components/GlassCard.scss`、各 `src/sections/*.scss` |
| ② | **轻盈悬浮感** | 卡片/头像/标签悬浮于背景之上，有柔和阴影与浮动/入场动画 | 深色柔和外投影 + `rise-in` 入场抬升 + H5 `hover-lift` 悬停上浮；液态头像球 `float-y` / `pulse-ring` / `breathe` | `src/styles/_mixins.scss`、`_animations.scss`、`src/components/GlassCard.scss`、`src/sections/HeroSection.scss` |
| ③ | **清晰视觉层次（Z 轴）** | 背景 → 玻璃层 → 前景内容三层分明，前景不与玻璃粘连 | fixed 极光背景放 `z-index: 0`，玻璃卡（backdrop-filter 中景）承接光斑，内容 `z-index: 1` 浮于玻璃之上 | `src/components/AuroraBackdrop.scss`、`GlassCard.scss`、各 `src/sections/*.scss` |
| ④ | **鲜艳极光色点缀** | 青/蓝/紫/粉作为点缀色出现（进度条、标签、发光按钮、液态球高光），不喧宾夺主 | 极光青紫色板与渐变 + accent 强调色 CSS 变量 + 渐变文字/进度条/高光条，背景四团光斑 `aurora-drift` 漂移 | `src/styles/_tokens.scss`、`_accents.scss`、`_mixins.scss`（`text-aurora`）、`src/components/AuroraBackdrop.scss` |
| ⑤ | **微妙精致边框** | 玻璃元素有细描边、顶部内高光/底部内反光与液态高光条，精致但不廉价 | 1px 半透明白描边 + `inset` 顶部高光与底部反光 + 液态高光条（`shimmer-x` 扫光 / `glass-sheen`） | `src/styles/_mixins.scss`、`src/components/GlassCard.scss`、各 `src/sections/*.scss` |

**实测结论**：已在 **H5 1440px 视口**逐屏实测整体达标——玻璃卡真实透出背后漂移的极光光斑、悬浮层次分明、边框细节完整，无塑料感/灰脏感/层次混乱。实测发现三处轻微瑕疵（Skills 区玻璃透射感弱、About 时间线背景噪感、Work 卡片描边/投影偏厚重），已在对应区块样式内微调修复（见 `src/sections/SkillsSection.scss` / `AboutSection.scss` / `ProjectsSection.scss`），未改动全局 mixin 与其它区块观感。第二轮回归又修复两处：下半页 violet/magenta 光斑浓度偏高削弱玻璃卡对比（见 `src/components/AuroraBackdrop.scss`），页脚分割线单调、背景死黑（渐变发丝线 + 品牌光雾，见 `src/sections/SiteFooter.scss`），均在 1440px 与 390px 视口复验通过。
*（内容由AI生成，仅供参考）*
