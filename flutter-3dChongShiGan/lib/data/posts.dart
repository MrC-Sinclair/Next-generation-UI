/// 博客文章（示例占位内容，Markdown 风格文本直接放在 body 中）
class Post {
  final String title;
  final String date;
  final String excerpt;
  final List<String> tags;
  final int gradientIndex;
  final String readTime;
  final String body;
  const Post({
    required this.title,
    required this.date,
    required this.excerpt,
    required this.tags,
    required this.gradientIndex,
    required this.readTime,
    required this.body,
  });
}

const List<Post> posts = [
  Post(
    title: '把「果冻感」写进代码：弹性按压的 3 个技巧',
    date: '2026-08-20',
    excerpt: '为什么有些按钮摸起来「软」，有些却很「硬」？从曲线到阴影，拆解触感的来源。',
    tags: ['动效', 'Flutter', 'UX'],
    gradientIndex: 0,
    readTime: '6 分钟',
    body: '''
# 把「果冻感」写进代码

好的按压反馈不是「缩小一点」那么简单。它包含三个维度：

## 1. 曲线（Curve）
使用 `Curves.elasticOut` 或自定义弹簧曲线，让元素在回弹时轻微过冲，产生「弹」的错觉。

## 2. 阴影
按压时阴影应当变得更近、更实；释放后变远、变虚。这模拟了物理距离的远近。

## 3. 高光
在元件顶部加一条半透明白色高光，是「果冻反光」的灵魂。

把这三件事组合好，你的界面就「可以按」了。
''',
  ),
  Post(
    title: '一套适配 PC / 移动 / 小程序的响应式布局思路',
    date: '2026-07-30',
    excerpt: '不用写六套代码。用一个断点系统和一套组件，覆盖所有屏幕。',
    tags: ['响应式', '架构'],
    gradientIndex: 1,
    readTime: '9 分钟',
    body: '''
# 一套布局，多端复用

核心只有两件事：

- **断点（Breakpoint）**：用宽度而非设备判断布局。
- **组件自适应**：同一个卡片组件，在宽屏并排、窄屏堆叠。

剩下的交给 `MediaQuery` 与 `LayoutBuilder`。
''',
  ),
  Post(
    title: '我用 Flutter 做一个个人网站，踩了这些坑',
    date: '2026-06-15',
    excerpt: 'Web 渲染、字体、首屏体积——记录一次完整的 Flutter Web 上线。',
    tags: ['Flutter', 'Web'],
    gradientIndex: 2,
    readTime: '7 分钟',
    body: '''
# Flutter Web 上线笔记

- 首屏体积要控：按需拆分、减少依赖。
- 字体用系统字体栈，避免网络字体阻塞。
- `canvaskit` 渲染更稳，但需注意 CDN。
''',
  ),
  Post(
    title: '动效不是装饰，是信息的节奏',
    date: '2026-05-02',
    excerpt: '当动画承担起「引导注意力」的职责，它才真正有价值。',
    tags: ['动效', '设计'],
    gradientIndex: 3,
    readTime: '5 分钟',
    body: '''
# 动效即节奏

入场动画告诉用户「这是什么」，退场动画告诉用户「去哪了」。
让动画承载信息，而不是掩盖延迟。
''',
  ),
  Post(
    title: '从设计稿到组件库：我的工作流',
    date: '2026-03-18',
    excerpt: 'Figma 变量 → Dart 主题 → 组件，三层映射如何保持一致。',
    tags: ['设计系统', 'Figma'],
    gradientIndex: 4,
    readTime: '8 分钟',
    body: '''
# 设计到代码的映射

把颜色、圆角、阴影抽象为 Token，在 Figma 与代码中用同一套命名，是保持一致的秘诀。
''',
  ),
  Post(
    title: '写给工程师的审美入门',
    date: '2026-02-10',
    excerpt: '审美不是天赋，是可训练的感知。给工程同学的几本入门口粮。',
    tags: ['成长', '审美'],
    gradientIndex: 5,
    readTime: '6 分钟',
    body: '''
# 审美可以训练

多看、多拆、多临摹。把喜欢的作品「 reverse engineer」一遍，收获远超阅读教程。
''',
  ),
];
