# 动态排版个人网站 · uni-app x

一个用 **uni-app x** 写的个人网站。核心理念：文字不再静止——通过扭曲、弹跳、融化来传达情绪。

一套代码，六个端：PC（多尺寸）、Android、HarmonyOS、iOS、Web、微信小程序。

## 目录结构

```
uniappx-dongTaiPaiBan
├─ App.uvue                      应用入口，全局底色与字体栈
├─ main.uts
├─ pages.json                    页面注册 + easycom 规则
├─ manifest.json                 六端配置（app / h5 / mp-weixin / mp-harmony）
├─ composables/
│  └─ use-viewport.uts           响应式断点引擎
├─ common/
│  └─ site.uts                   站点内容 + 情绪模式定义
├─ components/
│  ├─ kinetic-text.uvue          ★ 动态排版核心组件
│  ├─ site-nav.uvue              响应式导航（宽屏顶部 / 窄屏底部 Tab）
│  └─ site-section.uvue          区块容器（序号 + 动态标题 + 描述）
└─ pages/
   ├─ index/index.uvue           ★ 首页概览
   ├─ about/about.uvue           ★ 关于我（含情绪排版实验室）
   ├─ portfolio/portfolio.uvue   作品集
   ├─ skills/skills.uvue         技能栈
   ├─ blog/blog.uvue             博客
   └─ contact/contact.uvue       联系方式
```

## 动态排版怎么用

`kinetic-text` 把整句拆成单字，每字按「同一条时间轴 + 各自相位」独立计算 transform：

```uvue
<kinetic-text
  text="我是林深"
  mode="bounce"
  :font-size="heroSize"
  :amplitude="heroSize * 0.14"
  :speed="0.9"
  accent="#FF4D2E"
  font-weight="800"
  :interactive="true"
></kinetic-text>
```

六种情绪模式：

| mode | 效果 | 适合传达 |
| --- | --- | --- |
| `bounce` | 整句向上弹跳，落地时压扁 | 雀跃、兴奋 |
| `wave` | 正弦波依次推过每个字，波峰染色 | 松弛、流动 |
| `melt` | 下沉量取二次方，字被拉长后瘫软 | 疲惫、融化 |
| `distort` | 挤压 + 歪斜 + 不稳定缩放 | 紧张、不安 |
| `glitch` | 高频抖动 + 红绿色散 | 失真、故障 |
| `breathe` | 缓慢等比起伏 + 透明度呼吸 | 平静、克制 |

参数说明：

- `amplitude` 形变幅度（px），建议取字号的 10%~16%
- `speed` 速度倍数，0.2 ~ 2.4
- `interactive` 开启后点击文字触发一次冲击波
- `letterSpacing` 额外字距
- `paused` 离开视口时置 true，省电

### 为什么不用 CSS @keyframes

1. 逐字相位差用 keyframes 要为每个字生成一条规则，小程序端不支持动态注入样式；
2. `melt` / `glitch` 需要逐帧计算，声明式动画表达不了；
3. 统一走 UTS 计算 transform，六端表现一致，只在 `translate / rotate / skew / scale` 四项上做文章——这四项在 uvue 各端都有原生支持。

## 响应式断点

`useViewport()` 基于 `uni.getWindowInfo()` + `uni.onWindowResize()` 计算，不依赖 CSS 媒体查询（部分原生端支持不一致）：

| 断点 | 窗口宽度 | 导航 | 栅格 | Hero 字号 |
| --- | --- | --- | --- | --- |
| phone | < 600 | 底部 Tab | 1 列 | 52px |
| tablet | 600–1023 | 底部 Tab | 2 列 | 68–82px |
| desktop | 1024–1439 | 顶部导航 | 3 列 | 104px |
| wide | ≥ 1440 | 顶部导航 | 4 列 | 128–148px |

内容区在 ≥1024px 时锁定最大宽度并居中，避免大屏上文字被拉成一条线。

## 能跑 H5 吗？能。但只能靠 HBuilderX

先把话说清楚，这是 uni-app x 的硬约束：

**uni-app x（`.uvue` + `.uts`）没有 CLI 编译器。** `npm run dev:h5` 那套 `uni-preset-vue` 脚手架只认普通 uni-app 的 `.vue`，碰见 `.uvue` 会直接报错。本项目也没有 `package.json`，别去 `npm install`。

uni-app x 的编译器内置在 **HBuilderX 4.x** 里（web 平台支持在持续迭代，建议直接装最新 alpha）。装上之后跑 H5 是官方支持的标准路径：

1. HBuilderX 打开本目录
2. 运行到浏览器：`运行 → 运行到浏览器 → Chrome`
3. 发行 Web：`发行 → 网站-PC Web 或手机 H5`
   （CLI 等价命令：`cli publish --platform web --project 项目名`）

**这台机器上目前没装 HBuilderX**，所以在装好之前，本目录编译不出真正的 uni-app x 产物——这不是项目的问题，是工具链不在本地。

在那之前，用下面的 `preview/` 看效果。

### preview/ 是什么

`preview/` 是一个**纯 Web 预览桩**：用 Vue 3 复刻了 `kinetic-text` 的算法和全部六个页面，不参与 uni-app x 编译，删掉不影响工程。

Vue 已经放在 `preview/vendor/` 下，**离线可用，双击 `index.html` 就能开**，不需要起服务器：

```
preview/index.html   ← 双击这个
preview/vendor/vue.global.prod.js
```

想用 http 方式打开也行：

```bash
cd preview
python -m http.server 5180
# 打开 http://127.0.0.1:5180
```

顶部工具栏可切 6 档视口宽度（375 / 430 / 768 / 1280 / 1680 / 适应窗口）和 6 个页面，右上角实时显示当前断点与导航形态。

> 注意：`preview/` 里的 JS 是对 `.uvue` 的**复刻**，两边不会自动同步。它只用来验证视觉与交互，真做功能开发请改 `pages/` 和 `components/` 下的源文件。

## 定制

改这些地方就能变成你自己的站：

- `common/site.uts` —— 姓名、简介、数据、经历、文章、联系方式，全部集中在这
- `pages.json` —— 页面路径与标题
- `manifest.json` —— 各端 appid 与打包配置

配色在 `App.uvue` 和 `common/site.uts` 的 `MOODS` 里：底色 `#0B0B0F`，纸白 `#F5F3EF`，朱红 `#FF4D2E`，紫 `#7C5CFF`，绿 `#00E5A0`。

## 已实现 / 待办

- [x] 首页概览
- [x] 关于我（含情绪排版实验室）
- [x] 作品集 / 技能栈 / 博客 / 联系方式（结构与视觉完成，内容待填真实数据）
- [ ] 文章详情页
- [ ] 作品详情页
- [ ] 深色 / 浅色主题切换
- [ ] Web 端鼠标位置驱动的磁吸排版
