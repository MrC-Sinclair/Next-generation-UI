/* ============================================================
 *  内容数据源 —— 全站所有文案都在这里，改这一个文件就能换成你自己的
 *  （真机端与 Web 端共用，零图片依赖：头像用色块拼接，图标用字符）
 * ============================================================ */

import {C} from '../theme/tokens';

/* -------------------- 关于我 -------------------- */
export const profile = {
  name: '林可乐',
  enName: 'KOLA LIN',
  handle: '@kola',
  role: '全栈产品工程师',
  roleEn: 'Product Engineer',
  location: '中国 · 杭州',
  timezone: 'UTC+8',
  availability: '档期开放 · 接受远程协作',
  /** 头像：不依赖图片资源，用首字 + 撞色底 */
  avatarText: '可',
  avatarBg: C.magenta,
  avatarRing: C.yellow,

  tagline: '把复杂的东西，\n做成让人忍不住点一下的界面。',
  /** 巨型标题的分段着色：哪几个字要用撞色高亮，这里说了算 */
  taglineParts: [
    {t: '把复杂的东西，\n做成让人忍不住'},
    {t: '点一下', c: C.magenta},
    {t: '的界面。'},
  ],

  heroKeywords: ['REACT NATIVE', '跨平台架构', '动效', '设计系统'],

  /** 一句话自检表，首页滚动展示 */
  marquee: [
    'PIXEL PERFECT',
    '60 FPS',
    'ONE CODEBASE / 5 PLATFORMS',
    'SHIP FAST',
    '超色彩主义',
    'DESIGN IN CODE',
  ],

  summary: [
    '我是林可乐，一个把「写代码」和「做设计」当成同一件事的人。八年来一直在跨平台这条路上折腾：从最早的 Hybrid，到 React Native，再到现在一套代码跑 PC、Android、iOS、鸿蒙和小程序。',
    '我信奉的设计哲学很简单：屏幕上的每一个像素都应该有理由存在。所以我偏好高饱和的撞色、粗描边、硬阴影——把信息层级做得足够粗暴，让人一眼就看懂，而不是靠克制去显得高级。',
    '工作之外，我在做一个叫 CHROMA 的配色实验项目，收集城市里被忽略的高饱和色块：工地围挡、便利店招牌、夜市灯牌。它们比任何设计趋势报告都更真实。',
  ],

  stats: [
    {value: '8', unit: '年', label: '工程经验', color: C.magenta},
    {value: '40', unit: '+', label: '上线项目', color: C.cyan},
    {value: '5', unit: '端', label: '一套代码', color: C.yellow},
    {value: '12', unit: 'k', label: '开源 Star', color: C.violet},
  ],

  /** 经历时间线 */
  timeline: [
    {
      year: '2024 — 现在',
      title: '独立产品工程师',
      org: 'CHROMA STUDIO',
      desc: '一个人从设计到上架，做跨平台产品与咨询。主力技术栈 React Native + react-native-web，交付过鸿蒙与小程序双端项目。',
      color: C.magenta,
    },
    {
      year: '2021 — 2024',
      title: '跨平台技术负责人',
      org: '某出行平台',
      desc: '带 6 人小组把主 App 从原生 + H5 混合迁到 React Native，首屏从 2.1s 降到 0.9s，崩溃率下降 76%。',
      color: C.cyan,
    },
    {
      year: '2019 — 2021',
      title: '高级前端工程师',
      org: '某内容社区',
      desc: '负责创作工具链路，做了可视化搭建系统与主题引擎，让运营同学能自助产出活动页。',
      color: C.yellow,
    },
    {
      year: '2017 — 2019',
      title: '前端工程师',
      org: '某电商中台',
      desc: '从写后台表单开始，逐渐迷上动效与交互细节，也是那时候开始写自己的组件库。',
      color: C.violet,
    },
  ],

  /** 工作方式 / 价值观 */
  values: [
    {
      icon: '◐',
      title: '先做出来，再做好看',
      desc: '能跑起来的原型比十页 PPT 更有说服力。我习惯第一天就把东西丢到真机上看。',
      color: C.magenta,
    },
    {
      icon: '◈',
      title: '设计即代码',
      desc: '拒绝"设计稿 - 还原度"的拉扯。间距、色板、字阶都写进 token，改一处全端生效。',
      color: C.cyan,
    },
    {
      icon: '◉',
      title: '性能是功能',
      desc: '再好看的界面，掉帧就是掉分。60fps 和 200ms 内的反馈，是我给自己划的及格线。',
      color: C.yellow,
    },
    {
      icon: '◆',
      title: '把复杂留给自己',
      desc: '用户看到的应该是一个按钮，而不是一套配置。抽象的成本我承担。',
      color: C.lime,
    },
  ],

  /** 最近在做什么 */
  now: [
    {label: '在做', text: 'CHROMA 配色工具 · 内测中', color: C.magenta},
    {label: '在学', text: '鸿蒙 ArkUI 与 RN-OH 渲染管线', color: C.cyan},
    {label: '在读', text: '《The Design of Everyday Things》', color: C.yellow},
    {label: '在听', text: 'City Pop 与 90 年代香港电子', color: C.violet},
  ],

  hobbies: ['胶片摄影', '城市漫步', '配色收集', '机械键盘', '手冲咖啡', '旧杂志扫描'],
};

