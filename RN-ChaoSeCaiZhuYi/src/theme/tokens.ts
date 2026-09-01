import {Platform, ShadowStyleIOS, ViewStyle} from 'react-native';

/* ============================================================
 *  CHROMA · 超色彩主义设计系统
 *  高饱和撞色 + 荧光点缀 + 新粗野主义（粗描边 / 硬阴影 / 大字号）
 *  所有端（PC / Android / iOS / 鸿蒙 / 小程序）共用同一套 token
 * ============================================================ */

/** 主色板：高饱和撞色 */
export const C = {
  /** 墨底：所有描边与正文的基色 */
  ink: '#0D0620',
  inkSoft: '#2A1B4D',
  /** 纸底：暖白，比纯白更有印刷感 */
  paper: '#FFF6E9',
  paperDeep: '#FFE9C9',
  white: '#FFFFFF',

  /** 五大撞色主色 */
  magenta: '#FF2E88',
  cyan: '#00E0FF',
  yellow: '#FFD400',
  violet: '#7C3AED',
  lime: '#B8FF2E',

  /** 荧光点缀色 */
  orange: '#FF5A1F',
  green: '#00D98B',
  blue: '#2B5CFF',
  pink: '#FF8FB1',
  purple: '#C04CFF',
} as const;

/** 撞色循环：给卡片/标签按顺序发牌，保证画面五光十色但不杂乱 */
export const ACCENTS = [C.magenta, C.cyan, C.yellow, C.violet, C.lime, C.orange, C.green, C.blue] as const;

export const pickAccent = (i: number) => ACCENTS[((i % ACCENTS.length) + ACCENTS.length) % ACCENTS.length];

/** 间距：4 的倍数 */
export const S = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/** 圆角：刻意用不规则数值，制造手工贴纸感 */
export const R = {
  none: 0,
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

/** 描边：新粗野主义的灵魂，一定要"粗" */
export const BORDER = {
  thin: 2,
  base: 3,
  thick: 4,
  heavy: 6,
} as const;

/** 字体：Web 用 Archivo Black + Space Grotesk，原生端回落系统字体 */
export const FONT = {
  display:
    Platform.OS === 'web'
      ? '"Archivo Black", "Arial Black", "PingFang SC", "Microsoft YaHei", sans-serif'
      : undefined,
  body:
    Platform.OS === 'web'
      ? '"Space Grotesk", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif'
      : undefined,
  mono: Platform.OS === 'web' ? '"Space Grotesk", ui-monospace, Menlo, Consolas, monospace' : 'monospace',
} as const;

/** 字重（原生端靠 weight 撑气场，Web 靠字体本身） */
export const W = {
  regular: '400',
  medium: '500',
  bold: '700',
  black: Platform.OS === 'web' ? '400' : '900',
} as const;

/* ---------------- 硬阴影（跨端） ---------------- */
type ShadowResult = ViewStyle & ShadowStyleIOS;

/**
 * 硬阴影：无模糊、纯位移的实心投影。
 * Web 用 boxShadow 精确还原，原生端用 shadowOffset + elevation。
 */
export function hardShadow(offset = 6, color: string = C.ink, spread = 0): ShadowResult {
  if (Platform.OS === 'web') {
    const ring = spread > 0 ? `0 0 0 ${spread}px ${color}, ` : '';
    return {boxShadow: `${ring}${offset}px ${offset}px 0px ${color}`} as any;
  }
  return {
    shadowColor: color,
    shadowOffset: {width: offset, height: offset},
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: Math.min(offset, 12),
  } as any;
}

/** 荧光发光：Web 用真实光晕，原生端退化为同色硬阴影 */
export function glowShadow(color: string, blur = 24, offset = 0): ShadowResult {
  if (Platform.OS === 'web') {
    return {boxShadow: `${offset}px ${offset}px ${blur}px ${color}`} as any;
  }
  return {
    shadowColor: color,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: Math.min(blur / 3, 12),
    elevation: 6,
  } as any;
}

/** 纯 Web 的鼠标手型（原生端会被忽略，无副作用） */
export const cursorPointer = Platform.OS === 'web' ? ({cursor: 'pointer'} as any) : {};

/** 禁用 Web 端文字选中（用于导航、按钮） */
export const noSelect = Platform.OS === 'web' ? ({userSelect: 'none'} as any) : {};
