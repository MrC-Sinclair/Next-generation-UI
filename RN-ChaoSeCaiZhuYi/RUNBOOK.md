---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 40c8af801da8629c99b9e5611c578fea_b6ae95daa88d11f1be88525400aeaaa3
    ReservedCode1: VSzhMpm4VWZMqEXf0K5Shrdk/8Esbx1qFENWkGWG6LbX3oib9kUGEGp7Qd6ohB7x1MBBN3dhJ0K+EZgijwAK2IpNrxks1zSG/ftnUPPq4Xtsx9ZNGTp8KdubCjFj+vNNfvzMXIq8w7A/zTmXhKMUJVJI8rBuRc/n5qtt9m/JB8D3ZjhpeUGTlb5R/sE=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 40c8af801da8629c99b9e5611c578fea_b6ae95daa88d11f1be88525400aeaaa3
    ReservedCode2: VSzhMpm4VWZMqEXf0K5Shrdk/8Esbx1qFENWkGWG6LbX3oib9kUGEGp7Qd6ohB7x1MBBN3dhJ0K+EZgijwAK2IpNrxks1zSG/ftnUPPq4Xtsx9ZNGTp8KdubCjFj+vNNfvzMXIq8w7A/zTmXhKMUJVJI8rBuRc/n5qtt9m/JB8D3ZjhpeUGTlb5R/sE=
---

# RUNBOOK · CHROMA 超色彩主义个人网站 — 交接/运行手册

> 本手册供接手本仓库的 **AI / 开发者** 使用：只读本文件 + `README.md` 即可理解项目并在各端跑通。
> 所有命令、路径、目录结论均基于仓库真实状态核验（2026-09-05），**未标注"以官方文档为准"的内容均可直接信源到本仓库文件**；标注项请以对应官方文档为准，本手册不臆造版本号。

---

## 1. 项目定位与五端总览

**一句话定位**：`CHROMA · 超色彩主义个人网站` —— 一套 React Native（RN）代码同时跑 **PC 浏览器 / Android / iOS / 鸿蒙 / 微信小程序** 五个端的个人作品站，视觉风格为高饱和撞色 + 荧光点缀 + 粗描边 + 硬阴影 + 霓虹光晕的"超色彩主义"。

| 目标端 | 技术方案 | 入口 | 形态 |
| --- | --- | --- | --- |
| PC 浏览器 | `react-native-web` + esbuild | `web/index.web.js`（HTML 模板 `web/index.html`） | 断点自适应网站 |
| Android | React Native 0.75.4 + Hermes | 根目录 `index.js`（原生端共用） | 原生 App |
| iOS | React Native 0.75.4 + Hermes | 根目录 `index.js` | 原生 App |
| 鸿蒙 HarmonyOS | `@react-native-oh/react-native-harmony`（RN-OH） | `index.js` + 复用同一份 `src/` | 原生 App |
| 微信小程序 | WebView 承载 H5 产物 | `miniapp/pages/index/index.wxml`（`<web-view>`） | 小程序壳 |

**已核实的依赖版本**（`package.json`）：

| 包 | 版本 | 用途 |
| --- | --- | --- |
| react / react-dom | 18.3.1 | UI / Web 渲染 |
| react-native | 0.75.4 | 原生三端（Android / iOS / 鸿蒙） |
| react-native-web | ^0.19.13 | Web 端桥接 |
| esbuild | ^0.28.0 | Web 打包（devDependency） |
| @types/react | ^18.3.5 | 类型（devDependency） |

**刻意零第三方运行库**：没有路由库 / 动画库 / UI 库 / 图标库——导航手写响应式外壳，动画用 RN 自带 `Animated`，图标用字符。因此在鸿蒙 / 小程序等受限端无需处理"某库不兼容"。

### 1.1 目录交付矩阵（重要：分清"随仓库交付"与"本地生成"）

**仓库内没有 `android/`、`ios/` 宿主工程**；`harmony/` 下**只有 `README.md` 说明文档**，没有任何宿主代码。以下目录被 `.gitignore` 忽略、**不入库**，换机器后需按第 3 节命令本地生成：

