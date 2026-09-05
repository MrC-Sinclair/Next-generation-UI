/**
 * 首页概览：手写 hero + 现在便签 + 身份标签 + 模块预告
 */
import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, Stack } from 'expo-router';

import {
  CircleMark,
  DoodleArrow,
  HandTitle,
  SketchBox,
  SketchTag,
  Scribble,
  Star,
  Tape,
} from '@/components/sketch';
import { MarkerTitle } from '@/components/sketch/marker-title';
import { AvatarDoodle } from '@/components/sketch/avatar';
import { profile } from '@/content/profile';
import { usePageTitle } from '@/hooks/use-page-title';
import { useViewportWidth } from '@/hooks/use-viewport-width';
import { FontFamily, Layout, Palette, Space, TypeScale } from '@/theme/tokens';

export default function Home() {
  const width = useViewportWidth();
  const wide = width >= Layout.wideBreak;
  usePageTitle(`${profile.name}的小站 · ${profile.role}`);

  return (
    <View style={styles.page}>
      <Stack.Screen options={{ title: `${profile.name}的小站` }} />

      {/* ---------------- Hero ---------------- */}
      <View style={[styles.hero, { flexDirection: wide ? 'row' : 'column' }]}>
        <View style={styles.heroMain}>
          <MarkerTitle
            text={`Hi, I'm ${profile.nameEn}`}
            fontFamily={FontFamily.hand}
            fontSize={54}
            lineHeight={58}
            color={Palette.markerBlue}
            strokeWidth={1}
            style={{ transform: [{ rotate: '-1.5deg' }] }}
          />
          <View>
            <View style={styles.heroNameRow}>
              <Text style={styles.heroName}>你好，我是</Text>
              <View>
                <MarkerTitle
                  text={profile.name}
                  fontFamily={FontFamily.kaiBold}
                  fontSize={44}
                  lineHeight={52}
                  color={Palette.markerRed}
                  strokeWidth={1}
                />
                <View style={styles.heroNameMark} pointerEvents="none">
                  <CircleMark size={52} color={Palette.highlighter} seed={8} strokeWidth={7} />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.bioWrap}>
            {profile.bio.map((line, i) => (
              <Text key={i} style={styles.bioText}>
                {line}
              </Text>
            ))}
          </View>

          <Text style={styles.tagline}>— {profile.tagline}</Text>
        </View>

        <View style={styles.heroSide}>
          <SketchBox seed={2} tilt={wide ? 2.5 : 1.5} style={styles.avatarBox}>
            <View style={styles.avatarInner}>
              <AvatarDoodle size={wide ? 170 : 150} />
            </View>
            <Tape width={92} style={styles.avatarTape} />
          </SketchBox>
          <Text style={styles.avatarCaption}>（本人，大概）</Text>
          {wide ? (
            <DoodleArrow width={110} height={64} color={Palette.pencil} seed={22} flip style={styles.heroArrow} />
          ) : null}
        </View>
      </View>

      {/* ---------------- 现在 ---------------- */}
      <View style={styles.section}>
        <HandTitle text="现在 Now" />
        <View style={[styles.nowRow, { flexDirection: wide ? 'row' : 'column' }]}>
          {profile.now.map((item, i) => (
            <SketchBox
              key={item.label}
              seed={30 + i}
              tilt={[-1.4, 0.9, -0.6][i % 3]}
              style={[styles.nowCard, !wide && { width: '100%' }]}
            >
              <View style={styles.nowInner}>
                <Text style={styles.nowLabel}>{item.label}</Text>
                <Text style={styles.nowValue}>{item.value}</Text>
              </View>
              <Tape width={64} height={20} tilt={i % 2 ? 5 : -7} style={styles.nowTape} />
            </SketchBox>
          ))}
        </View>
      </View>

      {/* ---------------- 身份标签 + 链接 ---------------- */}
      <View style={[styles.section, styles.aboutRow, { flexDirection: wide ? 'row' : 'column' }]}>
        <View style={styles.tagBlock}>
          <HandTitle text="我贴的标签" underlineColor={Palette.markerBlue} />
          <View style={styles.tagWrap}>
            {['TypeScript', 'React Native', 'Expo', '写字', '造轮子', '手绘'].map((tag, i) => {
              const rot = [-1.2, 0.8, -0.5, 1.1, -0.8, 0.6][i % 6];
              return (
                <SketchTag
                  key={tag}
                  seed={9 + i * 3}
                  bg="rgba(255,253,247,0.9)"
                  contentStyle={{ paddingHorizontal: 12, paddingVertical: 5 }}
                  style={{ transform: [{ rotate: `${rot}deg` }] }}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </SketchTag>
              );
            })}
          </View>
          <Text style={styles.tagHint}>（标签是手写的，歪是故意的）</Text>
        </View>

        <View style={styles.linkBlock}>
          <HandTitle text="找我 Find me" underlineColor={Palette.markerBlue} />
          <View style={{ gap: Space.sm }}>
            {profile.links.map((l, i) => (
              <Pressable
                key={l.label}
                onPress={() => Linking.openURL(l.href)}
                style={({ hovered, pressed }) => [
                  styles.linkRow,
                  (hovered || pressed) && styles.rowActive,
                ]}
              >
                <Text style={styles.linkArrow}>→</Text>
                <Text style={styles.linkText}>{l.label}</Text>
                <Text style={styles.linkUrl}>{l.href.replace(/^https?:\/\//, '')}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* ---------------- 抽屉预告 ---------------- */}
      <View style={styles.section}>
        <View style={styles.drawerHead}>
          <HandTitle text="抽屉里还有" />
          <Scribble width={120} height={12} color={Palette.pencil} seed={40} style={styles.drawerScribble} />
        </View>
        <View style={[styles.drawerGrid, !wide && { flexDirection: 'column' }]}>
          {DRAWERS.map((d, i) => (
            <DrawerCard key={d.href} href={d.href} title={d.title} desc={d.desc} seed={51 + i} />
          ))}
        </View>
      </View>
    </View>
  );
}

/* 抽屉预告卡 → 各模块入口 */
const DRAWERS = [
  { href: '/works', title: '作品集', desc: '做过的东西，和它们的手稿' },
  { href: '/skills', title: '技能栈', desc: '点亮过的技能树' },
  { href: '/blog', title: '博客', desc: '写字的地方，想清楚了再放出来' },
  { href: '/contact', title: '联系方式', desc: '信箱常开，慢回但必回' },
] as const;

function DrawerCard({
  href,
  title,
  desc,
  seed,
}: {
  href: (typeof DRAWERS)[number]['href'];
  title: string;
  desc: string;
  seed: number;
}) {
  return (
    <Link href={href} asChild>
      <Pressable
        style={({ hovered, pressed }) => [
          styles.drawerCard,
          (hovered || pressed) && { opacity: 0.8 },
          pressed && { transform: [{ scale: 0.985 }] },
        ]}
      >
        <SketchBox seed={seed} tilt={seed % 2 ? 1 : -1}>
        <View style={styles.drawerInner}>
          <Text style={styles.drawerTitle}>{title}</Text>
          <Text style={styles.drawerDesc}>{desc}</Text>
          <View style={styles.drawerGo}>
            <Text style={styles.drawerGoText}>去看看</Text>
            <DoodleArrow width={30} height={13} color={Palette.markerRed} seed={seed + 60} />
          </View>
        </View>
      </SketchBox>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '100%',
    maxWidth: Layout.maxContent,
    alignSelf: 'center',
    paddingHorizontal: Space.lg,
    paddingTop: Space.xl,
    gap: Space.xxl,
    paddingBottom: Space.md,
  },

  /* hero */
  hero: {
    gap: Space.xl,
    alignItems: 'center',
  },
  heroMain: {
    flex: 1,
    gap: Space.md,
  },
  heroHi: {
    fontFamily: FontFamily.hand,
    fontSize: 54,
    color: Palette.markerBlue,
    lineHeight: 58,
    transform: [{ rotate: '-1.5deg' }],
  },
  heroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs,
    flexWrap: 'wrap',
  },
  heroName: {
    fontFamily: FontFamily.kaiBold,
    fontSize: 44,
    lineHeight: 52,
    color: Palette.ink,
  },
  heroNameMark: {
    position: 'absolute',
    top: -6,
    left: -14,
    right: -14,
    bottom: -6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioWrap: {
    gap: 2,
    marginTop: Space.sm,
  },
  bioText: {
    fontFamily: FontFamily.kai,
    fontSize: TypeScale.body,
    lineHeight: 30,
    color: Palette.ink,
  },
  tagline: {
    fontFamily: FontFamily.hand,
    fontSize: 26,
    color: Palette.pencil,
    marginTop: Space.xs,
    transform: [{ rotate: '-0.8deg' }],
  },
  heroSide: {
    alignItems: 'center',
    position: 'relative',
  },
  avatarBox: {
    padding: Space.md,
  },
  avatarInner: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  avatarTape: {
    top: -12,
    left: '30%',
  },
  avatarCaption: {
    fontFamily: FontFamily.kai,
    fontSize: 14,
    color: Palette.pencil,
    marginTop: Space.sm,
    opacity: 0.95,
  },
  heroArrow: {
    position: 'absolute',
    left: -100,
    top: 40,
    opacity: 0.7,
  },

  /* section 通用 */
  section: {
    gap: Space.lg,
  },

  /* now */
  nowRow: {
    gap: Space.lg,
  },
  nowCard: {
    flex: 1,
    position: 'relative',
  },
  nowInner: {
    padding: Space.lg,
    minWidth: 180,
  },
  nowLabel: {
    fontFamily: FontFamily.kaiBold,
    fontSize: 16,
    color: Palette.markerRed,
    letterSpacing: 2,
  },
  nowValue: {
    fontFamily: FontFamily.kaiBold,
    fontSize: 24,
    color: Palette.ink,
    marginTop: 2,
  },
  nowTape: {
    top: -10,
    right: 18,
  },

  /* 标签 & 链接 */
  aboutRow: {
    gap: Space.xl,
  },
  tagBlock: { flex: 1, gap: Space.md },
  linkBlock: { flex: 1, gap: Space.md },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space.sm,
  },
  tagText: {
    fontFamily: FontFamily.kai,
    fontSize: 16,
    color: Palette.ink,
  },
  tagHint: {
    fontFamily: FontFamily.kai,
    fontSize: 14,
    color: Palette.pencil,
    opacity: 0.95,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Space.xs,
    paddingVertical: 2,
  },
  rowActive: {
    opacity: 0.6,
    transform: [{ translateX: 2 }],
  },
  linkArrow: {
    fontFamily: FontFamily.kai,
    fontSize: 18,
    color: Palette.markerRed,
  },
  linkText: {
    fontFamily: FontFamily.kaiBold,
    fontSize: 18,
    color: Palette.ink,
  },
  linkUrl: {
    fontFamily: FontFamily.handBody,
    fontSize: 15,
    color: Palette.pencil,
    opacity: 0.95,
  },

  /* 抽屉 */
  drawerHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Space.md,
  },
  drawerScribble: {
    marginBottom: 10,
  },
  drawerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space.lg,
  },
  drawerCard: {
    flex: 1,
    minWidth: 200,
  },
  drawerInner: {
    padding: Space.lg,
    position: 'relative',
    minHeight: 110,
    gap: Space.xs,
  },
  drawerTitle: {
    fontFamily: FontFamily.kaiBold,
    fontSize: 24,
    color: Palette.ink,
  },
  drawerDesc: {
    fontFamily: FontFamily.kai,
    fontSize: 16,
    color: Palette.ink,
    lineHeight: 27,
  },
  drawerGo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Space.xs,
  },
  drawerGoText: {
    fontFamily: FontFamily.kaiBold,
    fontSize: 16,
    color: Palette.markerRed,
  },
});
