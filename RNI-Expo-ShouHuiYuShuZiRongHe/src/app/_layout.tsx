/**
 * 根布局：字体加载 → 纸面背景 → 顶栏 + 路由 + 页脚
 */
import React, { useCallback, useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import '@/global.css';
import { SiteHeader } from '@/components/site-header';
import { Star } from '@/components/sketch';
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
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <SiteFooter />
    </View>
  );
}

function SiteFooter() {
  return (
    <View style={styles.footer}>
      <Star size={16} color={Palette.markerRed} seed={12} style={styles.footerStar} />
      <Text style={styles.footerText}>{profile.footer}</Text>
      <Star size={13} color={Palette.markerBlue} seed={19} style={styles.footerStar} />
    </View>
  );
}

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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.sm,
    paddingVertical: Space.xl,
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
