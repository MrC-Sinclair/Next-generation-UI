---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 40c8af801da8629c99b9e5611c578fea_989ed803a8cb11f188bd525400287e28
    ReservedCode1: k+TT8ZjfV0oBJl2DSX6eLJPGxCEoZXEXGLzPDecBsQN4qa1hXEoShbr2xvVajdPLqOylnqVPWsbptL8hDejBp8ZWp8wwJRWN/pvv+fwPERInLwmL2rGwF4YUZGMtijVUiojWc/0N+kB/tJ/zgMtiT+GaInYr/Olw6b13jHC1GMEI3TZ1FTHF5Z3LBWI=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 40c8af801da8629c99b9e5611c578fea_989ed803a8cb11f188bd525400287e28
    ReservedCode2: k+TT8ZjfV0oBJl2DSX6eLJPGxCEoZXEXGLzPDecBsQN4qa1hXEoShbr2xvVajdPLqOylnqVPWsbptL8hDejBp8ZWp8wwJRWN/pvv+fwPERInLwmL2rGwF4YUZGMtijVUiojWc/0N+kB/tJ/zgMtiT+GaInYr/Olw6b13jHC1GMEI3TZ1FTHF5Z3LBWI=
---

# 动态排版个人网站 · uni-app x

一个用 **uni-app x** 写的个人网站。核心理念：文字不再静止——通过扭曲、弹跳、融化来传达情绪。

一套代码，六个端：PC（多尺寸）、Android、HarmonyOS、iOS、Web、微信小程序。

## 零背景 30 秒上手

1. 用 **HBuilderX 4.71+** 打开本目录（uni-app x 没有 CLI 编译器，见「版本与前置要求」）
2. `运行 → 运行到浏览器 → Chrome`，10 秒内应看到首页文字在跳
3. 顶部导航点一遍，浏览 6 个页面（窄屏自动变成底部 Tab）

想最快验证「我真的看懂了这个工程」？改这三处看效果：

| 想改 | 去改 | 效果 |
| --- | --- | --- |
| 文案 / 数据（名字、简介、项目、文章…） | `common/site.uts` | 全站内容跟着变 |
| 动态排版形态（速度、幅度、模式） | `components/kinetic-text.uvue` | 所有动效字即时变化 |
| 主题色 | `App.uvue` + `common/site.uts` 的 `THEMES` + `common/theme.uts` | 深浅两套配色整体变化 |

改完保存，HBuilderX 自动增量编译，浏览器直接看到结果，无需重启。

## 目录结构

