---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 40c8af801da8629c99b9e5611c578fea_2a66e44ea89011f190de525400461939
    ReservedCode1: 3GMd7c+cP4IgOEJ12vSgo9Xw8JaZHLN6jeACsekUqQ4oX4TleHee/dvK4GKywJ215F9VNNLGfhmSONgZLV+F/SZGSo4pxpIU//heFQuEGl0ozmEPulgR18v3G77ADowbXqiNCuSq9llnxT1n6JvIHJ88I/EmEbmBWsFAooJRf4EtGDBT64MOnWHH/As=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 40c8af801da8629c99b9e5611c578fea_2a66e44ea89011f190de525400461939
    ReservedCode2: 3GMd7c+cP4IgOEJ12vSgo9Xw8JaZHLN6jeACsekUqQ4oX4TleHee/dvK4GKywJ215F9VNNLGfhmSONgZLV+F/SZGSo4pxpIU//heFQuEGl0ozmEPulgR18v3G77ADowbXqiNCuSq9llnxT1n6JvIHJ88I/EmEbmBWsFAooJRf4EtGDBT64MOnWHH/As=
---

---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 40c8af801da8629c99b9e5611c578fea_60271079a88211f188bd525400287e28
    ReservedCode1: o/XpLyKy0EypwwnL6O11idFc59RmlXNk5xjVb+v0Ym+TbWonVJWRRAqS21mip/SbJbYvtYHc+6+BdVu1VwU+gGMwMmrqOcKQNiA+BqJ3e5Dj/ln3M3Xt6EfoLVb7tlz0uex3tQaEmadiG8vNSNPFJG5x0n2GFftbGSPHVbFsTF03RDo+3f+9D+6LdcU=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 40c8af801da8629c99b9e5611c578fea_60271079a88211f188bd525400287e28
    ReservedCode2: o/XpLyKy0EypwwnL6O11idFc59RmlXNk5xjVb+v0Ym+TbWonVJWRRAqS21mip/SbJbYvtYHc+6+BdVu1VwU+gGMwMmrqOcKQNiA+BqJ3e5Dj/ln3M3Xt6EfoLVb7tlz0uex3tQaEmadiG8vNSNPFJG5x0n2GFftbGSPHVbFsTF03RDo+3f+9D+6LdcU=
---
# 阿澈的小站 · 手绘个人站点（Expo / React Native）

一个用手绘与数字融合的方式写成的个人站点 / 作品集：粗糙的手绘描边、手写字体、纸与笔的质感，营造"有人的痕迹"的温度感。

> 没有像素级对齐，没有渐变和玻璃拟态——只有纸、笔、和一点点像人留下的痕迹。

## 新读者 / 新机器入口（先看这里）

> - **拷到另一台机器 / 交给从没见过的 AI 或开发者** → 先读 [docs/PORTABILITY.md](docs/PORTABILITY.md)：拷贝时排除/保留什么、环境要求、拷贝后三步验证、单文件预览如何再生成、FAQ。
> - **第一次读这份代码** → 先读 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)：渲染流、设计令牌、手绘组件 API、新增页面/组件流程、跨端差异策略。
> - 本项目是 expo-router 文件式路由：`src/app/` 下每个 `.tsx` 文件就是一个页面，新增页面只需新建文件。

## 环境要求（摘要）

| 项 | 要求 |
| --- | --- |
| Node.js | ^20.19.4 / ^22.13.0 / ^24.3.0 / >=25（建议 Node 22 LTS；react-native@0.86 engines 约束） |
| 包管理器 | npm（仓库带 `package-lock.json`，请用 npm，勿混 yarn/pnpm） |
| 平台 | web 全平台可跑（最快）；Android 需模拟器/真机；iOS 仅 macOS，Windows 无法构建 iOS |
| 真机调试 | 手机装 Expo Go 扫码即可；项目无原生自定义代码，Expo Go 可覆盖 |
| 类型检查 | `npx tsc --noEmit`（依赖 expo 生成物 `.expo/types`；先跑一次 `npx expo start` 即自动生成） |

完整说明 → [docs/PORTABILITY.md](docs/PORTABILITY.md)

## 快速开始

