/**
 * 根布局：字体加载 → 纸面背景 → 顶栏 + 路由 + 页脚
 */
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
