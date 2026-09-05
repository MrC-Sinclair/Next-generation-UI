# 触感反馈可视化 · 个人站点（Kuikly）

一套 Kuikly 代码，构建为 **H5 静态站点**（PC Web / 移动浏览器均可直接访问）。

> 本项目已收窄为 **H5-only**：仅保留 `:shared`（站点业务模块）与 `:h5App`（Web 宿主壳工程）
> 两个模块，androidApp / miniApp / iosApp 三个宿主端已删除，不再维护。

设计主题是「触感反馈可视化」：把物理世界的按压感，用**阴影几何的变化**翻译成看得见的反馈。

---

## 一、快速开始

### 环境要求

| 工具 | 版本 | 说明 |
| --- | --- | --- |
| JDK | 17 | 若用 IDE 跑 Gradle 任务，需把 Gradle JDK 切到 17 |
| Gradle | 8.14.3（自带 wrapper） | 首次运行会自动下载 |

### 构建 H5 静态站点（Windows / macOS 均可）

```bash
# 打包成可直接托管的静态站点
#   Windows 用：gradlew.bat :h5App:buildSite
#   macOS/Linux 用：./gradlew :h5App:buildSite
./gradlew :h5App:buildSite

# 产物在 h5App/build/site/
#    index.html
#    h5App.js          —— Web 渲染器运行时
#    page/nativevue2.js —— 站点业务代码
```

用任意静态服务器打开即可：

```bash
cd h5App/build/site && python -m http.server 8080
# 浏览器打开 http://localhost:8080
```

支持深链：`http://localhost:8080/?section=about`

### 网络环境与镜像开关（交付 / 新机器 / 交给 AI 前必读）

本仓库默认假设**国内网络**，构建链路上有三处镜像；在海外或能直连 GitHub 的机器上，
需要按下面清单关闭它们，否则会卡在依赖下载（尤其 yarn）：

| 镜像 | 位置 | 下载什么 | 非国内网络怎么办 |
| --- | --- | --- | --- |
| yarn 下载源 `https://ghfast.top/...` | `gradle.properties` 的 `yarnDownloadBaseUrl` | Kotlin/JS 构建用的 yarn 本体 | 注释掉该行，回退官方 GitHub Releases |
| npm registry `https://registry.npmmirror.com` | 根 `build.gradle.kts` 注入的环境变量（默认值） | webpack / karma 等 npm 包 | 删掉注入段，或设 `npmRegistry` 为空回退官方源 |
| 腾讯 Maven 镜像 `mirrors.tencent.com` | `settings.gradle.kts` / 根 `build.gradle.kts` | Kuikly 制品与插件 | 公网一般可达；若不通，需手动把 Kuikly 制品放入本地仓库（制品同步于 GitHub Release） |

关闭方法均已在对应文件注释里说明，三处镜像都支持通过 `gradle.properties` 覆盖，不需要改逻辑代码。

**交付前请清理这些本地环境文件**（它们被 `.gitignore` 忽略，本就不该随仓库走）：

- `local.properties`：含本机 `sdk.dir=D:/AndroidSDK`。本工程是 **H5-only，不需要 Android SDK**，直接删除即可，不要带到新机器；
- `.gradle/`、`*/build/`、`node_modules/`、`.kotlin/`：构建缓存与产物，整目录复制时建议删掉，否则体积大且可能让新环境误用旧缓存。

最小可交付集合 = 源码 + 构建脚本 + wrapper + `README.md`，新机器上装好 JDK 17 后执行第二节的构建命令即可。

---

## 二、目录结构

