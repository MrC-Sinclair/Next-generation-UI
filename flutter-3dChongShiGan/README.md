# 触感 · 个人主页（flutter_3d_site）

基于 **Flutter（Web）** 的个人主页项目，以「3D 果冻质感」为视觉主线，结合动态 Blob 背景、弹性按钮、浮层动画与渐变霓虹配色，展示个人信息、作品集、技能栈与博客。

## 功能

- **六页导航**：首页 / 关于我 / 作品集 / 技能栈 / 博客 / 联系方式
- **首页**：果冻质感 Hero 视觉（漂浮图标动画）、最新项目预览、快捷入口
- **关于我**：个人档案、时间线、在意的事（价值观）
- **作品集**：项目卡片网格（技术标签 + 描述），博客文章弹窗
- **联系**：留言表单（本地 SnackBar 反馈）、社交渠道列表
- **响应式布局**：桌面侧边导航 / 移动端底部导航 + 抽屉自适应
- **动效细节**：Blob 背景漂移、RevealOnLoad 渐入、果冻按压缩放、导航切换过渡

## 技术栈

- Flutter Web（响应式自适应布局）
- 纯 Dart 自绘 UI（无第三方 UI 依赖）
- 数据层以静态模型（profile / projects / skills / posts）驱动

## 目录结构

```
lib/
├── main.dart                 # 应用入口与主题
├── data/                     # 静态数据模型与内容
│   ├── profile.dart
│   ├── projects.dart
│   ├── skills.dart
│   └── posts.dart
├── pages/                    # 6 个导航页面
├── widgets/                  # 通用组件（JellyButton、SectionTitle、卡片等）
└── theme/                    # 配色、渐变、文本样式
test/
└── widget_test.dart          # 首页冒烟 + 导航切换测试
web/                          # Web 壳层（index.html / manifest.json）
```

## 运行

```bash
flutter pub get
flutter run -d chrome      # 浏览器运行
flutter analyze            # 静态检查
flutter test               # 运行测试
flutter build web          # 构建 Web 产物
```

## 自定义内容

所有展示内容（姓名、简介、作品、技能、博客文章）集中在 `lib/data/` 下的静态模型中，直接修改对应文件即可，无需改动页面代码。
