/**
 * 顶部导航：手写 logo + 墨迹下划线 + active 手绘圈
 * 未上线模块显示"敬请期待"小贴纸。
 */
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Link, usePathname } from 'expo-router';

import { CircleMark, SketchUnderline } from '@/components/sketch';
import { profile } from '@/content/profile';
import { FontFamily, Layout, Palette, Space, TypeScale } from '@/theme/tokens';

type NavItem = { href: string; label: string; soon?: boolean };

const NAV: NavItem[] = [
  { href: '/', label: '首页' },
  { href: '/about', label: '关于我' },
  { href: '/works', label: '作品集' },
  { href: '/skills', label: '技能栈' },
  { href: '/blog', label: '博客' },
  { href: '/contact', label: '联系方式' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const wide = width >= Layout.wideBreak;
  const contentW = Math.min(width, Layout.maxContent) - Space.lg * 2;

  // 非 / 托管（子路径、index.html）时 pathname 落不进任何模块 → 视为在首页
  const inAnySection = NAV.some(
    (n) => n.href !== '/' && (pathname === n.href || pathname.startsWith(`${n.href}/`))
  );
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' || !inAnySection : pathname === href;

  return (
    <View style={styles.wrap}>
      <View style={[styles.row, { maxWidth: Layout.maxContent }]}>
        {/* logo：名字 + 手绘圈 */}
        <Link href="/" style={styles.logoLink}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>{profile.name}</Text>
            <View style={styles.logoMark} pointerEvents="none">
              <CircleMark size={58} color={Palette.markerRed} seed={7} strokeWidth={2.2} />
            </View>
          </View>
          <Text style={styles.logoDot}>.site</Text>
        </Link>

        {/* 导航 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.nav}
        >
          {NAV.map((item) => (
            <NavItemView key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </ScrollView>
      </View>

      {/* 墨迹横线 */}
      <View style={{ alignSelf: 'center' }}>
        <SketchUnderline
          width={contentW}
          seed={99}
          amp={2}
          color={Palette.stroke}
          strokeWidth={2}
        />
      </View>
    </View>
  );
}

function NavItemView({ item, active }: { item: NavItem; active: boolean }) {
  const content = (
    <View style={styles.navItemInner}>
      <Text
        style={[
          styles.navText,
          active && styles.navTextActive,
          item.soon && styles.navTextSoon,
        ]}
      >
        {item.label}
      </Text>
      {item.soon ? (
        <View style={styles.soonTag}>
          <Text style={styles.soonText}>敬请期待</Text>
        </View>
      ) : null}
      {active ? (
        <View style={styles.activeMark} pointerEvents="none">
          <CircleMark size={46} color={Palette.markerRed} seed={5} strokeWidth={2.4} />
        </View>
      ) : null}
    </View>
  );

  if (item.soon || active) {
    return <View style={styles.navItem}>{content}</View>;
  }
  return (
    <Link href={item.href as never} style={styles.navItem}>
      {content}
    </Link>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 18,
    paddingHorizontal: Space.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
    gap: Space.md,
    paddingBottom: 10,
  },
  logoLink: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  logoBox: {
    position: 'relative',
  },
  logoText: {
    fontFamily: FontFamily.kaiBold,
    fontSize: 26,
    color: Palette.ink,
    lineHeight: 30,
    paddingRight: 6,
    paddingLeft: 10,
  },
  logoMark: {
    position: 'absolute',
    top: -14,
    left: -6,
    right: 0,
    bottom: -8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoDot: {
    fontFamily: FontFamily.handBody,
    fontSize: 16,
    color: Palette.pencil,
    marginBottom: 3,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
  },
  navItem: {
    paddingVertical: 6,
  },
  navItemInner: {
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'row',
  },
  navText: {
    fontFamily: FontFamily.kai,
    fontSize: 17,
    color: Palette.ink,
  },
  navTextActive: {
    fontFamily: FontFamily.kaiBold,
    color: Palette.markerRed,
  },
  navTextSoon: {
    color: Palette.pencil,
    opacity: 0.55,
  },
  soonTag: {
    marginLeft: 4,
    backgroundColor: 'rgba(201,80,42,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201,80,42,0.5)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    transform: [{ rotate: '-2deg' }],
  },
  soonText: {
    fontFamily: FontFamily.handBody,
    fontSize: 10,
    color: Palette.markerRed,
  },
  activeMark: {
    position: 'absolute',
    top: -12,
    left: -12,
    right: -12,
    bottom: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