```
.
├── shared/                         业务模块（Kotlin Multiplatform）
│   ├── src/commonMain/kotlin/com/kuikly/personal/
│   │   ├── theme/
│   │   │   ├── DesignTokens.kt     颜色 / 间距 / 圆角 / 字号
│   │   │   └── Haptic.kt           ★ 按压反馈的核心：阴影高度档位与三态映射
│   │   ├── layout/SiteLayout.kt    响应式断点与布局参数
│   │   ├── data/SiteDataSource.kt  ★ 全站内容（要换成你自己的信息，改这一个文件）
│   │   ├── components/
│   │   │   ├── HapticViews.kt      可按压容器 / 按钮 / 标签 / 按压深度演示
│   │   │   └── SiteChrome.kt       PC 侧边导航 / 移动顶栏 / 底部 Tab
│   │   ├── sections/               六个板块的内容
│   │   └── pages/SitePage.kt       主页面：布局骨架 + 板块切换 + 按压状态
│   ├── src/jsMain/                 H5 专用代码（web/ 目录）与资源
│   ├── webpack.config.d/           关掉 UMD 包装的修复
│   └── shared.podspec              iOS CocoaPods 集成遗留文件，H5-only 后不再参与构建
│
├── h5App/                          Web / H5 宿主（官方双产物流程）
│   ├── src/jsMain/kotlin/          H5 宿主入口（Main.kt）+ 渲染委托 / 组件 / 路由 / 桥接模块
│   │                               （KuiklyWebRenderViewDelegator.kt、KuiklyRenderView.kt、
│   │                                KuiklyRouter.kt、KRBridgeModule.kt、KRWebView.kt 等）
│   ├── src/jsMain/resources/       index.html 模板
│   └── webpack.config.d/           关掉 UMD 包装的修复
│
├── build.gradle.kts                插件版本 + 依赖仓库 + yarn / npm 镜像配置
├── settings.gradle.kts             模块声明（仅 :shared 与 :h5App）
├── gradle.properties               版本与构建参数（含 yarnDownloadBaseUrl）
├── gradlew / gradlew.bat           Gradle wrapper（gradle/ 目录下为 wrapper 配置）
├── .yarnrc / .gitignore / local.properties
└── README.md
```

### 两份 JS 产物是什么

Kuikly H5 把一份站点拆成两份 JS 一起加载：

- **`h5App.js`**：宿主壳的 webpack 产物，包含 Web 渲染器 + 路由桥接。
- **`page/nativevue2.js`**：业务模块 `:shared` 经 Kuikly 插件重新打包的产物，
  KSP 生成的页面注册表也在这里。

`buildSite` 任务把这两份合到同一个目录，再把 `index.html` 里指向开发服务器的
`http://127.0.0.1:8083/nativevue2.js` 占位替换成相对路径，得到可直接托管的静态站点。

---

## 三、换成你自己的内容

**只改一个文件**：`shared/src/commonMain/kotlin/com/kuikly/personal/data/SiteDataSource.kt`

里面是所有占位内容：姓名、头衔、简介、经历、作品、技能、文章、联系方式。
页面结构、设计系统、组件都不用动。

---

## 四、设计语言：触感反馈可视化

### 核心思路

现实中一个物体**离桌面越高，投影越大、越模糊、越淡**；
手指按下去时，物体**贴近桌面，投影迅速收紧、变小、变实**，同时本身轻微下沉、缩小。

所以每个可按压元素有三种「高度状态」，只调阴影的 `offsetY / blur / alpha` 三参数，色相保持不变：

| 状态 | 触发 | 表现 |
| --- | --- | --- |
| `Idle` 浮起 | 默认 | 大 offsetY + 大 blur + 低透明度 |
| `Hover` 抬升 | PC 鼠标悬停 | 比 Idle 更高一档 |
| `Pressed` 压平 | 按下 | offsetY/blur 收缩到极小 + 下沉 1~4dp + 缩放 0.965~0.99 + 底色变暗 |

四档高度定义在 `Haptic.kt` 的 `Elevation` 枚举里：`Low / Medium / High / Floating`。

### 为什么全站只有一个出口

所有可按压元素都走 `hapticSurface()`，内部只有一处调用 `applyElevation()`。
这是为了保证「按下去」的手感在任何地方都一致——如果每个组件自己写一遍阴影，
迟早会出现「这个按钮按下去的样子跟那个卡片不一样」。

### 按压的「过渡过程」由谁实现

两点客观限制（本工程 · Kuikly 2.26 实测结论，详见 `Haptic.kt` 顶部说明）：

1. 在本工程里 Kuikly 的动画管线从未被触发：声明式 `animate()` 与命令式
   `animateToAttr()` 都一样，属性直接跳变，元素上从不出现 animation 属性。
2. 渲染端只实现了 `opacity / transform / backgroundColor / frame` 四类动画
   Handler，**boxShadow 在任何端都不可动画**。

因此 `applyElevation()` 只负责把目标状态（阴影 / 底色 / 位移 / 缩放）写进属性，
**过渡过程由 H5 宿主 CSS 承接**——见 `h5App/src/jsMain/resources/index.html`：

```css
#root div {
    transition:
        transform 140ms cubic-bezier(0.2, 0, 0, 1),
        box-shadow 140ms cubic-bezier(0.2, 0, 0, 1),
        background-color 140ms ease-out;
}
```