/* -------------------- 技能栈 -------------------- */
export interface SkillItem {
  name: string;
  level: number; // 0 - 100
  note: string;
}
export interface SkillGroup {
  group: string;
  color: string;
  desc: string;
  items: SkillItem[];
}

export const skills: SkillGroup[] = [
  {
    group: '跨端工程',
    color: C.magenta,
    desc: '一套代码，五个端。这是我吃饭的家伙。',
    items: [
      {name: 'React Native', level: 95, note: '8 年 · 从 0.5x 用到 0.7x'},
      {name: 'react-native-web', level: 92, note: 'PC 端适配与性能调优'},
      {name: 'TypeScript', level: 90, note: '类型体操适度，可读性优先'},
      {name: '鸿蒙 RN-OH / ArkUI', level: 72, note: '已完成 2 个商业项目适配'},
      {name: '小程序（Taro）', level: 80, note: '微信 / 支付宝双端'},
    ],
  },
  {
    group: '界面与动效',
    color: C.cyan,
    desc: '静态好看只是入场券，动起来才叫设计。',
    items: [
      {name: 'Reanimated / 共享元素', level: 88, note: '手势驱动的连续动画'},
      {name: '设计系统与 Token', level: 93, note: '多主题 / 多品牌换肤'},
      {name: 'Skia / 自定义绘制', level: 70, note: '图表、粒子、滤镜'},
      {name: 'Figma → 代码工作流', level: 85, note: '变量与组件映射'},
    ],
  },
  {
    group: '工程化',
    color: C.yellow,
    desc: '让团队里其他人也能安心提交代码。',
    items: [
      {name: 'Metro / Webpack / Vite', level: 86, note: '多端产物与分包'},
      {name: 'CI/CD 与热更新', level: 82, note: 'CodePush / 自建灰度'},
      {name: '性能与稳定性', level: 84, note: '启动优化、内存、崩溃治理'},
      {name: 'Node / BFF', level: 75, note: '接口聚合与边缘函数'},
    ],
  },
  {
    group: '产品与协作',
    color: C.violet,
    desc: '技术是手段，解决问题才是目的。',
    items: [
      {name: '需求拆解与原型', level: 80, note: '和用户一起定义问题'},
      {name: '数据驱动迭代', level: 74, note: '埋点、A/B、漏斗'},
      {name: '技术写作与分享', level: 78, note: '博客 / 内部分享'},
    ],
  },
];

/* -------------------- 作品集 -------------------- */
export interface Work {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  category: 'App' | '设计' | '开源' | '体验';
  desc: string;
  metric: string;
  color: string;
  tags: string[];
  link: string;
}

export const WORK_CATEGORIES = ['全部', 'App', '设计', '开源', '体验'] as const;

