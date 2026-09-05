import React, {useState} from 'react';
import {Platform, Pressable, StyleProp, Text, ViewStyle} from 'react-native';
import {BORDER, C, FONT, R, W, cursorPointer, hardGlow, hardShadow, noSelect, readableFg} from '../../theme/tokens';

export interface NeoButtonProps {
  title: string;
  onPress?: () => void;
  /** 主色（背景或描边） */
  color?: string;
  /** 文字色，默认按主色自动取墨黑或纸白 */
  textColor?: string;
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  disabled?: boolean;
  /** 启用霓虹辉光（重点 CTA 用），发光色同主色 */
  glow?: boolean;
  style?: StyleProp<ViewStyle>;
}

const PAD = {
  sm: {h: 12, v: 7},
  md: {h: 18, v: 11},
  lg: {h: 24, v: 15},
};
const SIZE = {sm: 12, md: 14, lg: 17};

/**
 * NeoButton：厚描边 + 硬阴影 + 按压时"陷下去"的位移反馈。
 */
export function NeoButton({
  title,
  onPress,
  color = C.magenta,
  textColor,
  variant = 'solid',
  size = 'md',
  icon,
  disabled,
  glow,
  style,
}: NeoButtonProps) {
  const solid = variant === 'solid';
  const [hover, setHover] = useState(false);
  const fg = textColor ?? (solid ? readableFg(color) : C.ink);
  const hoverProps =
    Platform.OS === 'web'
      ? ({onHoverIn: () => setHover(true), onHoverOut: () => setHover(false)} as any)
      : {};

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      {...hoverProps}
      style={({pressed}) => [
        {
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: solid ? color : 'transparent',
          borderWidth: BORDER.base,
          borderColor: solid ? C.ink : color,
          borderRadius: R.pill,
          paddingHorizontal: PAD[size].h,
          paddingVertical: PAD[size].v,
          opacity: disabled ? 0.45 : 1,
        },
        pressed || disabled
          ? null
          : glow
          ? hardGlow(hover ? 6 : 4, solid ? C.ink : color, solid ? color : C.ink)
          : hardShadow(hover ? 6 : 4, solid ? C.ink : color),
        pressed && {transform: [{translateX: 4}, {translateY: 4}]},
        hover && !pressed && !disabled && {transform: [{translateX: -2}, {translateY: -2}]},
        cursorPointer,
        noSelect,
        style,
      ]}>
      {!!icon && (
        <Text style={{fontFamily: FONT.display, fontSize: SIZE[size], color: fg, marginRight: 8}}>{icon}</Text>
      )}
      <Text
        style={{
          fontFamily: FONT.body,
          fontWeight: W.bold,
          fontSize: SIZE[size],
          letterSpacing: 0.4,
          color: fg,
        }}>
        {title}
      </Text>
    </Pressable>
  );
}
