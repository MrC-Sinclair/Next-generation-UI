---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 40c8af801da8629c99b9e5611c578fea_5dd97cdda88b11f1be88525400aeaaa3
    ReservedCode1: 4OgsK5LKw6NiYUlZ2wlbBx0r+U/27hyhDbiA3pc8u96MlEUnSdrBegyMGTV251UTlcUWrfFiyJ/i9N28ppM+M+cJ82KDytiWtxBJzduVLE4unCCy7/pyCMbAXOGZn9OW2/rqdKRYfb+wJKNkjxQgMpBcpuOImCUKxaE7zfakzKqRAl0MAXlckrdwmkU=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 40c8af801da8629c99b9e5611c578fea_5dd97cdda88b11f1be88525400aeaaa3
    ReservedCode2: 4OgsK5LKw6NiYUlZ2wlbBx0r+U/27hyhDbiA3pc8u96MlEUnSdrBegyMGTV251UTlcUWrfFiyJ/i9N28ppM+M+cJ82KDytiWtxBJzduVLE4unCCy7/pyCMbAXOGZn9OW2/rqdKRYfb+wJKNkjxQgMpBcpuOImCUKxaE7zfakzKqRAl0MAXlckrdwmkU=
---

# 触感 · 个人主页（flutter_3d_site）

基于 **Flutter（Web）** 的个人主页项目，以「3D 果冻 / 充实质感」为视觉主线：体积组件采用**实时 Fragment Shader 光照**（偏置光源点 + 内阴影近似 + 镜面高光 + 菲涅尔边缘光），配合鼠标**透视倾斜（Tilt3D）**、**弹簧物理回弹**、玻璃拟态与动态 Blob 背景，展示个人信息、作品集、技能栈与博客。

> 交互提示：桌面端将鼠标移入卡片、按钮、导航项与头像区域即可体验 3D 透视跟随；点击按钮会触发果冻「压缩—过冲—振荡—收敛」的真实弹簧回弹。

## 功能

- **六页导航**：首页 / 关于我 / 作品集 / 技能栈 / 博客 / 联系方式
- **首页**：shader 光照 Hero 果冻主球（带漂浮图标）、最新项目预览、快捷入口
- **关于我**：个人档案、时间线、在意的事（价值观）
- **作品集**：项目卡片网格（技术标签 + 描述），博客文章弹窗
- **联系**：留言表单（本地 SnackBar 反馈）、社交渠道列表
- **响应式布局**：桌面侧边导航 / 移动端底部导航 + 抽屉自适应
- **动效细节**：Blob 背景漂移、RevealOnLoad 渐入、弹簧果冻按压、导航切换过渡

## 3D / 果冻质感技术实现

| 手法 | 实现方式 |
|---|---|
| 体积光照 | 自定义 GLSL `assets/shaders/jelly_shader.frag`：以矩形中心为原点的凸透镜高度场生成表面法线，叠加**偏置点光源漫反射**、**Blinn-Phong 镜面高光**、近边缘暗弧的**内阴影近似**、基于 `1-N.z` 的**菲涅尔边缘光**，替代早期纯多层装饰渐变堆叠 |
| 高光重投影 | `TiltVolumeBox` 将倾角实时折算为光源位移，hover 时高光与阴影随倾斜方向移动；`VolumeBox` 内部高光斑/暗弧收口始终跟随 `lightOffset` |
| 透视倾斜 | `Tilt3D`（Matrix4 透视 + rotateX/rotateY + 弹性收敛）覆盖首页 Hero、作品卡、快捷卡、数据卡、博客卡、技能卡、导航项、社交图标、头像、按钮等全站主要元素 |
| 物理回弹 | `JellyButton` 使用 `SpringSimulation`（二阶阻尼弹簧）驱动按压缩放与投影收缩，具备真实果冻的过冲振荡；替换早期固定 `elasticOut` 曲线 |
| 图标字形立体化 | `EmbossIcon` 通过错位深影层 + 上亮下暗渐变字形 + 顶部细亮边，让 glyph 自身呈现浮雕凸起/凹陷体积 |
| 玻璃拟态 | `GlassCard` / `AppTheme.glass`：`BackdropFilter` 毛玻璃 + 半透明白描边 |
| 动态景深背景 | `BlobBackground` 多色光斑漂移，为页面提供纵深气氛 |
| 降级兜底 | shader 加载失败 / 未就绪时，`VolumeBox` 自动回退到体积径向渐变 + 顶部高光斑 + 底部暗弧收口 + 白描边 + 彩色投影，保证视觉不塌陷 |

## 技术栈

- Flutter Web（响应式自适应布局）
- 纯 Dart 自绘 UI（无第三方 UI 依赖）
- 数据层以静态模型（profile / projects / skills / posts）驱动

## 环境要求

- **Flutter SDK**：stable 通道，内置 **Dart SDK ≥ 3.13.2**（对应 `pubspec.yaml` 的 `environment: sdk: ^3.13.2`）。建议直接使用当前最新稳定版，用 `flutter --version` 可确认内置 Dart 版本是否满足。
- **依赖清单**：无第三方 UI 运行时依赖。运行时仅依赖 `flutter`（SDK）与 `cupertino_icons`；开发依赖为 `flutter_test`、`flutter_lints`（版本见 `pubspec.yaml` / `pubspec.lock`）。
- **Chrome**：`flutter run -d chrome` 需要本机安装 Chrome 浏览器。
- 首次获取依赖：`flutter pub get`（`pubspec.lock` 已提交，通常可直接还原锁定的版本）。