```bash
# 1) 安装依赖（首次）
npm install

# 2) 启动 web —— 最快验证，无需模拟器/手机
npm run web
# 浏览器打开终端提示的地址，看到"米黄纸底 + 手绘描边 + 中文手写排版"即成功

# 其他启动方式
npx expo start   # 开发服务器：终端选平台 / 手机 Expo Go 扫码
npm run android  # Android 模拟器或真机
npm run ios      # iOS（仅 macOS + Xcode）
```

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm install` / `npm ci` | 安装依赖（`ci` 严格按锁文件，最可复现） |
| `npm run web` / `npx expo start` | 启动 web / 开发服务器 |
| `npm run android` / `npm run ios` | 启动 Android / iOS（iOS 仅 macOS） |
| `npx expo export --platform web` | 静态导出到 `dist/`（单文件预览的前置步骤） |
| `npx expo-doctor` | 检查依赖与 SDK 对齐情况 |
| `npx tsc --noEmit` | TypeScript 类型检查 |
| `npm run lint` | ESLint |
| `npm run reset-project` | ⚠️ **切勿运行**：create-expo-app 模板残留，会把 `src/`、`scripts/` 移走并重建空白页 |

## 特性

- **seed 驱动的确定性抖动 SVG 手绘路径**：`mulberry32` 伪随机 + 沿线法向抖动 + 起笔/收笔过冲，生成不规则的手绘边框（粗糙边缘）、手绘矩形纸片、波浪墨迹下划线、圈重点、涂鸦箭头/乱线/星形；同一 seed 渲染稳定不闪烁（`src/components/sketch/geometry.ts`）
- **纸片盒子 `SketchBox`**：手绘矩形 + 纸色填充 + 可叠加第二笔半透明叠描（"描了两遍"），支持 `rough / seed / tilt / double` 参数
- **手写字体（本地打包）**：Caveat（英文手写标题）、Patrick Hand（英文手写正文）、霞鹜文楷 LXGW WenKai（中文手写正文/标题），经 `expo-font` 注册并在根布局等待加载完成（`assets/fonts/`、`src/hooks/use-fonts.ts`）
- **设计令牌体系**：纸张/碳笔/马克笔/荧光笔/便利贴/胶带配色与字体族、字阶、间距统一定义于 `src/theme/tokens.ts`
- **"有人的痕迹"组件**：胶带 `Tape`、便利贴 `StickyNote`（带底部翘角）、荧光笔高亮 `highlightSpan`、会眨眼的涂鸦头像 `AvatarDoodle`（2.2–5.4s 随机眨眼动画）、手写旁注式文案
- **纸面纹理（跨端）**：web 端用 SVG `feTurbulence` 噪点作 body 纸纹；Android/iOS 端用平铺低透明度噪点 PNG 的全屏层近似实现（`assets/images/paper-noise.png` + `src/app/_layout.tsx`）
- **马克笔描边质感（跨端）**：web 端用 `-webkit-text-stroke` 对文字轻描边；原生端以 `react-native-svg` 的 Text stroke 对首页 hero 核心标题（英文大字、名字）实现等价"笔画饱满"效果（`src/components/sketch/marker-title.tsx`）
- 选区高亮（`::selection` 荧光黄）、纸纹均按平台差异处理；页面正文为中文字体统一 Medium 字重，保证小屏/缩放可读

## 技术栈

| 层 | 选型 |
| --- | --- |
| 框架 | Expo ~57 / React Native 0.86 |
| 路由 | expo-router（`src/app` 文件式路由，web 静态导出） |
| 语言 | TypeScript |
| 手绘渲染 | react-native-svg（15.x） |
| 字体 | expo-font（本地 ttf） |
| 动画 | react-native-reanimated（眨眼动画） |
| 样式 | RN StyleSheet + 设计令牌（无 styled-components）；web 增强样式在 `src/global.css` |

## 目录结构

```
├── app.json / package.json / package-lock.json / tsconfig.json
├── expo-env.d.ts          # Expo 生成类型声明（非源码；缺失时先 npx expo start 会自动重建）
├── docs/                  # 开发者文档（本仓库"先读"）
│   ├── ARCHITECTURE.md    #   架构导览：渲染流 / 令牌 / 组件 API / 新增流程
│   └── PORTABILITY.md     #   交付拷贝 / 环境要求 / 构建链路 / FAQ
├── assets/
│   ├── fonts/             # Caveat / Patrick Hand / 霞鹜文楷（本地手写 ttf）
│   └── images/            # 图标 + paper-noise.png（原生端纸纹噪点）
├── scripts/
│   ├── build-single-file.py    # web 导出 → dist/preview.html 单文件打包
│   ├── make-paths-relative.py  # export 产物改写相对路径（预览前置）
│   ├── reset-project.js        # ⚠️ Expo 模板残留，勿运行（会清空 src/scripts）
│   └── charset.txt             # 早期留档字符集副本；构建不读取，可忽略
├── dist/preview.html     # web 单文件产物（可再生；dist/ 已被 .gitignore 忽略）
└── src/
    ├── app/              # expo-router 文件式路由（.tsx 即页面）
    │   ├── _layout.tsx   #   根布局：字体 → 纸纹 → 顶栏 → Stack → 页脚
    │   ├── index.tsx     #   首页 /
    │   ├── about.tsx     #   关于
    │   ├── works.tsx     #   作品
    │   ├── skills.tsx    #   技能
    │   ├── blog.tsx      #   博客
    │   ├── contact.tsx   #   联系
    │   └── +not-found.tsx#   404
    ├── components/
    │   ├── page-shell.tsx    # 页面骨架（手绘页头）
    │   ├── site-header.tsx   # 顶栏（手绘 logo 圈 + 墨迹横线）
    │   └── sketch/           # 手绘组件库（API 详见 docs/ARCHITECTURE.md §5）
    │       ├── index.tsx         # SketchBox / 下划线 / 圈划 / 星 / 箭头 / 乱线 / 胶带 / 便利贴 / HandTitle ...
    │       ├── geometry.ts       # 确定性抖动 SVG 路径生成引擎（seed 驱动）
    │       ├── marker-title.tsx  # SVG 马克笔描边标题（原生端）
    │       └── avatar.tsx        # 眨眼手绘头像
    ├── content/profile.ts    # 全站内容：姓名/bio/故事/作品/技能/博客/链接/页脚
    ├── hooks/
    │   ├── use-fonts.ts      #   字体加载注册（expo-font）
    │   └── use-page-title.ts #   web 页签标题
    ├── theme/tokens.ts       # 设计令牌 Palette/TypeScale/Space/Layout/FontFamily
    ├── global.css            # web-only 增强（纸纹噪点 / text-stroke / 选区高亮）
    └── types/css.d.ts        # global.css 模块类型声明
