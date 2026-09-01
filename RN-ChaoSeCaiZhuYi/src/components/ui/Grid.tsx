import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

/**
 * 响应式栅格：按列数把子元素等宽排布并自动换行。
 * 用百分比宽度实现，Web / 原生 / 鸿蒙 / 小程序都一致。
 */
export function Grid({
  columns,
  gap = 16,
  children,
  style,
}: {
  columns: number;
  gap?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const items = React.Children.toArray(children);
  return (
    <View style={[{flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -gap / 2}, style]}>
      {items.map((child, i) => (
        <View
          key={i}
          style={{
            width: `${100 / columns}%`,
            paddingHorizontal: gap / 2,
            marginBottom: gap,
          }}>
          {child}
        </View>
      ))}
    </View>
  );
}

/** 一行横向排列，自动吸收两端对齐 */
export function Row({
  children,
  gap = 12,
  wrap = true,
  style,
}: {
  children: React.ReactNode;
  gap?: number;
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{flexDirection: 'row', flexWrap: wrap ? 'wrap' : 'nowrap', alignItems: 'center'}, style]}>
      {React.Children.toArray(children).map((c, i) => (
        <View key={i} style={{marginRight: gap, marginBottom: wrap ? gap : 0}}>
          {c}
        </View>
      ))}
    </View>
  );
}
