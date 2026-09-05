/**
 * 视口宽度 —— web 静态导出可靠版，替代 useWindowDimensions().width。
 *
 * 为什么不用 useWindowDimensions：静态导出的预渲染 HTML 以构建期默认尺寸生成；
 * 客户端 react-native-web 的 Dimensions 懒初始化在直接打开子页面时可能读到 0，
 * 且其 resize 通知链路（visualViewport → change 订阅者）在静态模式下并不可靠，
 * 表现为整页响应式布局（wide 断点、顶栏墨迹线）永久卡在窄屏计算结果。
 *
 * 这里在 web 上直接监听并读取真实 DOM 视口宽度（clientWidth，不含滚动条）；
 * 原生端没有这些问题，透传 RN 的值。
 */
import { useEffect, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

export function useViewportWidth(): number {
  const rn = useWindowDimensions();
  const [webWidth, setWebWidth] = useState<number | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const read = () => setWebWidth(document.documentElement.clientWidth);
    read();
    window.addEventListener('resize', read);
    window.visualViewport?.addEventListener('resize', read);
    return () => {
      window.removeEventListener('resize', read);
      window.visualViewport?.removeEventListener('resize', read);
    };
  }, []);

  return Platform.OS === 'web' && webWidth !== null ? webWidth : rn.width;
}