曲线 `cubic-bezier(0.2,0,0,1)` 是快起快落的「咔哒」手感，140ms 既跟手又不拖。
选中 `#root div` 而非 `*`：按压元素都是 div，且避免误伤其它宿主节点。
**这是 H5-only 工程成立的前提**——若未来重新接回 Android / iOS / 小程序端，
需要各端宿主自行实现等价过渡，否则按压态会直接跳变。

### 组件语义约定：可点才可压

全站按压反馈只挂在**真的会响应动作**的元素上，避免「看着能按、点了没反应」：

| 组件 | 无动作时 | 有动作时 |
| --- | --- | --- |
| `hapticSurface` | 内容卡片：保留按压反馈作为主题演示（首页演示块、统计、作品、博客等），不下沉语义仅作可视化 | 传 `onTap`，按压反馈 + 落点（按钮 / 导航 / 直达卡） |
| `hapticTag` | **纯展示徽章**：不注册按压事件，不产生可点暗示 | 传 `onTap`，升级为可按压标签（走 `hapticSurface`） |

> 说明：`hapticTag` 早期实现无论是否传 `onTap` 都会给出按压反馈，而作品 / 博客卡里的
> 分类标签只是展示用，导致「按下去有反应、点了没动作」。已修复为按 `onTap` 有无分流。

### 按压状态放哪

放在页面层（`SitePage.pressStateOf(key)`），同一时刻只有一个元素处于按下态。
在 `attr {}` 块里读取——Kuikly 的 attr 块是响应式的，状态变化时自动重算，**不会重建视图树**，
所以按压动画不会掉帧。

**注意：新增可按压组件时务必保证 `key` 全站唯一。** 当前所有 key 都带前缀
（`nav_*`、`stat_*`、`principle_*`、`work_*`、`tab_*`、`contact_*` 等），
不同板块之间不会互踩，但同板块内重复 key 会互相串。

### 移动端 iOS Safari 的一个小坑

iOS 上 `touchCancel` 偶尔不触发，手指划出按钮范围后 `pressedKey` 不会清空，
会卡在按下态直到下一次点击其他元素。生产环境建议在 `touchmove` 跨过阈值时也调用 `pressUp(key)`。

---

## 五、响应式

`SiteLayout` 根据 `pageData.pageViewWidth` 推导形态：

| 宽度 | 形态 | 导航 | 网格列数 |
| --- | --- | --- | --- |
| ≥ 1024 | Desktop | 左侧固定侧边栏 | 3 列 |
| 640–1023 | Tablet | 顶部标题栏 | 2 列 |
| < 640 | Phone | 顶部标题栏 + 底部 Tab | 1 列 |

PC 上内容区限宽 1080dp 并居中，避免超宽屏下正文被拉成一条超长直线。

窗口尺寸变化时，Web 渲染器会把新尺寸透传给页面，attr 块自动重算、`vif` 自动切换结构，
不需要手动监听 resize。

### Hero 横排的小坑

`flex(1f)` 在嵌套 column + Text 下会被 H5 渲染器算成接近 0 的可用宽度，
导致按字符换行。`HomeSection.kt` 的桌面端 Hero 因此**用显式 `width` 替代了 `flex(1f)`**，
宽度由 `SiteLayout.heroCopyWidth` 推导。

---

## 六、版本与依赖源

### 当前锁定版本

| 组件 | 版本 | 说明 |
| --- | --- | --- |
| Kuikly | 2.26.0-2.1.21 | `${框架版本}-${Kotlin 版本}` |
| Kotlin | 2.1.21 | 2.0.21 + 2.1.21 都发布过，2.1.21 是官方默认 |
| Gradle | 8.14.3 | AGP 8.7.x 要求 Gradle 8.x |
| AGP | 8.7.3 | |
| KSP | 2.1.21-2.0.1 | |
| JDK | 17 | |

换版本时 `gradle.properties` 的 `KUIKLY_VERSION` 与各 `build.gradle.kts` 里的 `kuiklyVersion` 要一起改。

### Kuikly 制品不在 Maven Central

Kuikly 制品发布在 **`com.tencent.kuikly-open`** 组，但**不在** Maven Central 的常规流量里。
实际上：

- Maven Central 的 `com.tencent.kuikly-open` 只有非常旧的历史版本（2.4.2）。
- 腾讯镜像仓库 `https://mirrors.tencent.com/repository/maven-tencent/` 与 GitHub Release 同步（最新 2.26.0）。

`build.gradle.kts` 显式声明了腾讯镜像，所以依赖能解析到。坐标一览：

