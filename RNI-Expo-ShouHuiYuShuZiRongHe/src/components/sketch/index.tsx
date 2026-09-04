/**
 * 手绘组件库：纸片盒子、波浪下划线、圈重点、涂鸦、胶带、便利贴
 */
import React, { useMemo, useState } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import {
  mulberry32,
  sketchArrowPath,
  sketchEllipsePath,
  sketchRectPath,
  sketchScribblePath,
  sketchStarPath,
  sketchUnderlinePath,
} from './geometry';
import { FontFamily, Palette, Space, TypeScale } from '@/theme/tokens';

/* ------------------------------------------------------------------ */
/* 手绘纸片盒子                                                         */
/* ------------------------------------------------------------------ */

type SketchBoxProps = {
  children?: React.ReactNode;
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  rough?: number;
  /** 同 seed 稳定渲染 */
  seed?: number;
  /** 轻微倾斜（度），手作感 */
  tilt?: number;
  /** 第二笔描边（描了两遍的样子） */
  double?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function SketchBox({
  children,
  fill = 'rgba(255,253,247,0.94)',
  fillOpacity = 1,
  stroke = Palette.stroke,
  strokeWidth = 2,
  rough = 1.6,
  seed = 1,
  tilt = 0,
  double = true,
  style,
  contentStyle,
}: SketchBoxProps) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  const { d, d2 } = useMemo(() => {
    if (size.w < 4 || size.h < 4) return { d: '', d2: '' };
    const s = Math.max(1, Math.round(seed));
    return {
      d: sketchRectPath(size.w, size.h, s, rough),
      d2: double ? sketchRectPath(size.w, size.h, s + 13, rough * 1.25) : '',
    };
  }, [size.w, size.h, seed, rough, double]);

  return (
    <View
      style={[
        {
          transform: tilt ? [{ rotate: `${tilt}deg` }] : undefined,
          // 关键：容器建立层叠上下文，让下面的 SVG 能沉到内容之下
          zIndex: 0,
        },
        style,
      ]}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (Math.abs(width - size.w) > 0.5 || Math.abs(height - size.h) > 0.5) {
          setSize({ w: width, h: height });
        }
      }}
    >
      <View style={contentStyle}>{children}</View>
      {d ? (
        <Svg
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          style={[styles.absolute, { zIndex: -1 }]}
          pointerEvents="none"
        >
          <Path d={d} fill={fill} fillOpacity={fillOpacity} />
          <Path
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {d2 ? (
            <Path
              d={d2}
              fill="none"
              stroke={stroke}
              strokeWidth={strokeWidth * 0.7}
              strokeOpacity={0.45}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
        </Svg>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* 波浪下划线（红笔勾重点）                                               */
/* ------------------------------------------------------------------ */

export function SketchUnderline({
  width,
  color = Palette.markerRed,
  strokeWidth = 2.4,
  seed = 3,
  amp = 2.6,
  style,
}: {
  width: number;
  color?: string;
  strokeWidth?: number;
  seed?: number;
  amp?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const d = useMemo(() => sketchUnderlinePath(width, seed, amp), [width, seed, amp]);
  const h = amp * 2 + 6;
  return (
    <Svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} style={style} pointerEvents="none">
      <Path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* 圈重点（描两圈的椭圆）                                                 */
/* ------------------------------------------------------------------ */

export function CircleMark({
  size = 84,
  color = Palette.markerRed,
  seed = 5,
  strokeWidth = 2.6,
  style,
}: {
  size?: number;
  color?: string;
  seed?: number;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const d = useMemo(() => sketchEllipsePath(size * 0.48, size * 0.4, seed), [size, seed]);
  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={style}
      pointerEvents="none"
    >
      <Path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* 涂鸦元素                                                             */
/* ------------------------------------------------------------------ */

export function Star({
  size = 22,
  color = Palette.markerRed,
  seed = 11,
  filled = false,
  style,
}: {
  size?: number;
  color?: string;
  seed?: number;
  filled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const d = useMemo(() => sketchStarPath(size * 0.46, seed), [size, seed]);
  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={style}
      pointerEvents="none"
    >
      <Path
        d={d}
        fill={filled ? color : 'none'}
        fillOpacity={0.55}
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function DoodleArrow({
  width = 90,
  height = 70,
  color = Palette.pencil,
  seed = 21,
  strokeWidth = 2,
  flip = false,
  style,
}: {
  width?: number;
  height?: number;
  color?: string;
  seed?: number;
  strokeWidth?: number;
  flip?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { body, head } = useMemo(() => sketchArrowPath(width, height, seed), [width, height, seed]);
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={flip ? [style, { transform: [{ scaleY: -1 }] }] : style}
      pointerEvents="none"
    >
      <Path d={body} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d={head} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function Scribble({
  width = 60,
  height = 14,
  color = Palette.pencil,
  seed = 31,
  lines = 4,
  strokeWidth = 1.6,
  style,
}: {
  width?: number;
  height?: number;
  color?: string;
  seed?: number;
  lines?: number;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const d = useMemo(() => sketchScribblePath(width, height, seed, lines), [width, height, seed, lines]);
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={style}
      pointerEvents="none"
    >
      <Path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* 胶带                                                                 */
/* ------------------------------------------------------------------ */

export function Tape({
  width = 88,
  height = 26,
  color = Palette.tape,
  tilt = -6,
  style,
}: {
  width?: number;
  height?: number;
  color?: string;
  tilt?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          position: 'absolute',
          width,
          height,
          backgroundColor: color,
          borderWidth: 1,
          borderColor: 'rgba(120,106,72,0.35)',
          borderLeftWidth: 2,
          borderRightWidth: 2,
          borderLeftColor: 'rgba(190,176,140,0.5)',
          borderRightColor: 'rgba(190,176,140,0.5)',
          transform: [{ rotate: `${tilt}deg` }],
        },
        style,
      ]}
      pointerEvents="none"
    />
  );
}

/* ------------------------------------------------------------------ */
/* 便利贴                                                               */
/* ------------------------------------------------------------------ */

export function StickyNote({
  color = Palette.stickyYellow,
  tilt = -1.5,
  seed = 3,
  children,
  style,
}: {
  color?: string;
  tilt?: number;
  seed?: number;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const line = useMemo(() => {
    const rand = mulberry32(seed);
    // 便利贴底部微微翘起的折线阴影
    const w = 100;
    let d = `M 0 ${88 + rand()}`;
    for (let i = 1; i <= 6; i++) d += ` L ${(w / 6) * i} ${88 + (rand() * 2 - 1) * 1.5}`;
    return d;
  }, [seed]);

  return (
    <View style={[{ transform: [{ rotate: `${tilt}deg` }] }, style]}>
      <View
        style={{
          backgroundColor: color,
          paddingHorizontal: 16,
          paddingVertical: 14,
          minHeight: 96,
          width: '100%',
        }}
      >
        {children}
      </View>
      {/* 便利贴翘角 */}
      <Svg height="14" viewBox="0 0 100 14" preserveAspectRatio="none" style={{ width: '100%' }}>
        <Path d="M 100 0 L 100 0" stroke="none" />
        <Path d={line.replace(/88/g, '6')} fill="none" stroke="rgba(90,80,50,0.25)" strokeWidth="1.4" />
      </Svg>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* 荧光笔高亮（嵌套在 Text 里用）                                          */
/* ------------------------------------------------------------------ */

export const highlightSpan: TextStyle = {
  backgroundColor: 'rgba(244,208,111,0.6)',
  paddingHorizontal: 3,
  borderRadius: 3,
  fontStyle: 'italic',
};

/* ------------------------------------------------------------------ */
/* 手写标题（带波浪下划线的组合）                                           */
/* ------------------------------------------------------------------ */

export function HandTitle({
  text,
  color = Palette.ink,
  size = TypeScale.h1,
  underline = true,
  underlineColor = Palette.markerRed,
  underlineWidth,
  style,
}: {
  text: string;
  color?: string;
  size?: number;
  underline?: boolean;
  underlineColor?: string;
  underlineWidth?: number;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <View style={{ alignSelf: 'flex-start' }}>
      <Text
        style={[
          {
            fontFamily: FontFamily.kaiBold,
            fontSize: size,
            lineHeight: size * 1.2,
            color,
          },
          style,
        ]}
      >
        {text}
      </Text>
      {underline ? (
        <SketchUnderline
          width={underlineWidth ?? measureCjk(text, size)}
          color={underlineColor}
          seed={text.length}
          style={{ marginTop: -size * 0.22 }}
        />
      ) : null}
    </View>
  );
}

/** 粗略估算中英文混排宽度（文楷字形偏窄） */
export function measureCjk(text: string, fontSize: number): number {
  let units = 0;
  for (const ch of text) {
    if (/[\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/.test(ch)) units += 1;
    else if (/[A-Z]/.test(ch)) units += 0.58;
    else units += 0.45;
  }
  return Math.round(units * fontSize * 0.98);
}

const styles = StyleSheet.create({
  absolute: { position: 'absolute', top: 0, left: 0 },
});
