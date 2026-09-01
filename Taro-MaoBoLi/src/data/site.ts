/**
 * 站点内容配置
 * ─────────────────────────────────────────────
 * 全部文案 / 数据集中在此，改这一个文件即可换成你自己的主页。
 */

export type Accent = 'cyan' | 'blue' | 'violet' | 'magenta'

export interface Profile {
  /** 中文名 */
  name: string
  /** 英文名 / 拼音 */
  nameEn: string
  /** 头像占位字母（不依赖任何图片资源，跨端最稳） */
  monogram: string
  /** 主标题 */
  title: string
  /** 一句话简介 */
  tagline: string
  /** 详细介绍 */
  intro: string
  city: string
  /** 当前状态，如「开放合作中」 */
  status: string
}

export interface Stat {
  value: string
  label: string
}

export interface Social {
  key: string
  label: string
  value: string
  /** 点击后复制到剪贴板的值（小程序/鸿蒙不支持外链跳转时兜底） */
  copy?: string
}

export interface Milestone {
  year: string
  role: string
  org: string
  desc: string
}

export interface SkillItem {
  name: string
  /** 0 - 100 */
  level: number
}

export interface SkillGroup {
  name: string
  accent: Accent
  desc: string
  items: SkillItem[]
}

export interface Project {
  id: string
  name: string
  subtitle: string
  desc: string
  year: string
  metric: string
  metricLabel: string
  accent: Accent
  tags: string[]
  featured?: boolean
}

export interface Post {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  accent: Accent
}

export interface ContactItem {
  key: string
  label: string
  value: string
  copy: string
}

/* ══════════════════ 内容 ══════════════════ */

export const profile: Profile = {
  name: '林亦舟',
  nameEn: 'Lin Yizhou',
  monogram: 'YZ',
  title: '全栈 & 跨端工程师',
  tagline: '把复杂的系统，做成顺手的产品',
  intro:
    '6 年一线研发经验，专注跨端架构与体验工程。写过编译器插件，也调过 16ms 的动画帧。相信好的技术是让人感觉不到技术的存在——它应该像水一样，安静地托住用户的每一次点击。',
  city: '中国 · 杭州',
  status: '开放合作中'
}

export const stats: Stat[] = [
  { value: '6', label: '年研发经验' },
  { value: '48', label: '交付项目' },
  { value: '12.8k', label: 'GitHub Stars' },
  { value: '5', label: '端同构' }
]

export const socials: Social[] = [
  { key: 'github', label: 'GitHub', value: 'github.com/yizhou', copy: 'github.com/yizhou' },
  { key: 'juejin', label: '掘金', value: 'juejin.cn/user/yizhou', copy: 'juejin.cn/user/yizhou' },
  { key: 'mail', label: '邮箱', value: 'hi@yizhou.dev', copy: 'hi@yizhou.dev' },
  { key: 'wechat', label: '微信', value: 'yizhou_dev', copy: 'yizhou_dev' }
]

export const milestones: Milestone[] = [
  {
    year: '2024',
    role: '跨端架构负责人',
    org: '星野科技',
    desc: '主导 Taro + ArkTS 五端同构方案，把 3 条产品线收敛为一套代码，发版周期缩短 40%。'
  },
  {
    year: '2022',
    role: '高级前端工程师',
    org: '云栖网络',
    desc: '负责数据可视化中台，从零搭建设计系统与组件库，覆盖 20+ 业务方。'
  },
  {
    year: '2021',
    role: '前端工程师',
    org: '潮汐实验室',
    desc: '做实时协作编辑器，啃 CRDT 与增量同步，把冲突率压到 0.3% 以下。'
  },
  {
    year: '2020',
    role: '入行',
    org: '从一台旧 MacBook 开始',
    desc: '第一次把设计稿还原成页面，从此对「像素级」三个字上瘾。'
  }
]

export const skillGroups: SkillGroup[] = [
  {
    name: '跨端与框架',
    accent: 'cyan',
    desc: '一套代码跑五个端，是我的日常',
    items: [
      { name: 'Taro', level: 96 },
      { name: 'React', level: 94 },
      { name: 'TypeScript', level: 92 },
      { name: 'Vue 3', level: 84 }
    ]
  },
  {
    name: '原生与系统',
    accent: 'violet',
    desc: '需要贴着系统走的时候，也不虚',
    items: [
      { name: 'ArkTS / 鸿蒙', level: 88 },
      { name: 'Swift', level: 72 },
      { name: 'Kotlin', level: 68 },
      { name: 'Rust', level: 60 }
    ]
  },
  {
    name: '工程化',
    accent: 'blue',
    desc: '让团队写得快，也写得稳',
    items: [
      { name: 'Vite / Webpack', level: 90 },
      { name: 'CI / CD', level: 84 },
      { name: 'Monorepo', level: 86 },
      { name: 'Node.js', level: 82 }
    ]
  },
  {
    name: '设计与体验',
    accent: 'magenta',
    desc: '工程师里最较真的那类像素控',
    items: [
      { name: '设计系统', level: 88 },
      { name: '动效设计', level: 85 },
      { name: 'Figma', level: 76 },
      { name: '可访问性', level: 74 }
    ]
  }
]

