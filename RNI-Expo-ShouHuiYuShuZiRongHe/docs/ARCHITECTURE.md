---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 40c8af801da8629c99b9e5611c578fea_2b6be0f9a89011f1be88525400aeaaa3
    ReservedCode1: C5ybovGfMp/W9THBmBRbjGqViFxt58VISak+fEzT+I/PMP+hFJx/oKx3wDqExxj6vJCqepfBUWzmzUChcC0C/Q1kfe7iMWctVUMW32x0LBbA16RFaXPuhDrJMuuObhpC6Az9gRBA3E7KL6DCfEBrrSSS1Q86didV8oIUUsIu8OOx/XZhF3B4yLMZyJU=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 40c8af801da8629c99b9e5611c578fea_2b6be0f9a89011f1be88525400aeaaa3
    ReservedCode2: C5ybovGfMp/W9THBmBRbjGqViFxt58VISak+fEzT+I/PMP+hFJx/oKx3wDqExxj6vJCqepfBUWzmzUChcC0C/Q1kfe7iMWctVUMW32x0LBbA16RFaXPuhDrJMuuObhpC6Az9gRBA3E7KL6DCfEBrrSSS1Q86didV8oIUUsIu8OOx/XZhF3B4yLMZyJU=
---

# 架构导览（写给第一次读这个仓库的人 / AI）

> 目标：不改代码就能理解"这个项目是怎么长出来的"，知道改哪一行会动到哪一块。
> 配套文档：[交付/拷贝指引 PORTABILITY.md](./PORTABILITY.md)。

## 1. 一句话心智模型

这个站点的每个页面 = **一份内容数据（`src/content/profile.ts`）** + **几个手绘组件（`src/components/sketch/`）** + **一套设计令牌（`src/theme/tokens.ts`）**，最后统一由根布局 `src/app/_layout.tsx` 包上纸纹背景、手绘顶栏和页脚。

- 想改**文字/作品/技能/博客内容** → 只动 `src/content/profile.ts`。
- 想改**颜色/字号/间距** → 只动 `src/theme/tokens.ts`。
- 想加**新的手绘元素** → 在 `src/components/sketch/` 里做（用 `geometry.ts` 生成抖动路径）。
- 想加**新页面** → 在 `src/app/` 下新建一个 `.tsx` 文件（expo-router 文件即路由）。

## 2. 渲染流（谁先跑、谁包谁）

```
expo-router/entry (package.json "main")
  └─ src/app/_layout.tsx  RootLayout
       ├─ 等字体加载完（use-fonts → SplashScreen 控制）
       ├─ 纸纹层（原生端：paper-noise.png 全屏平铺；web 端：global.css feTurbulence）
       ├─ SiteHeader（顶栏：手绘 logo 圈 + 墨迹横线）
       ├─ <Stack> → 按 URL 渲染 src/app/<route>.tsx 页面
       └─ SiteFooter（页脚：profile.footer + 两颗星）
```

- 页面文件即路由：`src/app/index.tsx` = `/`，`src/app/about.tsx` = `/about`，其余 works / skills / blog / contact 同理，`+not-found.tsx` = 404。
- 根布局里 `Stack` 未显式声明 screens，因此新增路由文件后**自动注册、无需改 `_layout.tsx`**（`headerShown: false`，页面自己用 `PageShell` / 手写区块排版）。
- 每个页面通过 `usePageTitle(title)` 设置浏览器页签标题（仅 web 生效，见 `src/hooks/use-page-title.ts`）。

## 3. 关键文件速查表

