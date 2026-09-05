import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, Text, View} from 'react-native';
import {ACCENTS, BORDER, C, FONT, R, W, hardShadow, pickAccent} from '../../theme/tokens';

/** 撞色条纹条：最便宜也最有效的色彩宣言 */
export function Stripes({colors, height = 14, radius = R.pill}: {colors?: string[]; height?: number; radius?: number}) {
  const list = colors ?? [C.magenta, C.yellow, C.cyan, C.violet, C.lime, C.orange];
  return (
    <View style={{flexDirection: 'row', height, borderRadius: radius, overflow: 'hidden', borderWidth: 2, borderColor: C.ink}}>
      {list.map((c, i) => (
        <View key={i} style={{flex: 1, backgroundColor: c, borderRightWidth: i === list.length - 1 ? 0 : 2, borderRightColor: C.ink}} />
      ))}
    </View>
  );
}

/** 旋转贴纸：慢速自转的圆形徽章，给静态页面一点呼吸感 */
export function SpinSticker({
  text,
  bg = C.yellow,
  fg = C.ink,
  size = 96,
  duration = 9000,
}: {
  text: string;
  bg?: string;
  fg?: string;
  size?: number;
  duration?: number;
}) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(spin, {toValue: 1, duration, easing: Easing.linear, useNativeDriver: true}),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const rotate = spin.interpolate({inputRange: [0, 1], outputRange: ['0deg', '360deg']});

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        borderWidth: BORDER.thin,
        borderColor: C.ink,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{rotate}],
        ...(hardShadow(4, C.ink) as object),
      }}>
      <Text style={{fontFamily: FONT.display, fontSize: size * 0.16, color: fg, letterSpacing: 1}}>{text}</Text>
    </Animated.View>
  );
}

/** 头像：不依赖图片，用首字 + 撞色块拼贴 */
export function Portrait({text, bg, ring, size = 160}: {text: string; bg: string; ring: string; size?: number}) {
  return (
    <View style={{width: size, height: size}}>
      <View
        style={{
          position: 'absolute',
          right: -10,
          top: -10,
          width: size,
          height: size,
          backgroundColor: ring,
          borderWidth: BORDER.base,
          borderColor: C.ink,
          borderRadius: R.lg,
        }}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: bg,
          borderWidth: BORDER.base,
          borderColor: C.ink,
          borderRadius: R.lg,
          alignItems: 'center',
          justifyContent: 'center',
          ...(hardShadow(8, C.ink) as object),
        }}>
        <Text style={{fontFamily: FONT.display, fontSize: size * 0.5, color: C.ink}}>{text}</Text>
      </View>
    </View>
  );
}

/** 跑马灯：滚动的文字条，能量感的来源。文字按撞色循环着色（传 fg 则统一用单色） */
export function Marquee({
  items,
  bg = C.ink,
  fg,
  height = 40,
  pxPerSec = 60,
}: {
  items: string[];
  bg?: string;
  fg?: string;
  height?: number;
  pxPerSec?: number;
}) {
  const [w, setW] = useState(0);
  const x = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!w) return;
    x.setValue(0);
    const anim = Animated.loop(
      Animated.timing(x, {
        toValue: -w,
        duration: (w / pxPerSec) * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [w]);

  const line = (pass: number) =>
    items.map((t, i) => (
      <View key={`${pass}-${i}`} style={{flexDirection: 'row', alignItems: 'center', flexShrink: 0}}>
        <Text
          style={{
            fontFamily: FONT.display,
            fontSize: 14,
            color: fg ?? pickAccent(i + 1),
            letterSpacing: 1.5,
          }}>
          {t}
        </Text>
        <View
          style={{
            width: 7,
            height: 7,
            marginHorizontal: 18,
            backgroundColor: ACCENTS[i % ACCENTS.length],
            borderRadius: i % 2 ? 0 : 7,
          }}
        />
      </View>
    ));

  return (
    <View
      style={{
        height,
        backgroundColor: bg,
        borderTopWidth: BORDER.thin,
        borderBottomWidth: BORDER.thin,
        borderColor: C.ink,
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
      <Animated.View style={{flexDirection: 'row', transform: [{translateX: x}]}}>
        <View style={{flexDirection: 'row', flexShrink: 0}} onLayout={e => !w && setW(e.nativeEvent.layout.width)}>
          {line(0)}
        </View>
        <View style={{flexDirection: 'row', flexShrink: 0}}>{line(1)}</View>
      </Animated.View>
    </View>
  );
}

/** 装饰色块：随机撒在页面角落的几何形状，纯装饰 */
export function DecorShapes({variant = 0}: {variant?: number}) {
  const shapes = [
    {size: 68, color: C.magenta, top: -14, right: 8, circle: true},
    {size: 40, color: C.cyan, bottom: 24, left: -16, circle: false},
    {size: 26, color: C.yellow, top: 60, right: -8, circle: false},
    {size: 52, color: C.violet, bottom: -18, right: 60, circle: true},
    {size: 22, color: C.lime, top: 12, left: 40, circle: true},
    {size: 34, color: C.orange, bottom: 40, left: 30, circle: false},
  ];
  const picked = shapes.slice(variant % 3, (variant % 3) + 4);

  return (
    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} pointerEvents="none">
      {picked.map((s, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            borderWidth: BORDER.thin,
            borderColor: C.ink,
            borderRadius: s.circle ? s.size / 2 : 4,
            top: (s as any).top,
            bottom: (s as any).bottom,
            left: (s as any).left,
            right: (s as any).right,
            opacity: 0.95,
          }}
        />
      ))}
    </View>
  );
}

/** 会呼吸的小圆点：表示"在线 / 档期开放" */
export function LiveDot({color = C.green}: {color?: string}) {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {toValue: 1.5, duration: 700, useNativeDriver: true}),
        Animated.timing(scale, {toValue: 1, duration: 700, useNativeDriver: true}),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <View style={{width: 14, height: 14, alignItems: 'center', justifyContent: 'center'}}>
      <Animated.View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: color, transform: [{scale}]}} />
    </View>
  );
}

/** 章节侧边的竖排装饰文字 */
export function VerticalLabel({text, color = C.inkSoft}: {text: string; color?: string}) {
  return (
    <Text
      style={{
        fontFamily: FONT.body,
        fontWeight: W.bold,
        fontSize: 10,
        letterSpacing: 4,
        color,
      }}>
      {text.split('').join(' ')}
    </Text>
  );
}
