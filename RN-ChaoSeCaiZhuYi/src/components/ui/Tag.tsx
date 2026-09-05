import React from 'react';
import {StyleProp, Text, View, ViewStyle} from 'react-native';
import {BORDER, C, FONT, R, W, readableFg} from '../../theme/tokens';

export interface TagProps {
  label: string;
  color?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

/** 小色块标签：撞色发牌，用来给信息做视觉分区 */
export function Tag({label, color = C.cyan, variant = 'outline', size = 'sm', style}: TagProps) {
  const isSolid = variant === 'solid';
  const isGhost = variant === 'ghost';
  const fs = size === 'sm' ? 11 : 13;

  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          borderWidth: isGhost ? 0 : BORDER.thin,
          borderColor: isSolid ? C.ink : color,
          backgroundColor: isSolid ? color : isGhost ? 'transparent' : C.white,
          borderRadius: R.pill,
          paddingHorizontal: fs + 2,
          paddingVertical: size === 'sm' ? 4 : 6,
        },
        style,
      ]}>
      <Text
        style={{
          fontFamily: FONT.body,
          fontWeight: W.bold,
          fontSize: fs,
          letterSpacing: 0.6,
          color: isSolid ? readableFg(color) : color,
        }}>
        {label}
      </Text>
    </View>
  );
}

/** 一排自动换行的标签组 */
export function TagRow({items, color, variant}: {items: string[]; color?: string; variant?: TagProps['variant']}) {
  return (
    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      {items.map((t, i) => (
        <View key={t + i} style={{marginRight: 6, marginBottom: 6}}>
          <Tag label={t} color={color} variant={variant} />
        </View>
      ))}
    </View>
  );
}