| 路径 | 职责 | 常见改动 |
| --- | --- | --- |
| `src/content/profile.ts` | 全站内容（名字/bio/故事/作品/技能/博客/链接/页脚） | 改个人数据 |
| `src/app/_layout.tsx` | 根布局：字体→纸纹→顶栏→路由→页脚 | 加全局层/改背景 |
| `src/components/site-header.tsx` | 顶栏（logo 圈 + 墨迹横线 + 导航） | 改导航结构 |
| `src/components/page-shell.tsx` | 页面的手绘页头骨架 | 页面结构复用 |
| `src/components/sketch/index.tsx` | 手绘组件库（对外导出面） | 新增组件时在此 re-export |
| `src/components/sketch/geometry.ts` | 确定性抖动 SVG 路径引擎 | 手绘引擎算法 |
| `src/components/sketch/marker-title.tsx` | 原生端 SVG 马克笔描边标题 | hero 大标题专用 |
| `src/components/sketch/avatar.tsx` | 会眨眼的涂鸦头像 | 头像动效 |
| `src/theme/tokens.ts` | Palette / TypeScale / Space / Layout / FontFamily | 设计系统 |
| `src/hooks/use-fonts.ts` | expo-font 注册 4 个本地 ttf | 字体资源 |
| `src/hooks/use-page-title.ts` | 设置 web 页签标题 | 新页面接入 |
| `src/global.css` | **web-only** 增强（纸纹/描边/选区高亮） | web 专属样式 |
| `src/types/css.d.ts` | global.css 的模块声明（让 TS 认得 import） | 一般不动 |
| `assets/fonts/*.ttf` | Caveat / Patrick Hand / 霞鹜文楷 | 换字体 |
| `assets/images/paper-noise.png` | 原生端纸纹噪点（256×256 深棕低 alpha） | 换纸纹质感 |

## 4. 设计令牌 `src/theme/tokens.ts`

所有视觉常数收敛在这五个对象里，页面代码**禁止写死色值/字号**：

| 对象 | 内容 | 典型取值 |
| --- | --- | --- |
| `Palette` | 纸张/墨色/马克笔/荧光笔/便利贴/胶带 | `paper #F6F1E7`、`ink #2E2A25`、`markerRed #B74720`、`highlighter #F4D06F` |
| `TypeScale` | 字阶 + 行高（`hero/h1/h2/body/caption`，每组含 `XxxLine`） | `hero: 64`、`body: 17` |
| `Space` | 间距阶梯 | `xs 6 / sm 10 / md 18 / lg 28 / xl 44 / xxl 72` |
| `Layout` | 布局约束 | `maxContent 980`、`wideBreak 760` |
| `FontFamily` | 字体族名（与 use-fonts 注册名一一对应） | `hand=Caveat`、`kai=LXGWWenKai` |

用法示例：

```tsx
import { Palette, FontFamily, TypeScale, Space } from '@/theme/tokens';

<Text style={{ fontFamily: FontFamily.kai, fontSize: TypeScale.body, color: Palette.ink }}>
```

## 5. 手绘组件库 `src/components/sketch/`

### 5.1 渲染原理（geometry.ts）

手绘感来自**确定性抖动**：`mulberry32(seed)` 伪随机数沿路径法向做小幅抖动，并在起笔/收笔处做过冲（overshoot），得到"手抖但每次渲染都一致"的 SVG path。

- **同一个 seed 永远生成同一条路径** → 画面稳定不闪烁，也没有随机抖动带来的 hydration 不一致。
- `rough` 参数控制抖动强度；`tilt` 控制纸片倾斜；`double` 用同一路径以低透明度叠描第二笔，模拟"描了两遍"。

### 5.2 对外组件（均从 `sketch/index.tsx` 导出）

| 组件 / 导出 | 作用 | 关键 props |
| --- | --- | --- |
| `SketchBox` | 手绘矩形纸片盒（纸色填充 + 可叠加第二笔） | `rough / seed / tilt / double`，children 内容 |
| `SketchUnderline` | 波浪墨迹下划线 | `seed / color / strokeWidth` |
| `CircleMark` | 圈重点（涂鸦圆圈） | `seed / color / size` |
| `Star` | 手绘星形 | `seed / color / size` |
| `DoodleArrow` | 涂鸦箭头 | `seed / color / from / to` |
| `Scribble` | 乱线 | `seed / color / width / height` |
| `Tape` | 半透明胶带 | `seed / color / angle` |
| `StickyNote` | 便利贴（底部翘角） | `color: 'yellow'\|'pink'\|'blue'`、`text` |
| `HandTitle` | 手写风格标题文本 | `font (FontFamily)`、`color`、`size` |
| `highlightSpan` | 荧光笔高亮（TextStyle 常量，配 `<Text style={[highlightSpan]}>`） | 直接作为 style 使用 |
| `measureCjk(text, fontSize)` | 估算 CJK 文本宽度（排版手写感需要） | 返回宽度 px |
| `MarkerTitle`（`marker-title.tsx`） | 原生端 SVG Text 描边标题（马克笔笔画饱满效果） | 文本/字号/描边色 |
| `AvatarDoodle`（`avatar.tsx`） | 会眨眼的涂鸦头像（2.2–5.4s 随机眨眼） | `seed / size` |