```

## 内容维护与扩展

- **改内容**：个人资料、作品集、技能、博客、联系方式全部集中在 `src/content/profile.ts`，改数据无需动组件。
- **改样式**：颜色/字号/间距/字体统一在 `src/theme/tokens.ts`（Palette / TypeScale / Space / Layout / FontFamily）。
- **改页面结构**：`src/app/*.tsx` 文件即路由；加页面 = 新建 `.tsx` 文件，根布局自动注册。
- **新增页面/组件/手绘元素的完整流程、跨端差异实现策略** → [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)。

## web 静态单文件预览（可选）

`dist/preview.html` 是把 expo 静态导出产物打包成的**单个自包含 HTML**：字体按页面实际字符子集化并 base64 内联、CSS/JS 全内联，零外部请求，双击即可离线打开（也适合沙箱 iframe 预览）。

依赖 Python 3 + `pyftsubset`（`pip install fonttools`）。再生成需按序执行三步：

```bash
npx expo export --platform web                 # 1) 静态导出到 dist/
python3 scripts/make-paths-relative.py dist    # 2) export 产物改相对路径
python3 scripts/build-single-file.py           # 3) 打包单文件 → dist/preview.html（约 2MB）
```

> 每次重新 export 后都必须重跑第 2、3 步（顺序不可颠倒）。详见 [docs/PORTABILITY.md §4](docs/PORTABILITY.md)。

## 拷贝到新机器（交给陌生 AI / 开发者）

三条关键结论（完整清单见 [docs/PORTABILITY.md](docs/PORTABILITY.md)）：

1. **保留 `package-lock.json`** —— 没有锁文件，`npm install` 会按 `~` 范围装出新版本依赖，出现版本漂移。
2. **排除 `node_modules/`、`.expo/`、`dist/`** —— 均属生成物（`dist/` 已被 `.gitignore` 忽略）；整体复制会把平台相关文件与缓存垃圾一起带走。
3. **拷贝后验证**：`npm ci` → `npm run web`，看到米黄纸底 + 手写排版即成功；可选 `npx expo-doctor` 自检。

## 跨端效果说明

| 效果 | web | Android / iOS |
| --- | --- | --- |
| 纸面噪点纹理 | `body` SVG feTurbulence 噪点 | 噪点 PNG 全屏平铺层（`_layout.tsx`） |
| 马克笔文字描边 | `-webkit-text-stroke: 0.02em`（全局） | hero 核心标题 SVG Text stroke（`MarkerTitle`），正文保留原生 Text |
| 选区高亮 | `::selection` 荧光黄 | 不适用（系统级交互，未实现） |
*（内容由AI生成，仅供参考）*
*（内容由AI生成，仅供参考）*