```
uniappx-dongTaiPaiBan
├─ App.uvue                      应用入口，全局底色与字体栈（含前后台状态维护）
├─ main.uts
├─ pages.json                    页面注册 + easycom 规则
├─ manifest.json                 六端配置（app / h5 / mp-weixin / mp-harmony）
├─ composables/
│  └─ use-viewport.uts           响应式断点引擎（resize/旋转时重读安全区）
├─ common/
│  ├─ site.uts                   站点内容 + UI 设计 Token + 动效开关 + 各页数据
│  └─ app-state.uts              应用前后台激活状态（离屏停帧用）
├─ components/
│  ├─ kinetic-text.uvue          ★ 动态排版核心组件（支持 paused / reduced 降级）
│  ├─ site-nav.uvue              响应式导航（宽屏顶部 / 窄屏底部 Tab）
│  ├─ site-tag.uvue              统一标签组件
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
- `paused` 置 true 时停帧省电（适合滚动离屏/不可见场景；切后台会自动停，无需手动传）
- `reduced` 置 true 时静态渲染（仅首帧淡入，glitch 停用）

### 减弱动效（系统级开关）

`common/site.uts` 里的 `ALLOW_MOTION` 是全局开关：

```uts
export const ALLOW_MOTION = true // 设为 false：全站 kinetic-text 降级为静态/首帧淡入
```

`kinetic-text` 内部按 `reduced prop || !ALLOW_MOTION` 判定降级：不启动定时器、逐字只做首帧淡入、glitch 模式完全停用。适合「跟随系统减弱动效」或省电场景；业务侧也可对单个组件传 `:reduced`。

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

## 版本与前置要求

- **HBuilderX 4.71+**：本项目用到 uvue 的 CSS 变量 `var()`，该能力 **4.71 起**才在 App 端完整支持，更早版本会静默失效或报错。建议直接装最新正式版。
- **uni-app x 没有 CLI 编译器**：`.uvue` / `.uts` 只能由 HBuilderX 内置编译器处理，不存在 `npm run dev:h5` 这类等价物（CLI 通道仅能 `cli publish` 发行已编译产物，见下节）。
- **工程没有 `package.json` / `uni.scss` 属于正常**：不是漏文件，别去 `npm install`。
- **建议先了解 uvue 样式约束**：无 `:active` / `:hover` 伪类；静态 CSS 不能引用 UTS 常量（动态值需走 JS 内联计算，如动效的 transform 由 UTS 逐帧产出）。本项目的具体降级/绕过方式见 `kinetic-text.uvue` 与 `App.uvue` 内注释。

## 各端支持与运行

| 端 | 状态 | 怎么跑 | 备注 |
| --- | --- | --- | --- |
| H5 / Web | ✅ 已验证 | `运行 → 运行到浏览器 → Chrome` 直达 | 本项目默认开发路径，零额外配置 |
| Android | ⚙️ 可跑，需基座 | `运行 → 运行到手机或模拟器`（标准基座） | 图标需在 manifest 可视化界面配置；正式发布需自备签名证书 |
| iOS | ⚙️ 可跑，需基座 | 同上 | 需 macOS + Xcode；正式发布需自备证书 |
| 微信小程序 | ⚙️ 可跑，需 appid | 复制工程后同意 HBuilderX 重新获取 appid；真机预览需自填 appid + 安装微信开发者工具 | 对应 `manifest.json → mp-weixin.appid` |
| mp-harmony | 🚧 结构已备、未验证 | — | `pages.json` / `manifest.json` 已配对应节点，真机未实测 |
| mp-alipay | 🚧 结构已备、未验证 | — | 同上 |

## 能跑 H5 吗？能。但只能靠 HBuilderX

先把话说清楚，这是 uni-app x 的硬约束：

**uni-app x（`.uvue` + `.uts`）没有 CLI 编译器。** `npm run dev:h5` 那套 `uni-preset-vue` 脚手架只认普通 uni-app 的 `.vue`，碰见 `.uvue` 会直接报错。本项目也没有 `package.json`，别去 `npm install`。

uni-app x 的编译器内置在 **HBuilderX 4.x** 里（web 平台支持在持续迭代，建议直接装最新 alpha）。装上之后跑 H5 是官方支持的标准路径：

1. HBuilderX 打开本目录
2. 运行到浏览器：`运行 → 运行到浏览器 → Chrome`
3. 发行 Web：`发行 → 网站-PC Web 或手机 H5`
   （CLI 等价命令：`cli publish --platform web --project 项目名`）

**这台机器上目前没装 HBuilderX**，所以在装好之前，本目录编译不出真正的 uni-app x 产物——这不是项目的问题，是工具链不在本地。

在那之前，可参考仓库结构直接阅读源码；浏览器预览暂不可用，详见下方说明。

### preview/ 浏览器预览桩（规划中，仓库暂未包含）

> 当前仓库**未包含** `preview/` 目录。此前 README 中「双击 `preview/index.html` 即可预览」的表述与实际不符，已修正如下：

`preview/` 是一个**纯 Web 预览桩**的规划：用 Vue 3 复刻 `kinetic-text` 的算法和全部六个页面，不参与 uni-app x 编译，删掉不影响工程。它只用来验证视觉与交互，真做功能开发请改 `pages/` 和 `components/` 下的源文件。

规划形态（待实现）：

```
preview/index.html   ← 浏览器打开
preview/vendor/vue.global.prod.js   ← 本地 Vue 3，离线可用
```

- 顶部工具栏可切 6 档视口宽度（375 / 430 / 768 / 1280 / 1680 / 适应窗口）和 6 个页面，右上角实时显示当前断点与导航形态。
- 用 http 方式打开：`cd preview && python -m http.server 5180` → http://127.0.0.1:5180

> 注意：`preview/` 里的 JS 是对 `.uvue` 的**复刻**，两边不会自动同步。

## 定制

改这些地方就能变成你自己的站：

- `common/site.uts` —— 姓名、简介、数据、经历、文章、联系方式，全部集中在这
- `pages.json` —— 页面路径与标题
- `manifest.json` —— 各端 appid 与打包配置

配色已全站主题化（#12），语义值收敛在 `common/site.uts` 的 `THEMES` / `MOODS` 与 `App.uvue` 的 `.theme--dark` / `.theme--light` CSS 变量中：深色为默认原版（底色 `#0B0B0F`，纸白 `#F5F3EF`，朱红 `#FF4D2E`，紫 `#7C5CFF`，绿 `#00E5A0`）；浅色为深墨/加深强调的对应集。改主题色时同步修改这两处与 `common/theme.uts` 的 `themeResolve` 映射表即可。