| 目录 | 状态 | 生成方式 / 说明 |
| --- | --- | --- |
| `node_modules/` | 本地生成 | `npm install` |
| `web-dist/` | **产物**（build 输出） | `npm run build:web` 生成，可直接部署 |
| `web-dev/` | **产物**（dev 输出） | `npm run web` 生成，开发服务器专用 |
| `test-output/` | **产物** | `npm run test:web` 冒烟截图 |
| `android/`、`ios/` | 本地生成 | 仓库无宿主工程，见 §3.2 自行 init 后拷入根目录 |
| `harmony/ChromaOH/` 及 `harmony/oh_modules/` 等 | 本地生成 | 见 §3.3 按 `harmony/README.md` 执行 `rnh init` |
| `miniapp/dist/`、`miniapp/build/` | 本地生成（小程序构建） | 微信开发者工具编译产物 |

**随仓库交付的核心目录**：`src/`（全部源码）、`web/`、`scripts/`、`miniapp/`（小程序壳源码）、`harmony/README.md`（鸿蒙接入文档）、根目录 `index.js`、`app.json`、`metro.config.js`、`babel.config.js`、`webpack.config.js`、`tsconfig.json`。

---

## 2. 环境版本矩阵

> 标"⚠️ 以官方文档为准"的项，本仓库文件未给出精确版本，**不要**凭记忆补版本号，去查对应官方文档。

| 目标端 | 前置软件 | 版本要求 | 证据 / 备注 |
| --- | --- | --- | --- |
| 全端公共 | Node.js | **Node 18+** | `harmony/README.md` 明确要求；RN 0.75 对 Node 的具体下限 ⚠️ 以 react-native 官方文档为准 |
| 全端公共 | npm | 随 Node | 也可用 pnpm / yarn（仓库带 `package-lock.json`，建议 npm） |
| Web | 浏览器 / Chrome + Edge | 任一现代浏览器；`test:web` 需本机 Chrome 或 Edge | `scripts/smoke-web.js` 自动探测系统 Chrome/Edge |
| Web | playwright（可选） | 仅跑冒烟测试需要 | `scripts/smoke-web.js` 会查找本地 / 全局 `playwright` |
| Android | JDK | **JDK 17** | RN 0.75 构建要求，⚠️ 具体矩阵以 react-native 官方文档为准 |
| Android | Android SDK | 已安装并配置 `ANDROID_HOME`；`android/local.properties` 写 `sdk.dir` | RN 标准流程 |
| iOS | macOS + Xcode | ⚠️ 版本以 react-native 0.75 官方文档为准 | 仅 macOS 可跑 |
| iOS | CocoaPods | ⚠️ 以 react-native 官方文档为准 | 需 `pod install` |
| 鸿蒙 | DevEco Studio | **4.1+（API 11+）** | `harmony/README.md` 明确 |
| 鸿蒙 | `@react-native-oh/react-native-harmony-cli` | 全局安装（`npm i -g`） | `harmony/README.md` 明确；RN-OH 自身版本要求 ⚠️ 以 RN-OH 文档为准 |
| 微信小程序 | 微信开发者工具 | 最新稳定版即可 | 需登录后导入 `miniapp/` |
| 微信小程序 | 已部署 HTTPS 的 H5 站点 + 小程序业务域名白名单 | — | `web-view` 强制要求 |

---

## 3. 从零跑通序列

### 3.0 安装依赖（所有端的第一步）

```bash
npm install
```

> 说明：仓库 `scripts/_mini-install.js`、`scripts/_repair.js` 是本项目早期在受限沙箱内绕过 npm 安全策略的**临时补丁工具**，正常环境**不要使用**，直接 `npm install` 即可。

### 3.1 Web（PC 浏览器）——最快能跑通的一端

```bash
# ① 开发服务器（热更新），默认 http://localhost:4321
npm run web
# 产物实时写入 web-dev/（刻意与生产目录分离，见 §5 坑#3）

# ② 生产构建 → web-dist/app.js + index.html + standalone.html
npm run build:web

# ③ 本地预览生产产物 → http://127.0.0.1:4322
npm run preview:web

# ④ 冒烟测试：真实 Chromium 跑 6 页面 × 3 档视口 + 校验 standalone.html
npm run test:web                 # 默认打 http://127.0.0.1:4321
npm run test:web -- http://127.0.0.1:4322
```