## 平台支持（重要）

本仓库是 **Web-only 项目**：顶层只生成 `web/` 平台壳层，**没有 `android/`、`ios/`、`windows/`、`linux/`、`macos/` 目录**（`.metadata` 也只注册了 web 平台）。
- 不要直接运行 `flutter run -d windows`、`flutter build apk` 等命令，缺少对应平台目录会报错。
- 如需新增桌面 / 移动平台：在项目根目录执行 `flutter create --platforms=windows,android,ios .` 补生成平台目录（不影响现有 `lib/` 代码），再按对应平台运行。

## Shader 与 Web 渲染后端（最容易踩坑）

本项目的「3D 果冻受光体」依赖自定义 GLSL Fragment Shader，在 Web 上有一处关键约束：

- **Shader 文件位置**：`assets/shaders/jelly_shader.frag`，已在 `pubspec.yaml` 的 `flutter: shaders:` 中声明，**两个位置缺一不可**。
- **加载时机**：`main.dart` 启动时先 `await JellyShaderProgram.ensureLoaded()`，通过 `FragmentProgram.fromAsset` 预编译 shader；内部 catch 失败并置空，**不会阻塞启动**。
- **Web 渲染后端差异**：Fragment Shader **仅支持 CanvasKit（默认）与 Skwasm 渲染后端，HTML renderer 不支持**（`FragmentProgram.fromAsset` 会抛错）。新版 Flutter 默认即 CanvasKit，正常 `flutter run -d chrome` / `flutter build web` 无需额外参数；**切勿以 `--web-renderer html` 运行或构建**，否则 shader 光照会丢失。
- **降级兜底逻辑**：shader 未加载成功时，`VolumeBox` 自动回退到「体积径向渐变 + 顶部高光斑 + 底部暗弧收口 + 白描边 + 彩色投影」装饰方案（见 `lib/widgets/jelly.dart`），页面不会白屏，只是失去实时光照质感。
- **快速验证 shader 是否生效**：首页 Hero 果冻主球应能看到「偏置点光源高光 + 近边缘暗弧 + 菲涅尔边缘光」，且 hover 倾斜时高光随光源位移移动；若主球只是静态渐变、无光源变化，说明走了降级分支，请优先排查渲染后端。

## 目录结构

```
lib/
├── main.dart                 # 应用入口：预编译 shader 后启动
├── data/                     # 静态数据模型与内容
│   ├── profile.dart
│   ├── projects.dart
│   ├── skills.dart
│   └── posts.dart
├── pages/                    # 6 个导航页面
├── widgets/                  # 通用组件（JellyButton、VolumeBox、Tilt3D、
│   │                         #   TiltVolumeBox、EmbossIcon、GlassCard 等）
└── theme/                    # 配色、渐变、文本样式
assets/
├── shaders/
│   └── jelly_shader.frag     # 果冻受光体 Fragment Shader（pubspec 中声明）
└── fonts/
    └── simhei.ttf            # 本地中文字体（SimHei，避免 Web 依赖系统字体/联网下载）
docs/
└── screenshots/              # 运行效果预览图（详见文末「效果预览」）
test/
└── widget_test.dart          # 首页冒烟 + 导航切换测试
web/                          # Web 壳层（index.html / manifest.json）
```

## 运行

```bash
flutter pub get              # 获取依赖（首次运行前执行）
flutter run -d chrome        # 浏览器运行（Web；开发调试用）
flutter analyze              # 静态检查
flutter test                 # 运行测试
flutter build web            # 构建 Web 产物（产物在 build/web）
```

**注意**：
- 改动 `assets/` 下任何资源（字体 `simhei.ttf`、shader、图片）后，`flutter run` 的热重载**不会加载新 asset**：需停止进程重新 `flutter run`（或热重载中按 `R` 整页重启）；`flutter build web` 全量构建不受此限制。
- 中文字体 `SimHei` 已随 assets 打包，**不依赖系统字体或 Google Fonts 联网下载**，离线环境也能正常渲染中文。
- 构建并预览产物：`flutter build web` 后可用任意静态服务器托管 `build/web`，如 `python -m http.server 8080 -d build/web`，浏览器访问 `http://localhost:8080`。
- 运行结果是否正常，可对照下方「效果预览」截图判断。

## 效果预览

仓库内置 4 张渲染截图（`docs/screenshots/`），可作为「运行结果是否正确」的视觉基准：

| 截图 | 场景 |
|---|---|
| [shot1_home_1440x900.png](docs/screenshots/shot1_home_1440x900.png) | 桌面首页 1440×900 |
| [shot2_home_tall_1440x2000.png](docs/screenshots/shot2_home_tall_1440x2000.png) | 桌面长页 1440×2000 |
| [shot3_home_tablet_1024x1000.png](docs/screenshots/shot3_home_tablet_1024x1000.png) | 平板宽度 1024×1000 |
| [shot4_mobile_400x900.png](docs/screenshots/shot4_mobile_400x900.png) | 手机宽度 400×900 |

> 截图是静态画面；hover 透视倾斜与果冻回弹为动态效果，请在浏览器中实际体验。

## 自定义内容

所有展示内容（姓名、简介、作品、技能、博客文章）集中在 `lib/data/` 下的静态模型中，直接修改对应文件即可，无需改动页面代码。
*（内容由AI生成，仅供参考）*
