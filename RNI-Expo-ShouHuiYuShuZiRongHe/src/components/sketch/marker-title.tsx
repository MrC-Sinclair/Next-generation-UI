/**
 * 马克笔标题：用 react-native-svg 的 Text stroke 实现"笔画略饱满"的马克笔质感。
 *
 * 背景：web 端通过 global.css 的 -webkit-text-stroke: 0.02em currentcolor
 * 对全局文字做了轻描边；RN 原生 Text 不支持描边，这里用 SVG 文本以
 * fill + stroke 同色渲染达到等价效果（stroke 沿字形轮廓外扩 → 笔画加粗）。
 *
 * 取舍：SVG 文本无法自动换行、且布局为手算坐标，故只用于最显眼的核心标题
 * （首页 hero），正文仍走原生 Text。
 */
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Text as SvgText } from 'react-native-svg';

import { measureCjk } from './index';

type MarkerTitleProps = {
  text: string;
  fontFamily: string;
  fontSize: number;
  lineHeight?: number;
  color?: string;
  /** 描边宽度，近似 web 端 0.02em */
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
};

export function MarkerTitle({
  text,
  fontFamily,
  fontSize,
  lineHeight,
  color = '#2E2A25',
  strokeWidth = 1,
  style,
}: MarkerTitleProps) {
  // 留出文字右侧余量，避免 SVG 画布溢出裁切（SVG 默认 overflow hidden）
  const w = Math.ceil(measureCjk(text, fontSize)) + strokeWidth * 2 + 10;
  const h = lineHeight ?? Math.round(fontSize * 1.2);
  return (
    <View style={[{ height: h, justifyContent: 'flex-start' }, style]}>
      <Svg width={w} height={h} pointerEvents="none">
        <SvgText
          x={strokeWidth + 1}
          y={Math.round(fontSize * 0.85)}
          fontSize={fontSize}
          fontFamily={fontFamily}
          fill={color}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        >
          {text}
        </SvgText>
      </Svg>
    </View>
  );
}
