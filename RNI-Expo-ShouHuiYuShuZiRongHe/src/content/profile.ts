/**
 * 全站内容配置 —— 改这里就够了。
 * 名字、介绍、动态、便利贴，全部集中在 profile 对象里。
 */

export const profile = {
  /** 你的名字（站名 / logo / 自称） */
  name: '阿澈',
  /** 英文昵称（手写体大字用） */
  nameEn: 'A-Che',
  /** 一句话身份 */
  role: '全栈开发者 · 业余写字的人',
  /** 首页手写签名行（英文手写体） */
  tagline: 'a human who builds things',

  /** 首页 hero 简介段 */
  bio: [
    '你好呀，欢迎来到我的小站。',
    '我写代码，也写字；喜欢把想法变成',
    '能跑起来的东西，再给它画上手绘的边。',
  ],

  /** 最近动态（首页便签） */
  now: [
    { label: '正在做', value: '这个手绘小站' },
    { label: '在学', value: 'Rust 与胶片冲扫' },
    { label: '在读', value: '《夜航西飞》' },
  ],

  /** 关于我 · 我的故事 */
  story: [
    '我是一名写代码的人。白天和类型系统讨价还价，晚上偶尔和文字打交道。',
    '相信「做得出来」比「说得漂亮」重要，也相信界面可以同时 {严谨} 和 {有体温}。',
    '这个小站没有像素级对齐，没有渐变和玻璃拟态——',
    '只有纸、笔、和一点点像人留下的痕迹。',
  ],

  /** 关于我 · 一些数字 */
  stats: [
    { num: '6+', unit: '年', label: '写代码' },
    { num: '3', unit: '台', label: '养过的键盘' },
    { num: '∞', unit: '', label: '没写完的草稿' },
    { num: '1024', unit: '杯', label: '咖啡（估）' },
  ],

  /** 关于我 · 便利贴墙 */
  sticky: [
    { color: 'yellow', text: '先跑起来，再变好看。' },
    { color: 'pink', text: '工具是手，不是脑。' },
    { color: 'blue', text: '留一点不完美，' },
  ],

  /** 社交链接（占位，href 换成你的） */
  links: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'Email', href: 'mailto:hi@example.com' },
    { label: 'RSS', href: '#' },
  ],

  /** 页脚签名 */
  footer: '© 2026 阿澈 · 用 Expo 与一支铅笔手写于云端',
} as const;

/* ------------------------------------------------------------------ */
/* 作品集                                                               */
/* ------------------------------------------------------------------ */

export const works = [
  {
    title: 'InkGraph',
    desc: '把手写笔记变成可检索的知识图谱。写了一年多的独立 App，现在每天记东西都靠它。',
    tech: ['React Native', 'TypeScript', 'SQLite'],
    status: 'done' as const,
    statusText: '已上线',
    year: '2025',
  },
  {
    title: 'BleepBLE',
    desc: '给 ESP32 设备写的蓝牙调试工具。起因是自己被串口日志折磨到失眠。',
    tech: ['Rust', 'Flutter'],
    status: 'done' as const,
    statusText: '能用',
    year: '2025',
  },
  {
    title: 'PixelPostcards',
    desc: '把照片变成手绘风明信片再打印邮寄。算法还差最后一步上色，正在磨。',
    tech: ['Python', 'OpenCV'],
    status: 'wip' as const,
    statusText: '进行中',
    year: '2026',
  },
  {
    title: '这个小站',
    desc: '你正在看的这个手绘网站。没有渐变和玻璃拟态，只有纸和笔。',
    tech: ['Expo', 'React Native Web'],
    status: 'wip' as const,
    statusText: '进行中',
    year: '2026',
  },
] as const;

/* ------------------------------------------------------------------ */
/* 技能栈（星级 1-5，自己打的，仅供参考）                                     */
/* ------------------------------------------------------------------ */

export const skillGroups = [
  {
    name: '前端 & 客户端',
    note: '吃饭的手艺',
    items: [
      { name: 'React / React Native', level: 5 },
      { name: 'TypeScript', level: 4 },
      { name: 'CSS & 动效', level: 3 },
      { name: 'Expo 生态', level: 4 },
    ],
  },
  {
    name: '后端 & 工具',
    note: '够用就好',
    items: [
      { name: 'Node.js', level: 4 },
      { name: 'PostgreSQL', level: 3 },
      { name: 'Rust', level: 2, note: '在学' },
    ],
  },
  {
    name: '手艺',
    note: '不赚钱但快乐',
    items: [
      { name: '写字', level: 4 },
      { name: '铅笔速写', level: 3 },
      { name: '手冲咖啡', level: 5 },
    ],
  },
] as const;

/* ------------------------------------------------------------------ */
/* 博客                                                                  */
/* ------------------------------------------------------------------ */

export const posts = [
  {
    date: '2026-08-30',
    title: '为什么我把网站画成手绘风',
    excerpt: '像素级对齐是工业的美，手绘是人的美。聊聊这个小站背后的审美选择，以及怎么用代码假装会画画。',
    tag: '随笔',
  },
  {
    date: '2026-07-12',
    title: 'Expo 静态导出的三个坑',
    excerpt: 'overflow 被锁死、绝对路径资源、子路径路由失配——踩完这一套，我才真正理解了什么叫"静态"。',
    tag: '技术',
  },
  {
    date: '2026-05-03',
    title: '给头像加眨眼动画的 20 行代码',
    excerpt: '一个会眨眼的涂鸦脸，比任何渐变按钮都更像"有人在这里"。实现比你想的简单得多。',
    tag: '技术',
  },
  {
    date: '2026-03-21',
    title: '夜航西飞读后感',
    excerpt: '',
    tag: '读书',
    wip: true as const,
  },
] as const;

/* ------------------------------------------------------------------ */
/* 联系方式                                                              */
/* ------------------------------------------------------------------ */

export const contact = {
  email: 'hi@example.com',
  emailHint: '点一下就复制，或者直接用邮件客户端写给我',
  replyNote: [
    '回信守则：',
    '一、慢回，但必回；',
    '二、约稿和合作先看档期；',
    '三、交个朋友随时欢迎。',
  ],
} as const;

/** story 段落里的 {花括号} 关键词 → 荧光笔高亮 */
export function parseHighlights(text: string): string[] {
  const m = text.match(/\{(.*?)\}/g);
  return m ? m.map((s) => s.slice(1, -1)) : [];
}
