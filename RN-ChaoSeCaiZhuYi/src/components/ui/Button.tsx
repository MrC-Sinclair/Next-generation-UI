import React from 'react';
import {Pressable, StyleProp, Text, ViewStyle} from 'react-native';
import {BORDER, C, FONT, R, W, cursorPointer, hardShadow, noSelect} from '../../theme/tokens';

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
  style,
}: NeoButtonProps) {
  const solid = variant === 'solid';
  const fg = textColor ?? (solid ? (color === C.yellow || color === C.lime ? C.ink : C.white) : C.ink);

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
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
        hardShadow(pressed || disabled ? 0 : 4, solid ? C.ink : color),
        pressed && {transform: [{translateX: 4}, {translateY: 4}]},
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
