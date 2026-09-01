import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {BORDER, C, R, hardShadow} from '../../theme/tokens';

export interface BlockProps {
  /** 底色，默认纸白 */
  bg?: string;
  /** 描边色，默认墨黑 */
  borderColor?: string;
  borderWidth?: number;
  radius?: number;
  /** 内边距：数字=四周，对象=分别指定 */
  pad?: number | {h?: number; v?: number};
  /** 硬阴影位移，false 关闭 */
  shadow?: number | false;
  shadowColor?: string;
  /** 荧光描边（Web 有效，原生回落为硬阴影） */
  glow?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Block：全站最基础的容器。
 * 粗描边 + 无模糊硬阴影 + 高饱和底色 = 新粗野主义 × 超色彩主义。
 */
export function Block({
  bg = C.white,
  borderColor = C.ink,
  borderWidth = BORDER.base,
  radius = R.lg,
  pad,
  shadow = 6,
  shadowColor = C.ink,
  glow,
  children,
  style,
}: BlockProps) {
  const padding =
    typeof pad === 'number'
      ? {padding: pad}
      : pad
      ? {paddingHorizontal: pad.h ?? 0, paddingVertical: pad.v ?? 0}
      : null;

  return (
    <View
      style={[
        {
          backgroundColor: bg,
          borderWidth,
          borderColor,
          borderRadius: radius,
        },
        padding,
        shadow !== false ? hardShadow(shadow, shadowColor) : null,
        style,
      ]}>
      {children}
    </View>
  );
}