产物说明：
- `web-dist/index.html`：外链 `app.js` 的部署版；
- `web-dist/standalone.html`：**JS 全内联单文件版**，`file://` 双击即开，也可直接嵌入小程序 WebView；
- `web-dev/`：开发服务器产物，含 sourcemap，**不是部署包**。

> 备选：仓库另有 `webpack.config.js`，是 esbuild 之前的旧方案（同样输出到 `web-dist/`），**当前 package.json 未挂任何 webpack 脚本、也未声明 webpack 依赖**，仅作参考，不要走它跑主链路。

### 3.2 Android / iOS（先本地生成宿主工程）

**前提认知：仓库没有 `android/`、`ios/` 目录**，直接 `npm run android` 会失败（见 §5 坑#1）。首次跑必须先 init 一个 RN 宿主工程并拷回根目录：

```bash
# ① 生成临时宿主工程（README.md 提供的方式；版本固定 0.75.4 与仓库一致）
npx react-native@0.75.4 init Chroma --directory ./native-tmp --skip-install

# ② 把生成的平台工程拷回仓库根目录
#    Windows PowerShell:
Move-Item ./native-tmp/android ./
Move-Item ./native-tmp/ios ./     # iOS 可选（仅 macOS 需要）
Remove-Item ./native-tmp -Recurse -Force

#    macOS / Linux:
# mv ./native-tmp/android ./ && mv ./native-tmp/ios ./ && rm -rf ./native-tmp
```

**Android 前置配置**：
1. `android/local.properties`（不存在则新建）写入 `sdk.dir=C:\\Users\\<你>\\AppData\\Local\\Android\\Sdk`（按实际路径）；
2. 设置环境变量 `ANDROID_HOME` 指向同一 SDK；
3. 确认 `JDK 17` 为 `JAVA_HOME`（RN 0.75 要求）。

**运行**（两个终端）：

```bash
# 终端 A：先启动 Metro（保持运行）
npm start

# 终端 B：连接真机/模拟器后
npm run android        # 构建并安装到 Android 设备
npm run ios            # 仅 macOS；首次需先 cd ios && pod install（CocoaPods）
```

> `src/`、根目录 `index.js`、`metro.config.js` 是跨端通用的，拷入宿主工程后**不需要改**；入口名取自根目录 `app.json` 的 `name`（`chroma-portfolio`），init 时工程名与它不同也 OK——`index.js` 注册用的 appName 来自 `./app.json`，Metro 会读仓库这份。

### 3.3 鸿蒙 HarmonyOS（引用 harmony/README.md）

**仓库 `harmony/` 下只有说明文档，无宿主工程**。完整接入按 `harmony/README.md` 执行，核心命令如下：

```bash
# ① 环境：DevEco Studio 4.1+（API 11+）、Node 18+、全局安装 RN-OH CLI
npm i -g @react-native-oh/react-native-harmony-cli

# ② 在 harmony/ 下初始化 RN-OH 宿主工程
cd harmony
rnh init ChromaOH

# ③ 复用本仓库 src/：软链或拷贝 src 与 app.json 进宿主工程
cp -r ../src ./ChromaOH/src
cp ../app.json ./ChromaOH/

# ④ 入口文件（ChromaOH/App.tsx 或 index.js）改为注册 'ChromaOH'：
#    import App from './src/App';
#    AppRegistry.registerComponent('ChromaOH', () => App);

# ⑤ 打包（命令以 RN-OH 版本为准）
cd ChromaOH
npm run build:harmony
# 产物用 DevEco Studio 签名后安装到真机
```

仓库侧已做好的适配（照用即可）：
- `package.json` 已内置脚本：`npm run harmony`（=`react-native bundle-harmony --dev false`）；
- `metro.config.js` 已把 `harmony.tsx / harmony.ts` 放进 `sourceExts` **首位**，需要鸿蒙专属实现时新建 `xxx.harmony.tsx` 会被优先命中；
- 源码已规避鸿蒙常见坑：无第三方渐变库（纯色块+条纹）、阴影用 `elevation` 兜底、字体在原生端回落系统字体、动画仅用 RN 自带 `Animated`、外链走 `utils/links.ts` 的 `Linking.openURL`。