## 想改 X 去改哪个文件

| 需求 | 入口 |
| --- | --- |
| 新增情绪模式 | `common/site.uts` 的 `MOODS` 登记 + `components/kinetic-text.uvue` 加渲染分支 |
| 新增页面 | `pages/` 新建目录 → `pages.json` 注册 → `common/site.uts` 补数据 → `components/site-nav.uvue` 的 `items` 加导航项 |
| 调整响应式断点 | `composables/use-viewport.uts`（断点阈值、栅格列数、Hero 字号） |
| 调整主题色 | `App.uvue` 的 `.theme--dark` / `.theme--light` CSS 变量集 + `common/site.uts` 的 `THEMES` + `common/theme.uts` 的 `themeResolve` 映射表 |
| 关闭全站动效 | `common/site.uts` 的 `ALLOW_MOTION` 置 `false` |
| 改页面文案 / 数据 | `common/site.uts`（页面骨架在 `pages/**/*.uvue`，数据全集中于此） |
| 调整导航形态（宽屏顶部 / 窄屏底部 Tab） | `components/site-nav.uvue` |
| 全局底色 / 字体栈 | `App.uvue` |

## 主题（评审 #12）

- 双主题：深色（默认原版）/ 浅色（纸白底 + 深墨正文 + 加深强调色，动效光晕统一降透明）
- 机制：`App.uvue` 定义 `.theme--dark` / `.theme--light` 两套 CSS 变量，页面根节点挂 `themeClass`；JS 内联侧（文字阴影 / 渐变 / 标签色等无法用 CSS 变量的位置）统一走 `common/theme.uts` 的 `themeResolve()` 查表
- 跟随系统：App 端读取 `uni.getAppBaseInfo().osTheme` 并监听 `onOsThemeChange`；Web / 小程序端监听 `onHostThemeChange`（宿主不支持时保持深色）。本地无手动覆盖时有效
- 手动切换：`site-nav` 顶部（宽屏）与底部悬浮胶囊（窄屏）入口，点击即切换、写入本地存储、即时生效无需重启；再次点击反切，清空本地存储即恢复跟随系统（`resetThemeMode`）
- 状态栏文字色随主题联动（自定义导航页面）
- 各端结论：App 端跟随系统支持完整；Web / 小程序端是否支持跟随取决于宿主对 `onHostThemeChange` 的实现，不支持则回退为"默认深色 + 手动切换"；H5 首次进入若宿主无主题事件，初始为深色，可手动切换
- **已知限制**：page 级滚动回弹区取不到主题 class——浅色主题下页面顶部/底部回弹露出的仍是深色兜底背景，正常可视区不受影响。若在意回弹观感，可给对应 page 的滚动容器单独处理或接受该差异。

## 已实现 / 待办

- [x] 首页概览
- [x] 关于我（含情绪排版实验室）
- [x] 作品集 / 技能栈 / 博客 / 联系方式（结构与视觉完成，内容待填真实数据）
- [x] UI/UX 评审优化 #1–#11、#13（contact 栅格溢出、安全区 resize、离屏停帧、行盒溢出、减弱动效、弱文本对比度、Token 登记、卡片/标签/进度条收敛、按压反馈、skills 居中、子页数据集中、滚动条策略）
- [x] 深色 / 浅色主题切换（评审 #12：详见上方「主题」小节）
- [x] 统一 site-tag 标签组件（easycom），三处标签共用一套视觉
- [ ] 文章详情页
- [ ] 作品详情页
- [ ] Unicode 图标跨端一致性（评审 #14：导航/卡片图标在部分字体下渲染不一致，待替换为图标字体或矢量资源）
- [ ] Web 端鼠标位置驱动的磁吸排版
- [ ] preview/ 纯 Web 预览桩（规划中，仓库暂未包含该目录）
*（内容由AI生成，仅供参考）*
