# CHROMA · 超色彩主义个人网站

> 一套 React Native 代码，跑 **PC 浏览器 / Android / iOS / 鸿蒙 / 微信小程序** 五个端的个人网站。
>
> 视觉风格：**超色彩主义** —— 高饱和撞色、荧光点缀、粗描边、硬阴影、巨型字、霓虹光晕。

## 一、长什么样

| 区块 | 说明 |
| --- | --- |
| 首页概览 | 巨型撞色标题、跑马灯、数据速览、精选作品、技能速览、关于我摘要、最新文章、此刻在做什么 |
| 关于我 | 档案卡 + 长文自述 + 经历时间线 + 工作方式 + 此刻 + 爱好与城市色卡墙 |
| 作品集 | 分类筛选（App / 设计 / 开源 / 体验）+ 卡片网格 + 点击展开详情 |
| 技能栈 | 分组能力条 + 工具箱 + 正在补课 + 五端支持矩阵 |
| 博客 | 头条文章 + 分类筛选 + 卡片列表 + 展开阅读 |
| 联系方式 | 可复制的联系卡片 + 留言表单（唤起邮件客户端）+ 社交入口 |

## 二、技术选型

| 目标端 | 方案 | 说明 |
| --- | --- | --- |
| **PC 浏览器** | `react-native-web` + esbuild | 断点自适应，320px → 4K 都能看 |
| **Android / iOS** | React Native 0.75 + Hermes | 根目录 `index.js` 入口 |
| **鸿蒙 HarmonyOS** | `@react-native-oh/react-native-harmony` | 复用同一份 `src/`，见 `harmony/README.md` |
| **微信小程序** | WebView 承载 H5 产物（已给工程） / Taro 复刻 | 见 `miniapp/` |

**刻意没有引入的第三方依赖**：没有路由库、没有动画库、没有 UI 库、没有图标库。
导航用手写的响应式外壳，动画用 RN 自带 `Animated`，图标用字符。
好处是：五端零适配成本，也不会出现"某个库在鸿蒙上跑不了"的情况。

## 三、快速开始

```bash
# 1. 安装依赖
npm install

# 2. 浏览器（PC 端）开发，默认 http://localhost:4321
npm run web

# 3. 产出可部署的静态站点（web-dist/）
npm run build:web
#   另外会生成 web-dist/standalone.html —— 单文件版本，双击即可打开预览

# 4. 本地预览生产产物（http://127.0.0.1:4322）
npm run preview:web

# 5. 冒烟测试：真实 Chromium 跑 6 个页面 × 3 档视口，顺带校验 standalone.html
npm run test:web              # 默认打 http://127.0.0.1:4321
npm run test:web -- http://127.0.0.1:4322

# 6. 原生端
npm start          # 启动 Metro
npm run android
npm run ios        # 仅 macOS
```

> 开发服务器把产物写在 `web-dev/`，生产构建写在 `web-dist/`。
> 两个目录刻意分开：早先两者都写 `web-dist/app.js`，
> 结果是「开一次 dev 就把部署包换成 2MB 的未压缩版本」，很难排查。

> 首次跑原生端需要先生成平台工程：
> `npx react-native@0.75.4 init Chroma --directory ./native-tmp --skip-install`，
> 或把已有 RN 工程的 `android/`、`ios/` 目录拷到本项目根目录。
> `src/`、`index.js`、`metro.config.js` 通用，不需要改。

## 四、改成你自己的

**所有文案都在 `src/data/profile.ts` 一个文件里**，改它就行：

```ts
export const profile = {
  name: '林可乐',          // ← 换成你的名字
  enName: 'KOLA LIN',
  role: '全栈产品工程师',
  location: '中国 · 杭州',
  avatarText: '可',        // 头像用首字，不依赖图片
  taglineParts: [...],     // 首页巨型标题，可指定哪几个字用撞色
  summary: [...],          // 关于我的正文
  stats: [...],            // 数据速览
  timeline: [...],         // 经历时间线
  values: [...],           // 工作方式
  now: [...],              // 此刻在做什么
  hobbies: [...],
};

export const skills = [...];  // 技能栈
export const works  = [...];  // 作品集
export const posts  = [...];  // 博客
export const contacts = [...]; // 联系方式
```

换头像图片（可选）：把 `src/screens/HomeScreen.tsx` 与 `AboutScreen.tsx` 里的
`<Portrait />` 换成 `<Image source={require('./avatar.png')} />` 即可。

## 五、设计系统

全部 token 集中在 `src/theme/tokens.ts`，**一套 token 五端共用**（PC / Android / iOS / 鸿蒙 / 小程序）。

**CHROMA 色板 = 墨/纸底 + 五大高饱和撞色 + 荧光点缀色**：