export const works: Work[] = [
  {
    id: 'w1',
    title: 'CHROMA 取色器',
    subtitle: '拍一张照，生成一套可落地的配色',
    year: '2026',
    category: 'App',
    desc: '对着街景拍一张，自动提取高饱和色块并生成可导入 Figma 的色板。支持五端，离线可用。',
    metric: '上线 3 个月 · 8.2 万次取色',
    color: C.magenta,
    tags: ['React Native', 'Skia', '图像算法'],
    link: 'https://example.com/chroma',
  },
  {
    id: 'w2',
    title: 'Pocket Metro',
    subtitle: '为通勤者重做的地铁导航',
    year: '2025',
    category: 'App',
    desc: '把换乘、拥挤度、出口商场信息压进一屏。用色块区分线路，弱网下 0.3s 出结果。',
    metric: '日活 12 万 · 首屏 0.4s',
    color: C.cyan,
    tags: ['RN', '离线缓存', '地图'],
    link: 'https://example.com/metro',
  },
  {
    id: 'w3',
    title: 'Neo UI Kit',
    subtitle: '新粗野主义组件库',
    year: '2025',
    category: '开源',
    desc: '粗描边 + 硬阴影的跨端组件库，42 个组件，Web 与原生共用一份实现与文档。',
    metric: 'GitHub 4.1k Star',
    color: C.yellow,
    tags: ['组件库', '设计系统', 'TS'],
    link: 'https://example.com/neo-ui',
  },
  {
    id: 'w4',
    title: 'Sound Wall',
    subtitle: '把专辑封面做成一面墙',
    year: '2024',
    category: '设计',
    desc: '音乐可视化实验：封面随频谱实时拆解成色块，用手势拖动可以"打乱"整面墙。',
    metric: 'Awwwards 特别提名',
    color: C.violet,
    tags: ['Reanimated', '音频', '交互'],
    link: 'https://example.com/soundwall',
  },
  {
    id: 'w5',
    title: 'One Schedule',
    subtitle: '给团队用的日程拼图',
    year: '2024',
    category: '体验',
    desc: '多人日程的可视化对齐工具。每个人的时间块用一种颜色，冲突自动高亮成荧光色。',
    metric: '被 60+ 小团队使用',
    color: C.lime,
    tags: ['协作', '可视化', '实时同步'],
    link: 'https://example.com/schedule',
  },
  {
    id: 'w6',
    title: 'rn-harmony-bridge',
    subtitle: '鸿蒙端的 RN 能力桥接层',
    year: '2026',
    category: '开源',
    desc: '把鸿蒙的分布式能力、原子化服务封装成 RN 可直接调用的模块，抹平与 iOS/Android 的差异。',
    metric: 'npm 周下载 3.4k',
    color: C.orange,
    tags: ['鸿蒙', '原生模块', '开源'],
    link: 'https://example.com/bridge',
  },
];

/* -------------------- 博客 -------------------- */
export interface Post {
  id: string;
  title: string;
  date: string;
  readingTime: string;
  category: '工程' | '设计' | '随笔';
  excerpt: string;
  color: string;
  tags: string[];
  featured?: boolean;
}

export const POST_CATEGORIES = ['全部', '工程', '设计', '随笔'] as const;

