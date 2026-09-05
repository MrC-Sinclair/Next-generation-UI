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
  sketchHLinePath,
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

/** 手绘路径的四周余量：过冲与抖动会越出矩形，画布必须比容器大一圈才不被裁切 */
const SKETCH_PAD = 6;

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
          width={size.w + SKETCH_PAD * 2}
          height={size.h + SKETCH_PAD * 2}
          viewBox={`${-SKETCH_PAD} ${-SKETCH_PAD} ${size.w + SKETCH_PAD * 2} ${size.h + SKETCH_PAD * 2}`}
          style={[styles.absolute, { top: -SKETCH_PAD, left: -SKETCH_PAD, zIndex: -1 }]}
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
    // 便利贴底部微微翘起的折线阴影（画在 100×14 的翘角条里）
    let d = `M 0 ${(6 + rand() * 2).toFixed(1)} `;
    for (let i = 1; i <= 6; i++) {
      d += `L ${((100 / 6) * i).toFixed(1)} ${(6 + (rand() * 2 - 1) * 2.2).toFixed(1)} `;
    }
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
        <Path d={line} fill="none" stroke="rgba(90,80,50,0.25)" strokeWidth="1.4" />
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

/* ------------------------------------------------------------------ */
/* 手绘小标签：单笔抖动边框（替代生硬的圆角矩形）                            */
/* ------------------------------------------------------------------ */

type SketchTagProps = {
  children?: React.ReactNode;
  /** 边框色 */
  color?: string;
  /** 底色（透传透明则不画填充） */
  bg?: string;
  seed?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function SketchTag({
  children,
  color = Palette.stroke,
  bg,
  seed = 1,
  style,
  contentStyle,
}: SketchTagProps) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  const d = useMemo(() => {
    if (size.w < 6 || size.h < 6) return '';
    // 小尺寸收敛抖动：角更圆、过冲更短，否则糊成一团
    return sketchRectPath(size.w, size.h, seed, 1.0, 2.5, 1.6);
  }, [size.w, size.h, seed]);

  return (
    <View
      style={[{ zIndex: 0 }, style]}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (Math.abs(width - size.w) > 0.5 || Math.abs(height - size.h) > 0.5) {
          setSize({ w: width, h: height });
        }
      }}
    >
      <View style={[{ paddingHorizontal: 10, paddingVertical: 4 }, contentStyle]}>{children}</View>
      {d ? (
        <Svg
          width={size.w + SKETCH_PAD * 2}
          height={size.h + SKETCH_PAD * 2}
          viewBox={`${-SKETCH_PAD} ${-SKETCH_PAD} ${size.w + SKETCH_PAD * 2} ${size.h + SKETCH_PAD * 2}`}
          style={[styles.absolute, { top: -SKETCH_PAD, left: -SKETCH_PAD, zIndex: -1 }]}
          pointerEvents="none"
        >
          {bg ? <Path d={d} fill={bg} /> : null}
          <Path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* 手绘分隔线：自测量宽度（不传 width 时撑满父容器）                          */
/* ------------------------------------------------------------------ */

export function SketchDivider({
  width,
  color = 'rgba(58,53,46,0.45)',
  strokeWidth = 1.4,
  seed = 7,
  style,
}: {
  width?: number;
  color?: string;
  strokeWidth?: number;
  seed?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const [measured, setMeasured] = useState(0);
  const w = width ?? measured;

  return (
    <View
      style={[{ height: 8 }, style]}
      onLayout={
        width === undefined
          ? (e) => {
              const nw = e.nativeEvent.layout.width;
              if (Math.abs(nw - measured) > 0.5) setMeasured(nw);
            }
          : undefined
      }
    >
      {w > 4 ? (
        <Svg width={w} height={8} viewBox={`0 0 ${w} 8`} pointerEvents="none">
          <Path
            d={sketchHLinePath(w, seed)}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  absolute: { position: 'absolute', top: 0, left: 0 },
});
