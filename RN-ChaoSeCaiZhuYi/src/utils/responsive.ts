import {useMemo} from 'react';
import {useWindowDimensions} from 'react-native';

/* ============================================================
 *  响应式：一套代码适配 PC 各尺寸 / 平板 / 手机 / 小程序
 * ------------------------------------------------------------
 *  xs  < 600    手机竖屏      1 列，底部 Tab
 *  sm  600-899  手机横屏/折叠  2 列，顶部导航
 *  md  900-1199 小尺寸 PC/平板 2 列，侧边栏（窄）
 *  lg  1200-1599 桌面标准      3 列，侧边栏（宽）
 *  xl  >= 1600  大屏 / 4K     3 列，内容加宽 + 留白更多
 * ============================================================ */

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Layout = 'mobile' | 'tablet' | 'desktop';

export function getBreakpoint(width: number): Breakpoint {
  if (width < 600) return 'xs';
  if (width < 900) return 'sm';
  if (width < 1200) return 'md';
  if (width < 1600) return 'lg';
  return 'xl';
}

export function getLayout(width: number): Layout {
  if (width < 600) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export interface Metrics {
  width: number;
  height: number;
  bp: Breakpoint;
  layout: Layout;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  /** 是否展示左侧固定侧边栏 */
  showSidebar: boolean;
  /** 是否展示底部 Tab 栏（手机 / 小程序形态） */
  showBottomTabs: boolean;
  /** 是否展示顶部横向导航（平板形态） */
  showTopBar: boolean;
  sidebarWidth: number;
  contentMaxWidth: number;
  gutter: number;
  columns: number;
  /** 字号阶梯 */
  type: {
    mega: number; // 首页巨型标题
    h1: number;
    h2: number;
    h3: number;
    body: number;
    caption: number;
  };
}

export function useResponsive(): Metrics {
  const {width, height} = useWindowDimensions();

  return useMemo<Metrics>(() => {
    const bp = getBreakpoint(width);
    const layout = getLayout(width);
    const isDesktop = layout === 'desktop';
    const isTablet = layout === 'tablet';
    const isMobile = layout === 'mobile';

    const type = {
      xs: {mega: 46, h1: 30, h2: 22, h3: 18, body: 15, caption: 12},
      sm: {mega: 58, h1: 36, h2: 26, h3: 19, body: 15, caption: 12},
      md: {mega: 68, h1: 40, h2: 28, h3: 21, body: 16, caption: 13},
      lg: {mega: 78, h1: 44, h2: 30, h3: 22, body: 16, caption: 13},
      xl: {mega: 88, h1: 48, h2: 32, h3: 24, body: 17, caption: 14},
    }[bp];

    return {
      width,
      height,
      bp,
      layout,
      isMobile,
      isTablet,
      isDesktop,
      showSidebar: isDesktop,
      showBottomTabs: isMobile,
      showTopBar: !isDesktop,
      sidebarWidth: bp === 'xl' ? 320 : bp === 'lg' ? 288 : 260,
      contentMaxWidth: bp === 'xl' ? 1280 : bp === 'lg' ? 1160 : 1080,
      gutter: {xs: 16, sm: 24, md: 32, lg: 40, xl: 48}[bp],
      columns: {xs: 1, sm: 2, md: 2, lg: 3, xl: 3}[bp],
      type,
    };
  }, [width, height]);
}