export const posts: Post[] = [
  {
    id: 'p1',
    title: '一套 React Native 代码，我是怎么塞进五个端的',
    date: '2026-08-12',
    readingTime: '12 分钟',
    category: '工程',
    excerpt:
      'PC、Android、iOS、鸿蒙、小程序，听起来像天方夜谭，实际上关键只在三件事：把平台差异收敛到一层、把样式写进 token、以及接受"不是所有端都要长得一样"。这篇讲讲我的分层方式。',
    color: C.magenta,
    tags: ['React Native', '跨平台', '架构'],
    featured: true,
  },
  {
    id: 'p2',
    title: '高饱和不等于脏：撞色配色的 7 条硬规则',
    date: '2026-07-28',
    readingTime: '8 分钟',
    category: '设计',
    excerpt:
      '很多人不敢用高饱和，是因为把它和廉价划了等号。其实问题通常不在颜色本身，而在于明度没有分层、面积没有主次。附上我常用的 12 组撞色配方。',
    color: C.cyan,
    tags: ['配色', '视觉'],
    featured: true,
  },
  {
    id: 'p3',
    title: '把首屏从 2.1s 压到 0.9s：一次真实的 RN 性能优化',
    date: '2026-06-30',
    readingTime: '15 分钟',
    category: '工程',
    excerpt: '分包、预加载、Hermes 字节码、图片管线，以及最后那个让我们多花了两周才发现的元凶——一个被滥用的 Context。',
    color: C.yellow,
    tags: ['性能', 'Hermes', '实战'],
    featured: true,
  },
  {
    id: 'p4',
    title: '鸿蒙适配踩坑记：那些文档里没写的事',
    date: '2026-05-18',
    readingTime: '10 分钟',
    category: '工程',
    excerpt: '从 RN-OH 环境搭建到第一个页面跑起来，中间经历了字体缺失、阴影失效、手势冲突。写给准备入坑的朋友。',
    color: C.violet,
    tags: ['鸿蒙', '踩坑'],
  },
  {
    id: 'p5',
    title: '我为什么开始收集工地围挡的颜色',
    date: '2026-04-02',
    readingTime: '6 分钟',
    category: '随笔',
    excerpt: '城市里最有力量的配色，往往不在美术馆，而在路边那些没人设计的铁皮和灯箱上。',
    color: C.lime,
    tags: ['观察', '灵感'],
  },
  {
    id: 'p6',
    title: '动效的分寸感：什么时候该停，什么时候该冲',
    date: '2026-02-20',
    readingTime: '9 分钟',
    category: '设计',
    excerpt: '动效不是越多越好。我用三个维度判断：反馈、引导、叙事。缺一个都值得删掉重做。',
    color: C.orange,
    tags: ['动效', '交互'],
  },
];

/* -------------------- 联系方式 -------------------- */
export interface ContactItem {
  key: string;
  label: string;
  value: string;
  color: string;
  icon: string;
  /** 可复制 */
  copyable?: boolean;
}

export const contacts: ContactItem[] = [
  {key: 'email', label: '邮箱', value: 'hi@kola.dev', color: C.magenta, icon: '✉', copyable: true},
  {key: 'wechat', label: '微信', value: 'kola_dev', color: C.green, icon: '💬', copyable: true},
  {key: 'phone', label: '电话', value: '+86 138 0000 0000', color: C.cyan, icon: '☎', copyable: true},
  {key: 'github', label: 'GitHub', value: 'github.com/kola-dev', color: C.ink, icon: '⌘', copyable: true},
  {key: 'site', label: '站点', value: 'kola.dev', color: C.yellow, icon: '◈', copyable: true},
  {key: 'location', label: '坐标', value: '中国 · 杭州 · UTC+8', color: C.violet, icon: '◉', copyable: false},
];

export const socials = [
  {label: 'GitHub', short: 'GH', color: C.ink, url: 'https://github.com/'},
  {label: '小红书', short: 'RED', color: C.magenta, url: 'https://xiaohongshu.com/'},
  {label: 'X', short: 'X', color: C.blue, url: 'https://x.com/'},
  {label: '掘金', short: 'JUE', color: C.cyan, url: 'https://juejin.cn/'},
  {label: '公众号', short: 'WX', color: C.green, url: 'https://example.com/'},
];

/* -------------------- 导航 -------------------- */
export interface NavItem {
  key: string;
  label: string;
  en: string;
  color: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  {key: 'home', label: '首页概览', en: 'HOME', color: C.magenta, icon: '◐'},
  {key: 'about', label: '关于我', en: 'ABOUT', color: C.cyan, icon: '◈'},
  {key: 'works', label: '作品集', en: 'WORKS', color: C.yellow, icon: '◆'},
  {key: 'skills', label: '技能栈', en: 'SKILLS', color: C.violet, icon: '◉'},
  {key: 'blog', label: '博客', en: 'BLOG', color: C.lime, icon: '▤'},
  {key: 'contact', label: '联系方式', en: 'CONTACT', color: C.orange, icon: '✉'},
];

export type ScreenKey = (typeof NAV_ITEMS)[number]['key'];
