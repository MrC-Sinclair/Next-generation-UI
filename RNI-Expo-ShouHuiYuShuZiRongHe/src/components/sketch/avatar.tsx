/**
 * 手绘头像：圆脸 + 乱发 + 眨眼。
 * 代替灰底占位图——"有人的痕迹"从脸开始。
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Palette } from '@/theme/tokens';

export function AvatarDoodle({ size = 180 }: { size?: number }) {
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        Animated.sequence([
          Animated.timing(blink, { toValue: 0.08, duration: 90, useNativeDriver: false }),
          Animated.timing(blink, { toValue: 1, duration: 130, useNativeDriver: false }),
        ]).start(schedule);
      }, 2200 + Math.random() * 3200);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [blink]);

  const s = size;
  return (
    <View style={{ width: s, height: s }}>
      <Svg width={s} height={s} viewBox="0 0 100 100">
        {/* 后脑头发 */}
        <Path
          d="M 50 12 C 28 12 16 28 17 47 C 17.5 52 19 55 21 57 L 79 57 C 81 55 82.5 52 83 47 C 84 28 72 12 50 12 Z"
          fill="#4A4038"
          fillOpacity={0.92}
        />
        {/* 脸 */}
        <Circle cx={50} cy={54} r={30} fill="#FBF4E4" stroke={Palette.stroke} strokeWidth={1.6} />
        {/* 刘海几笔 */}
        <Path
          d="M 26 40 C 30 30 38 24 46 22 M 35 42 C 38 33 44 27 52 25 M 46 44 C 49 35 56 29 63 28 M 58 44 C 61 37 66 32 71 32"
          stroke="#4A4038"
          strokeWidth={3.2}
          strokeLinecap="round"
          fill="none"
        />
        {/* 眼睛（由 Animated 控制缩放的容器渲染，见下方 View 层） */}
        <Circle cx={40} cy={54} r={2} fill="none" />
        <Circle cx={60} cy={54} r={2} fill="none" />
        {/* 微笑 */}
        <Path
          d="M 42 65 C 45 69 55 69 58 65"
          stroke={Palette.stroke}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        {/* 腮红 */}
        <Circle cx={33} cy={62} r={3.4} fill="#E8A08A" fillOpacity={0.5} />
        <Circle cx={67} cy={62} r={3.4} fill="#E8A08A" fillOpacity={0.5} />
        {/* 耳朵 */}
        <Path d="M 21 56 C 17 55 16 60 20 62 M 79 56 C 83 55 84 60 80 62" stroke={Palette.stroke} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      </Svg>
      {/* 眨眼层 */}
      <Animated.View
        style={[
          styles.eyes,
          { transform: [{ scaleY: blink }] },
        ]}
        pointerEvents="none"
      >
        <View style={styles.eyesSvgWrap}>
          <Svg width={s} height={s * 0.2} viewBox="0 0 100 20">
            <Circle cx={40} cy={10} r={2.6} fill={Palette.ink} />
            <Circle cx={60} cy={10} r={2.6} fill={Palette.ink} />
          </Svg>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  eyes: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '54%',
    alignItems: 'center',
  },
  eyesSvgWrap: {
    width: '100%',
    height: 20,
  },
});
