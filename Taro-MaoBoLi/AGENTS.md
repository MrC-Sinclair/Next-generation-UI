---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 40c8af801da8629c99b9e5611c578fea_01f9ecffa88d11f1be88525400aeaaa3
    ReservedCode1: Tpi/XgjgcKwbDTp8IQQ/5XyZZYcG+XkxXSZuqADMS3HIxEaX3OJpT/W1thZ6JqE0RGsd+W2UaEDthuVQ+z8x7nfDwPIbt37h6spNQUWGo7yvupZUFbWEfUghKJXiXGpx40ZitsTHnaxnu2ZiAvl9c+HBspY1BOucwqyev3b6z2+HzKn/PFRKwB6fY04=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 40c8af801da8629c99b9e5611c578fea_01f9ecffa88d11f1be88525400aeaaa3
    ReservedCode2: Tpi/XgjgcKwbDTp8IQQ/5XyZZYcG+XkxXSZuqADMS3HIxEaX3OJpT/W1thZ6JqE0RGsd+W2UaEDthuVQ+z8x7nfDwPIbt37h6spNQUWGo7yvupZUFbWEfUghKJXiXGpx40ZitsTHnaxnu2ZiAvl9c+HBspY1BOucwqyev3b6z2+HzKn/PFRKwB6fY04=
---

# AGENTS.md — 给外部 AI / 协作者的项目交接说明

> 本文件面向"把仓库复制到新环境后接手项目的 AI 或开发者"。核心目标：**用最短路径把项目跑起来**，
> 并避开本仓库特有的 4 个坑。详细设计文档见 [README.md](./README.md)。

## 1. 这是什么

Taro 4 + React 18 + TypeScript 的**拟物液态毛玻璃个人网站**（极光青紫配色），一套代码产出
H5 / 微信小程序 / 鸿蒙 ArkTS / React Native 多端。纯前端、无后端、无外部 API/密钥依赖。

## 2. 环境要求

| 项 | 要求 |
| --- | --- |
| Node.js | ≥ 18（package.json `engines` 已声明） |
| 包管理器 | **推荐 pnpm 11**（仓库主管理：`pnpm-lock.yaml` + `pnpm-workspace.yaml`）；npm ≥ 10 也可用，但必须保留 `.npmrc` |

依赖源已在 `.npmrc` 配置为 npmmirror 镜像，无需手动换源。

## 3. 最小跑通顺序（从零到可见页面）

```bash
# 1. 安装依赖（无 node_modules 的源码包必须先执行；勿删锁文件）
pnpm install        # 若用 npm：npm install（.npmrc 的 legacy-peer-deps=true 已兜底 ERESOLVE）

# 2. 类型检查（可选但推荐，快速暴露代码问题）
pnpm type-check

# 3. 构建 H5（首次 1~3 分钟静默输出属正常，看到 "compiled successfully" 即成功）
pnpm build:h5

# 4. 验证：产物在 dist/h5/，index.html 已配 publicPath:'./'，可双击打开；
#    或起静态服务：python -m http.server 8080 -d dist/h5

# 5. 开发模式（热更新，端口 10086）
pnpm dev:h5
```

其他端构建：`build:weapp` / `build:harmony` / `build:android` / `build:ios`，
但**需要额外工具链**（微信开发者工具 / DevEco Studio / Android SDK / Xcode）。只想看效果时只跑 H5 即可。

## 4. 4 个本仓库特有的坑（改之前先读）

1. **包管理器配套文件是"一对"，不要删**
   - `.npmrc`：registry + `node-linker=hoisted` + `legacy-peer-deps=true`——npm 10 安装时靠它绕过
     Taro 的 ERESOLVE（`@tarojs/plugin-framework-react` 声明了 peerOptional vite@^4，本仓库用 webpack5 并不装 vite）。
   - `pnpm-workspace.yaml`：pnpm 11 起只认这里的 `nodeLinker/legacyPeerDeps/verifyDepsBeforeRun` 等构建配置，
     `.npmrc` 里同类配置已不再被 pnpm 11 读取。两个文件职责不同，删任何一个都会导致对应包管理器路径失败。