export const projects: Project[] = [
  {
    id: 'aurora-ui',
    name: 'Aurora UI',
    subtitle: '跨端组件库 · 毛玻璃设计语言',
    desc: '面向五端的组件库，把液态毛玻璃材质抽象成一套可配置 token，内置完整的降级策略。',
    year: '2025',
    metric: '12.8k',
    metricLabel: 'Stars',
    accent: 'cyan',
    tags: ['Taro', 'React', 'Design Token', '多端'],
    featured: true
  },
  {
    id: 'harmony-migrate',
    name: 'Harmony 迁移工具链',
    subtitle: '把存量小程序搬上鸿蒙',
    desc: '静态分析 + 运行时垫片，自动识别不兼容 API 并生成迁移报告，迁移人力下降 70%。',
    year: '2025',
    metric: '70%',
    metricLabel: '人力节省',
    accent: 'violet',
    tags: ['ArkTS', 'AST', 'CLI'],
    featured: true
  },
  {
    id: 'xingye-viz',
    name: '星野云图',
    subtitle: '实时数据可视化平台',
    desc: '支撑日均 4 亿条数据的看板系统，自研增量渲染层，首屏时间从 4.2s 压到 0.9s。',
    year: '2024',
    metric: '4 亿',
    metricLabel: '日均数据',
    accent: 'blue',
    tags: ['Canvas', 'WebGL', '性能优化'],
    featured: true
  },
  {
    id: 'flowlet',
    name: 'Flowlet',
    subtitle: '可视化任务编排引擎',
    desc: '拖拽式工作流编排，节点运行时沙箱化，支持热插拔自定义算子。',
    year: '2023',
    metric: '3.2k',
    metricLabel: 'Stars',
    accent: 'magenta',
    tags: ['DAG', '沙箱', '低代码']
  },
  {
    id: 'liquid-motion',
    name: 'Liquid Motion',
    subtitle: '跨端动效库',
    desc: '统一 H5 / 小程序 / 鸿蒙的动效表现，用同一套时间轴描述 60fps 动画。',
    year: '2023',
    metric: '60fps',
    metricLabel: '满帧保障',
    accent: 'cyan',
    tags: ['动画', 'Bezier', '性能']
  },
  {
    id: 'this-site',
    name: '这个网站',
    subtitle: '液态毛玻璃个人站',
    desc: '你现在看到的这一版。Taro 4 单代码库，同时产出 PC / 安卓 / iOS / 鸿蒙 / 小程序。',
    year: '2026',
    metric: '5',
    metricLabel: '端同构',
    accent: 'violet',
    tags: ['Taro 4', '玻璃拟物', '响应式']
  }
]

export const posts: Post[] = [
  {
    id: 'p1',
    title: 'Taro 4 鸿蒙适配踩坑实录',
    excerpt:
      'ArkTS 不是 TypeScript。聊聊类型系统差异、组件映射的坑，以及那些文档里没写的运行时限制。',
    category: '跨端',
    date: '2026-07-18',
    readTime: '12 min',
    accent: 'violet'
  },
  {
    id: 'p2',
    title: '毛玻璃的正确打开方式',
    excerpt:
      'backdrop-filter 很美，但在小程序和鸿蒙上会失效。一套从真玻璃到假玻璃的完整降级方案。',
    category: '设计工程',
    date: '2026-06-02',
    readTime: '9 min',
    accent: 'cyan'
  },
  {
    id: 'p3',
    title: '一套设计系统如何喂饱 5 个端',
    excerpt: '设计 token 不是换个变量名就完事。关于单位、降级、以及怎么让设计师和工程师说同一种语言。',
    category: '设计系统',
    date: '2026-04-25',
    readTime: '15 min',
    accent: 'magenta'
  },
  {
    id: 'p4',
    title: '16ms 之内：跨端动画性能调优',
    excerpt: '从合成层、重排到 GPU 内存，把掉帧的原因一个个揪出来，再一个个按回去。',
    category: '性能',
    date: '2026-03-11',
    readTime: '11 min',
    accent: 'blue'
  }
]

export const contacts: ContactItem[] = [
  { key: 'mail', label: '邮箱', value: 'hi@yizhou.dev', copy: 'hi@yizhou.dev' },
  { key: 'wechat', label: '微信', value: 'yizhou_dev', copy: 'yizhou_dev' },
  { key: 'github', label: 'GitHub', value: 'github.com/yizhou', copy: 'github.com/yizhou' },
  { key: 'city', label: '坐标', value: '中国 · 杭州', copy: '杭州' }
]

/** CTA 按钮文案 */
export const cta = {
  primary: '看看我的作品',
  secondary: '下载简历'
}