### 5.3 新增一个手绘组件的套路

1. 用 `geometry.ts` 提供的 mulberry32 / 抖动工具生成 path（或画 `Circle` / `Path`）。
2. 组件 props 保持 `seed` 默认值随机 + 允许外部传入，颜色取 `Palette.*` 而非写死。
3. 在 `sketch/index.tsx` 里导出，供页面 `import { X } from '@/components/sketch'`。

## 6. 字体注册（use-fonts）

`src/hooks/use-fonts.ts` 用 `expo-font` 注册 4 个名称（注意：两个中文名指向**同一个 Medium 文件**，Regular 字重不打包，中文统一 Medium 以保证小屏/缩放可读）：

| 注册名 | 文件 | 用途 |
| --- | --- | --- |
| `Caveat` | `assets/fonts/Caveat.ttf` | 英文手写标题 |
| `PatrickHand` | `assets/fonts/PatrickHand-Regular.ttf` | 英文手写正文 |
| `LXGWWenKai` | `assets/fonts/LXGWWenKai-Medium.ttf` | 中文手写正文 |
| `LXGWWenKaiMedium` | `assets/fonts/LXGWWenKai-Medium.ttf`（同一文件） | 中文加重（token 兼容用） |

根布局等字体 `loaded` 后才 `hideAsync` SplashScreen；**新增字体只需在 `useFonts` 的 map 加一行**，无需其他注册逻辑。

## 7. 新增页面流程（从零到上线）

1. 新建 `src/app/<route>.tsx`（expo-router 自动注册，无需改 `_layout.tsx`）。
2. 内容数据写入 `src/content/profile.ts`（新增导出或扩展 `profile` 对象），页面里 import。
3. 页面结构优先复用 `PageShell`（页头），区块标题用 `HandTitle` / sketch 组件，配色字号全走 `tokens`。
4. 调用 `usePageTitle('页面名')` 设置 web 页签标题。
5. 如需 web-only 视觉效果（纸纹/描边/选区等）→ 追加到 `src/global.css`，同时检查原生端是否要给等价实现（见 §8）。
6. 验证：`npm run web` 看渲染 → `npm run android` 看原生 → `npx tsc --noEmit` 查类型。
7. 如需被静态导出收录，跑一次 export（见 PORTABILITY §4）。

## 8. 跨端差异策略（重要：不要只写一边）

平台分两类样式来源，规则是"web 增强必须给原生端等价物，反之亦然"：

- **RN StyleSheet + tokens**：两端通用，绝大多数样式写在这里。
- **`src/global.css`：仅 web 生效**。web 上借助 CSS 才能实现的（`body` 纸纹 feTurbulence、`-webkit-text-stroke`、`::selection` 荧光黄）放这里；**原生端没有 CSS**，等价效果必须用 RN 手段实现：
  - 纸纹 → `_layout.tsx` 里全屏平铺低透明度 `paper-noise.png`（放首位 → 被后续卡片覆盖，等价"卡片盖在纸纹上"）。
  - 马克笔描边 → `marker-title.tsx` 用 `react-native-svg` 的 Text stroke 实现（页面正文保留原生 Text）。
  - 选区高亮 `::selection` → 系统级交互，原生端明确**未实现**（属可接受差异，见 README 跨端效果表）。

## 9. 工程配置说明（避免误解）

| 文件 | 说明 |
| --- | --- |
| `package.json` | 无 `engines` 字段；Node 版本要求见 PORTABILITY §2（由 react-native engines 约束） |
| **无 `babel.config.js` / `metro.config.js`** | 正常——本项目完全用 Expo 默认 preset/bundler，不需要自定义；不要为了"惯例"去补空文件 |
| `tsconfig.json` | extends `expo/tsconfig.base`；路径别名 `@/* → src/*`、`@/assets/* → assets/*` |
| `app.json` | `web.output: "static"`（静态导出）；`experiments.typedRoutes: true`（路由类型由 Expo 生成到 `.expo/types/`）；`reactCompiler: true`（React Compiler 实验特性） |
| `.expo/`、`expo-env.d.ts` | Expo 运行期/类型生成物，不属于源码；首次 `npx expo start` 会自动重建 |
| `scripts/reset-project.js` | **create-expo-app 模板残留，勿运行**（会把 src/scripts 移到 example 并重建空模板），详见 README 常用命令 |
*（内容由AI生成，仅供参考）*