2. **SCSS 的 `$H5` 分支依赖 config 注入，别绕过**
   - `config/index.ts` 的 `sassH5Use` 会向每个 SCSS 文件头部注入
     `@use '<相对路径>/units' as * with ($H5: true|false)`，这是所有样式文件里
     `@if $H5 { ... } @else { ... }` 分支能编译的前提。
   - 新增 SCSS 文件请照抄现有文件头部的 `@use '../styles/tokens' as *; @use '../styles/mixins' as *;`
     写法；`_mixins.scss` 内已用 `@forward './units'; @forward './tokens';` 转发成员，勿改回 `@import`。
   - `glass()` / `glass-strong()` 等 mixin 自带 H5（真 backdrop-filter）与非 H5（渐变降级）双分支，
     全局材质统一走这里，**不要**在单个 section 里重写整套玻璃样式。

3. **单位系统分端策略，H5 不用 rem**
   - 小程序/鸿蒙/RN：`designWidth: 750` + pxtransform 开启（SCSS 写设计稿 px → 自动转 rpx）。
   - H5：pxtransform 关闭，由 `_units.scss` 的 `px()` / `fs()` 输出 `clamp()` 流体值，
     防止 PC 宽屏等比放大失控。CSS 里写尺寸请用 `px(数字)` / `fs(...)`，不要裸写 px。
   - 涉及"看起来尺寸不对"的排查，先看是不是用了裸 px / 误开了 pxtransform。

4. **产物与缓存不进仓库**
   - `dist/`、`node_modules/`、`.swc/`、`.sasscheck/` 等已被 `.gitignore` 忽略；
     复制/交付源码包时它们通常不存在，收到包后先 `pnpm install` 再谈运行。

## 5. 改动入口索引（改内容不需要动组件）

| 想改什么 | 文件 |
| --- | --- |
| 姓名/头衔/简介/数据条/时间线/技能/作品/文章/联系方式 | `src/data/site.ts`（全部带 TS 类型） |
| 全站配色（极光青紫→别的色） | `src/styles/_tokens.scss` 顶部色板 |
| 玻璃材质/圆角/边框/阴影基调 | `src/styles/_mixins.scss`、`_tokens.scss` |
| 动画（漂移/浮动/入场） | `src/styles/_animations.scss` |
| 区块级样式 | `src/sections/*.scss`（只动目标区块，勿动共享 mixin） |
| 页面容器/锚点 | `src/pages/index/` |

## 6. 视觉验收口径（判断 UI 是否符合设计意图）

项目定位是"拟物毛玻璃"：通透毛玻璃质感 / 轻盈悬浮感 / 清晰 Z 轴层次 / 鲜艳极光色点缀 / 微妙精致边框。
完整验收表（达成判据 + 实现位置）已写入 README「八、视觉验收标准」。
回归 UI 时建议 **构建后真机/浏览器实测截图**，不要只凭"构建通过"判断视觉达成。

## 7. 常见问题速查

- **npm install 报 ERESOLVE**：.npmrc 已含 `legacy-peer-deps=true`，确认文件存在；不要手改依赖规避。
- **构建卡住无输出**：首次编译 1~3 分钟属正常；等待出现 "compiled successfully / compiled with warnings"。
- **样式编译报 Undefined mixin / variable**：检查 SCSS 文件头部的 `@use` 路径与 `$H5` 注入是否被破坏。
- **H5 尺寸在宽屏被放大**：确认 `config/index.ts` 中 h5.postcss.pxtransform 保持 `enable: false`。
- **想跑小程序/鸿蒙/RN**：先看 README「二、各端真机预览」，补齐对应工具链再执行对应 build 脚本。
*（内容由AI生成，仅供参考）*
