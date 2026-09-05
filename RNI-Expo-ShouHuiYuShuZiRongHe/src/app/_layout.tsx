/**
 * 根布局：字体加载 → 纸面背景 → 顶栏 + 路由 + 页脚
 */
import React, { useCallback, useEffect } from 'react';
import { Image, Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import '@/global.css';
import { SiteHeader } from '@/components/site-header';
import { SketchDivider, Star } from '@/components/sketch';
import { useSiteFonts } from '@/hooks/use-fonts';
import { profile } from '@/content/profile';
import { FontFamily, Palette, Space } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useSiteFonts();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.root}>
      {/* 原生端纸纹层：平铺噪点 PNG（近似 web 端 global.css 的 feTurbulence 纸纹）。
          放在首位 → 被后续卡片等不透明内容覆盖，与 web 端"卡片盖在纸纹上"一致。 */}
      <View pointerEvents="none" style={styles.paperNoiseLayer}>
        <Image
          source={require('../../assets/images/paper-noise.png')}
          style={styles.paperNoise}
          resizeMode="repeat"
        />
      </View>
      <SiteHeader />
      {/* web 端 html/body/#root 被 expo-reset 锁在 100vh，页面内容会溢出画过页脚。
          把滚动收进内容区（顶栏 / 滚动区 / 页脚 三段式），页脚稳定贴底不再被内容叠盖。
          原生端本来就是内部滚动，保持 flex:1 即可。 */}
      <View style={stackAreaStyle}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </View>
      <SiteFooter />
    </View>
  );
}

function SiteFooter() {
  return (
    <View style={styles.footerWrap}>
      {/* 收尾的手绘底线：像写完一页后随手画的那条横线 */}
      <View style={styles.footerLine}>
        <SketchDivider width={300} color="rgba(58,53,46,0.35)" seed={87} />
      </View>
      <View style={styles.footer}>
        <Star size={16} color={Palette.markerRed} seed={12} style={styles.footerStar} />
        <Text style={styles.footerText}>{profile.footer}</Text>
        <Star size={13} color={Palette.markerBlue} seed={19} style={styles.footerStar} />
      </View>
    </View>
  );
}

const stackAreaStyle: ViewStyle = {
  flex: 1,
  // RN 的 ViewStyle 类型只收 visible/hidden/scroll，但 react-native-web 运行时支持
  // CSS overflow:auto（只在需要的那条轴出现滚动条），这里断言绕过类型层面。
  ...(Platform.OS === 'web' ? { overflow: 'auto' as unknown as 'hidden' } : {}),
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.paper,
  },
  paperNoiseLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  paperNoise: {
    flex: 1,
    width: '100%',
    height: '100%',
    // 噪点本身已带低 alpha 像素，这里再整体压低，避免过"脏"
    opacity: 0.55,
  },
  footerWrap: {
    width: '100%',
    alignItems: 'center',
  },
  footerLine: {
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.sm,
    paddingVertical: Space.lg,
  },
  footerStar: {
    opacity: 0.8,
  },
  footerText: {
    fontFamily: FontFamily.kai,
    fontSize: 14,
    color: Palette.pencil,
  },
});
