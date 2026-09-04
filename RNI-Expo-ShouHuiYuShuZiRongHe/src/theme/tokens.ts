/**
 * 手绘设计系统 · 令牌
 * 风格：手绘与数字融合 —— 纸张、碳笔、马克笔
 */

export const Palette = {
  /** 米黄纸底 */
  paper: '#F6F1E7',
  /** 纸的暗部（卡片叠层） */
  paperDeep: '#EFE7D8',
  /** 碳笔墨色 */
  ink: '#2E2A25',
  /** 铅笔灰（次级文字，深一档保证小字可读） */
  pencil: '#544D3F',
  /** 朱红马克笔（主强调） */
  markerRed: '#B74720',
  /** 群青马克笔（次强调/链接） */
  markerBlue: '#345E86',
  /** 苔绿马克笔（完成状态） */
  markerGreen: '#4E7A6B',
  /** 藤黄荧光笔（高亮底色） */
  highlighter: '#F4D06F',
  /** 便利贴黄 */
  stickyYellow: '#F6E3A1',
  /** 便利贴粉 */
  stickyPink: '#F2D8D5',
  /** 便利贴蓝 */
  stickyBlue: '#D9E6F0',
  /** 胶带色 */
  tape: 'rgba(214, 200, 160, 0.55)',
  /** 手绘描边通用色 */
  stroke: '#3A352E',
} as const;

export const TypeScale = {
  /** Hero 手写大字（Caveat/文楷） */
  hero: 64,
  heroLine: 70,
  /** 区块标题 */
  h1: 40,
  h1Line: 48,
  /** 卡片标题 */
  h2: 28,
  h2Line: 34,
  /** 正文 */
  body: 17,
  bodyLine: 28,
  /** 注释小字 */
  caption: 14,
  captionLine: 20,
} as const;

export const Space = {
  xs: 6,
  sm: 10,
  md: 18,
  lg: 28,
  xl: 44,
  xxl: 72,
} as const;

export const Layout = {
  /** 桌面内容最大宽度 */
  maxContent: 980,
  /** 进入双栏布局的断点 */
  wideBreak: 760,
} as const;

/** 字体族名（与 use-fonts 注册一致） */
export const FontFamily = {
  /** 英文手写标题 */
  hand: 'Caveat',
  /** 英文手写正文 */
  handBody: 'PatrickHand',
  /** 中文手写正文（霞鹜文楷） */
  kai: 'LXGWWenKai',
  /** 中文手写加重 */
  kaiBold: 'LXGWWenKaiMedium',
} as const;
