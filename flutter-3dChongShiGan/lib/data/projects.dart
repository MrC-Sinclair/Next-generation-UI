/// 作品集（示例占位内容）
class Project {
  final String title;
  final String desc;
  final List<String> tags;
  final int gradientIndex;
  final String metric;
  const Project({
    required this.title,
    required this.desc,
    required this.tags,
    required this.gradientIndex,
    required this.metric,
  });
}

const List<Project> projects = [
  Project(
    title: 'Jelly UI Kit',
    desc: '一套 3D 果冻质感的 Flutter 组件库，内置弹性按压与光泽反馈。',
    tags: ['Flutter', 'Design System', '动效'],
    gradientIndex: 0,
    metric: '12k 下载',
  ),
  Project(
    title: 'Aurora 数据看板',
    desc: '面向运营团队的实时可视化看板，支持多端自适应布局。',
    tags: ['Web', 'D3', '实时'],
    gradientIndex: 1,
    metric: '日活 8k',
  ),
  Project(
    title: 'Pocket 记账本',
    desc: '主打「触感」的极简记账小程序，每一次点击都有果冻反馈。',
    tags: ['小程序', 'UX', '动画'],
    gradientIndex: 2,
    metric: '4.9 评分',
  ),
  Project(
    title: 'Nova 写作工具',
    desc: '沉浸式 Markdown 编辑器，专注模式与云同步开箱即用。',
    tags: ['Desktop', 'Electron', '编辑器'],
    gradientIndex: 3,
    metric: 'GitHub 2.1k',
  ),
  Project(
    title: 'Holo 3D 相册',
    desc: '基于 WebGL 的 3D 照片墙，支持手势旋转与景深过渡。',
    tags: ['WebGL', '3D', '交互'],
    gradientIndex: 4,
    metric: '获奖作品',
  ),
  Project(
    title: 'Pulse 健康助手',
    desc: '将可穿戴数据转化为温柔的视觉反馈，陪伴式健康记录。',
    tags: ['iOS', 'HealthKit', '动效'],
    gradientIndex: 5,
    metric: 'AppStore 推荐',
  ),
];