### 3.4 微信小程序（WebView 壳）

小程序本体极薄：`miniapp/` 只有 1 个页面，用 `<web-view>` 整页承载 H5 产物。

```bash
# ① 先产出 H5 部署包
npm run build:web          # → web-dist/
# 把 web-dist/ 部署到任意 HTTPS 静态托管（EdgeOne/Vercel/Netlify/对象存储+CDN）
```

```text
② 微信公众平台后台 → 开发管理 → 开发设置 → 服务器域名：
   把上面的 HTTPS 域名加进「业务域名」（web-view 只认业务域名白名单，且必须 HTTPS）

③ 微信开发者工具：导入 miniapp/ 目录
   project.config.json 中 appid 目前是测试号 touristappid，正式发布请换成自己的 AppID
```

**本地调试技巧**：`miniapp/project.config.json` 已设 `urlCheck: false`（跳过域名校验），且页面支持 `?url=` 参数覆盖默认站点：

```text
编译模式里配置启动页面：pages/index/index?url=http%3A%2F%2Flocalhost%3A4321
即可在小程序里直接加载本地 Web 开发服务器（记得手机与电脑同网段、且开发者工具勾选"不校验合法域名"）。
```

---

## 4. 必改项 / 占位符清单（上线 / 换人前逐项核对）

| # | 位置 | 现状 | 要改成什么 |
| --- | --- | --- | --- |
| 1 | `miniapp/app.js` → `globalData.siteUrl` | `'https://your-domain.com'` | 你的已部署 H5 地址，且**必须**已加进小程序业务域名白名单 |
| 2 | `src/data/profile.ts` → `profile` | 全站文案唯一入口：`name`（林可乐）、`enName`、`role`、`location`、`avatarText`（可）、`avatarBg`、`taglineParts`、`summary`、`stats`、`timeline`、`values`、`now`、`hobbies` | 换成你自己的资料（README §四有字段注释） |
| 3 | `src/data/profile.ts` → `skills / works / posts / contacts / socials / NAV_ITEMS` | 个人技能/作品/博客/联系方式 | 按需替换；其中 `works[].link`、`socials[].url` 等含 `https://example.com/` **示例链接占位**，发布前需改为真实地址 |
| 4 | 头像 | 零图片依赖：`avatarText` 首字 + `avatarBg` 撞色块（`<Portrait />` 组件渲染） | 想用真图：把 `src/screens/HomeScreen.tsx`、`src/screens/AboutScreen.tsx` 里的 `<Portrait />` 换成 `<Image source={require('./avatar.png')} />`（README §四原文） |
| 5 | `web/index.html` | `<title>`/`meta description` 是 CHROMA 文案；外链 Google Fonts（Archivo Black / Space Grotesk） | 改名 / 换字体域名按需处理 |
| 6 | `miniapp/project.config.json` | `appid: "touristappid"` | 正式发布换成自己的小程序 AppID（`urlCheck:false` 仅用于本地调试） |
| 7 | `app.json` | `name: "chroma-portfolio"`、`displayName: "CHROMA · 超色彩主义"` | 原生入口注册名来自这里，改工程名需同步改（一般不用动） |

**风格层入口**（非必改但要知道）：全站颜色/阴影 token 集中在 `src/theme/tokens.ts`；改 `ACCENTS` 数组即可整体换配色；响应式断点在 `src/utils/responsive.ts`。

---

## 5. 常见坑