```kotlin
com.tencent.kuikly-open:core:2.26.0-2.1.21
com.tencent.kuikly-open:core-annotations:2.26.0-2.1.21
com.tencent.kuikly-open:core-ksp:2.26.0-2.1.21
com.tencent.kuikly-open.core-render-web:base:2.26.0-2.1.21
com.tencent.kuikly-open.core-render-web:h5:2.26.0-2.1.21
com.tencent.kuikly-open:core-gradle-plugin:2.26.0-2.1.21
```

（`core-render-android` 原为已删除的 androidApp 宿主所用，H5-only 后不再声明。）

### yarn 下载源

Kotlin/JS 编译时会先下载 yarn，默认从 GitHub Releases 拉。国内网络经常超时，
`gradle.properties` 里已经配置好镜像：

```properties
yarnDownloadBaseUrl=https://ghfast.top/https://github.com/yarnpkg/yarn/releases/download/
```

如果你能直连 GitHub，把这一行注释掉即可。

---

## 七、本机验证情况

| 端 | 状态 | 备注 |
| --- | --- | --- |
| H5 / Web | ✅ 已验证 | 收窄前 H5 三端时代已完成完整验证：构建通过 + 浏览器实测 6 个板块全部渲染、深链可用、24 个按压元素、无运行时错误；收窄为 H5-only 后重新执行 `gradlew.bat :h5App:buildSite`，**BUILD SUCCESSFUL**，产物 `h5App/build/site/index.html` / `h5App.js` / `page/nativevue2.js` 均为最新；2026-09-05 完成「可点才可压」标签语义修复（`hapticTag` 无 `onTap` 时不再注册按压事件）后再次执行 `gradlew.bat :h5App:buildSite`，**BUILD SUCCESSFUL**，产物已更新 |
| Android | ➖ 已移除 | 收窄为 H5-only 时删除 androidApp 宿主，不再构建与维护 |
| 小程序 | ➖ 已移除 | 收窄为 H5-only 时删除 miniApp 宿主，不再构建与维护 |
| iOS | ➖ 已移除 | 收窄为 H5-only 时删除 iosApp 宿主与 README 中"待接入"状态，不再维护（shared 下遗留的 shared.podspec 不参与构建） |
| 鸿蒙 | ➖ 已移除 | 从未接入，不再列入计划 |

---

## 八、常见问题

**Q：为什么整个站点只有一个 Kuikly 页面？**

导航状态常驻（PC 侧边栏 / 手机底部 Tab），切换板块不用重建页面；页面导航由站点自身
管理，不依赖宿主端的路由能力，H5 静态托管时也能用深链直达板块。

**Q：能加图片吗？**

可以。Kuikly 的 `Image` 组件支持网络图和 `ImageUri.pageAssets()` 本地资源。
目前头像和作品封面都用「色块 + 字符」占位，是为了避免引入图片依赖、方便你直接跑起来。

**Q：怎么新增一个板块？**

1. 在 `SiteDataSource.Section` 枚举里加一项
2. 在 `sections/` 下写对应的 `xxxSection(page)` 函数
3. 在 `SitePage.renderSections()` 的 `when` 里接上

侧边导航和底部 Tab 会自动多出一项（它们遍历的是 `Section.entries`）。

**Q：build 卡在 yarn 下载不动？**

检查 `gradle.properties` 的 `yarnDownloadBaseUrl` 是否被注释，或者换别的镜像。
也可以临时手动从 GitHub Releases 下载 `yarn-v1.22.17.tar.gz` 放到
`~/.gradle/caches/.../yarn/1.22.17/` 里。

**Q：`kotlinNpmInstall` 卡住不动（十几分钟没输出）？**

换了 yarn 的下载源还不够——yarn 装 webpack / karma 这些 npm 包时默认走
`registry.yarnpkg.com`，国内会慢到几乎不动（实测 20 分钟零进展）。

本仓库做了两道保险，都已经配好：

1. 仓库根 `.yarnrc`：`registry "https://registry.npmmirror.com/"`
2. `build.gradle.kts` 给 `kotlinNpmInstall` 任务注入 `npm_config_registry` 环境变量
   （优先级高于 `.yarnrc`，可通过 `gradle.properties` 的 `npmRegistry` 覆盖）

配好之后同一份依赖从 20 分钟降到 1 分钟。如果你能直连外网，把这两处删掉即可。

**Q：怎么换 Kotlin 版本？**

把 `gradle.properties` 的 `KOTLIN_VERSION` 改成目标版本（如 `2.0.21`），根 `build.gradle.kts` 的
`kotlin("multiplatform") version`、`id("com.google.devtools.ksp") version`、各模块的
`kuiklyVersion` 一起改。Kuikly 镜像必须有该 Kotlin 版本的制品。
