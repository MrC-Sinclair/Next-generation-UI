import React, {useState} from 'react';
import {Platform, StyleProp, View, ViewStyle} from 'react-native';

/**
 * 悬停容器：PC 端鼠标悬停时切换到 hoverStyle，移动端/原生端无副作用。
 * 这是"同一套代码在 PC 上更像网站、在手机上更像 App"的关键小工具。
 */
export function Hoverable({
  children,
  style,
  hoverStyle,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  hoverStyle?: StyleProp<ViewStyle>;
}) {
  const [hover, setHover] = useState(false);
  const webProps =
    Platform.OS === 'web'
      ? ({onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false)} as any)
      : {};

  return (
    <View {...webProps} style={[style, hover ? hoverStyle : null]}>
      {children}
    </View>
  );
}