| # | 坑 | 现象 | 解法 |
| --- | --- | --- | --- |
| 1 | **原生宿主工程缺失** | 直接 `npm run android` 报找不到 android 工程（仓库确实没有 `android/`、`ios/`） | 先按 §3.2 init 宿主工程并拷回根目录，再运行 |
| 2 | **鸿蒙宿主工程不入库** | 换机器后 `harmony/` 下只有 README，`ChromaOH/` 不存在 | 每次新环境都需重新 `rnh init ChromaOH` 并拷贝/软链 `src/` 与 `app.json`（.gitignore 已忽略 `harmony/ChromaOH/`） |
| 3 | **产物目录与源码目录混淆** | `web-dev/` 与 `web-dist/` 混淆，误把开发产物当部署包 | `npm run web` → `web-dev/`（开发）；`npm run build:web` → `web-dist/`（部署）。两者刻意分离，脚本注释原话：共用会"开一次 dev 就把部署包换成未压缩版本" |
| 4 | **构建中途打断 dev 服务器** | 略 | `build-web.js` 只清 `app.js / app.js.map / index.html / standalone.html` 四个文件，刻意不动 dev 用的 `app.dev.js`——不要在 dev 跑着时手动删 `web-dev/` |
| 5 | **smoke 测试缺 playwright / 浏览器** | `npm run test:web` 报"找不到 playwright"或无法启动 | 装 playwright（`npm i -D playwright` 或全局）并确保本机有 Chrome / Edge（脚本会自动探测系统路径）；缺浏览器时可 `npx playwright install chromium` ⚠️ 以 playwright 文档为准 |
| 6 | **Android 构建环境问题** | SDK 找不到 / JDK 版本错 | 核对 `ANDROID_HOME`、`android/local.properties` 的 `sdk.dir`、`JAVA_HOME` 指向 JDK 17 |
| 7 | **小程序白屏** | web-view 空白 | ① 站点必须 HTTPS 且在业务域名白名单；② `siteUrl` 没改仍是 `your-domain.com`；③ 本地调试用 `?url=` 覆盖并勾选"不校验合法域名" |
| 8 | **.gitignore 吞掉关键目录** | `git status` 看不到以下内容属**正常**： | 被忽略清单（实测）：`node_modules/`、`web-dist/`、`web-dev/`、`test-output/`、`/android/`、`/ios/`、`harmony/oh_modules/`、`harmony/.preview/`、`harmony/entry/build/`、`harmony/.hvigor/`、`harmony/ChromaOH/`、`miniapp/dist/`、`miniapp/build/`、`.env*`、`*.keystore`、`*.apk`、`*.aab`、`*.ipa`、`*.log` |
| 9 | **把临时补丁脚本当正式工具** | `scripts/_mini-install.js`、`scripts/_repair.js` 是沙箱补丁 | 正常环境一律 `npm install`；`scripts/inline-web.js` 是 webpack 时代遗留，当前 esbuild 链路已在 `build-web.js` 内生成 standalone.html，无需单独调用 |
| 10 | **Metro 端口冲突 / 未启动** | 原生端安装后白屏或无法连接 | 原生端必须保持 `npm start`（Metro）运行；默认 8081，冲突时 `npx react-native start --port <新端口>` ⚠️ 细节以 react-native 文档为准 |

---

## 6. 命令速查

| 想做什么 | 命令 | 结果位置 |
| --- | --- | --- |
| 装依赖 | `npm install` | `node_modules/` |
| Web 开发（热更新） | `npm run web` | http://localhost:4321（`web-dev/`） |
| Web 生产构建 | `npm run build:web` | `web-dist/`（含 standalone.html） |
| 本地预览生产产物 | `npm run preview:web` | http://127.0.0.1:4322 |
| Web 冒烟测试 | `npm run test:web [url]` | `test-output/` 截图 |
| 启动 Metro | `npm start` | :8081 |
| Android 运行 | `npm run android` | 需先有宿主工程（§3.2） |
| iOS 运行 | `npm run ios` | 仅 macOS，需宿主工程 |
| 鸿蒙 JS bundle | `npm run harmony` | `react-native bundle-harmony --dev false` |
| 鸿蒙宿主工程 | `rnh init ChromaOH`（在 `harmony/` 下） | 详见 `harmony/README.md` 与 §3.3 |
| 小程序壳 | 微信开发者工具导入 `miniapp/` | 编译产物不入库 |

---

### 附：本文档与 README.md 的关系

- `README.md`：面向"读者"的项目介绍（长什么样、设计系统、目录结构、部署）。
- `RUNBOOK.md`（本文档）：面向"接手者"的运行手册（环境、跑通、必改项、坑）。
- 鸿蒙细节以仓库内 `harmony/README.md` 为唯一权威；本文档对它的引用均按原文件摘录。
*（内容由AI生成，仅供参考）*