```ts
// 底 / 纸色：深墨与暖白负责压场，衬托撞色更"吵"
C.ink #0D0620   C.inkSoft #2A1B4D   C.paper #FFF6E9   C.paperDeep #FFE9C9

// 五大高饱和撞色主色（卡片 / 标签 / 区块按 ACCENTS 循环发牌）
C.magenta #FF2E88   C.cyan #00E0FF   C.yellow #FFD400   C.violet #7C3AED   C.lime #B8FF2E

// 荧光点缀色（霓虹感 accent）
C.orange #FF5A1F   C.green #00D98B   C.blue #2B5CFF   C.pink #FF8FB1   C.purple #C04CFF
```

**画面语言四件套**：粗描边（2–6px `BORDER`）、无模糊实心硬阴影、撞色条纹 / 巨型字 / 整块纯色、霓虹光晕点缀。

核心工具：

- `hardShadow(offset, color)` —— 无模糊的实心硬投影，Web 用 `boxShadow`，原生用 `shadowOffset + elevation`；新粗野主义的基石
- `glowShadow(color, blur)` —— 纯霓虹光晕：Web 端真实光晕，原生回落为同色阴影
- `hardGlow(offset, hardColor, glowColor, blur)` —— **硬阴影 + 霓虹辉光组合**：Web 端多阴影叠加（保留墨色硬投影，再叠一层真实辉光），重点卡片与主按钮的首选；原生端保留硬阴影质感
- `neonText(color, blur)` —— 霓虹文字光晕（基于 `textShadow*`，Web / 原生 RN 均可用），给撞色标题关键词发光
- `pickAccent(i)` —— 按顺序发牌撞色，保证满屏都是颜色但不打架
- `Hoverable` —— 只在 PC 上生效的悬停位移，移动端自动忽略

**霓虹光晕已落地到重点元素**（本次新增，通过 `Block.glow` / `NeoButton.glow` / `hardGlow` / `neonText` 接入）：

| 元素 | 发光方式 |
| --- | --- |
| 首页 Hero 巨型标题（"点一下"撞色词） | `neonText` 品红文字霓虹 |
| 首页 Hero 主 CTA "看看我的作品" | `NeoButton glow` 品红辉光 |
| 页脚主 CTA "联系我 →" | `hardGlow` 品红辉光 |
| 首页数据速览 StatCard | `hardGlow` 各卡同色辉光 |
| 作品详情展开面板 | `Block.glow` 同色辉光 |
| Hero 右侧墨底信息卡 | `Block.glow` 青色辉光 |

发光只落在视觉焦点头部，正文 / 低饱和纸底不发光，保证超色彩主义的"吵"不牺牲可读性；跨端安全——Web 是真实 `boxShadow` 光晕，原生端自动回落为硬阴影或同色辉光。

想整体换风格只改 `tokens.ts` 里的 `ACCENTS` 数组即可，全站配色会跟着变。

## 六、响应式断点

`src/utils/responsive.ts` 里的 `useResponsive()` 是全站唯一的数据源：

| 断点 | 宽度 | 导航形态 | 栅格列数 |
| --- | --- | --- | --- |
| xs | < 600 | 底部 Tab 栏（手机 / 小程序形态） | 1 |
| sm | 600 – 899 | 顶部横向导航 | 2 |
| md | 900 – 1199 | 左侧窄侧边栏 | 2 |
| lg | 1200 – 1599 | 左侧侧边栏 | 3 |
| xl | ≥ 1600 | 左侧宽侧边栏 + 内容加宽 | 3 |

同一套组件，PC 上是个网站，手机上是个 App，小程序里就是原生 Tab 形态。

## 七、目录结构

```
RN-ChaoSeCaiZhuYi/
├── src/
│   ├── App.tsx                 # 应用根：屏幕注册表
│   ├── theme/tokens.ts         # 设计系统（改这里换风格）
│   ├── utils/responsive.ts     # 响应式断点
│   ├── utils/links.ts          # 跨端外链 / 复制 / 邮件
│   ├── data/profile.ts         # 全部文案内容
│   ├── components/
│   │   ├── layout/AppShell.tsx # 响应式外壳 + 三种导航
│   │   ├── ui/                 # Block / Button / Tag / Section / Grid / Decor …
│   │   └── Cards.tsx           # 作品卡 / 文章卡 / 技能卡 / 数据卡
│   └── screens/                # 六个页面
├── web/index.web.js            # Web 入口
├── webpack.config.js           # Web 打包（react-native-web，备用方案）
├── index.js                    # 原生入口（Android / iOS / 鸿蒙）
├── metro.config.js             # 原生打包
├── miniapp/                    # 微信小程序工程
├── harmony/README.md           # 鸿蒙接入步骤
├── web-dev/                    # 开发产物（npm run web，含 sourcemap）
├── web-dist/                   # 生产产物（npm run build:web，可直接部署）
└── test-output/                # 冒烟测试截图
```

## 八、部署

`npm run build:web` 的产物在 `web-dist/`，纯静态，丢到任何地方都行：
EdgeOne Pages、Vercel、Netlify、对象存储 + CDN 都可以。

小程序端：把 `web-dist` 部署到 HTTPS 域名 → 在小程序后台配置业务域名 →
用微信开发者工具打开 `miniapp/`，把 `app.js` 里的 `siteUrl` 改成你的域名即可。
