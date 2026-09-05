/**
 * 关于我：名片 + 故事（荧光笔高亮） + 一些数字 + 便利贴墙
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';

import {
  DoodleArrow,
  HandTitle,
  SketchBox,
  SketchUnderline,
  Star,
  StickyNote,
  Tape,
  highlightSpan,
} from '@/components/sketch';
import { AvatarDoodle } from '@/components/sketch/avatar';
import { profile } from '@/content/profile';
import { usePageTitle } from '@/hooks/use-page-title';
import { useViewportWidth } from '@/hooks/use-viewport-width';
import { FontFamily, Layout, Palette, Space, TypeScale } from '@/theme/tokens';

const STICKY_COLORS = {
  yellow: Palette.stickyYellow,
  pink: Palette.stickyPink,
  blue: Palette.stickyBlue,
} as const;

export default function About() {
  const width = useViewportWidth();
  const wide = width >= Layout.wideBreak;
  usePageTitle(`关于 ${profile.name} · ${profile.name}的小站`);

  return (
    <View style={styles.page}>
      <Stack.Screen options={{ title: `关于 ${profile.name}` }} />

      {/* ---------------- 页头 ---------------- */}
      <View style={styles.headRow}>
        <HandTitle text="关于我" size={TypeScale.h1} />
        <Text style={styles.headEn}>about me, honestly</Text>
        <Star size={20} color={Palette.markerRed} seed={77} style={styles.headStar} />
      </View>

      <View style={[styles.body, { flexDirection: wide ? 'row' : 'column' }]}>
        {/* ---------------- 左：名片 ---------------- */}
        <View style={[styles.cardCol, !wide && styles.cardColNarrow]}>
          <SketchBox seed={9} tilt={-2}>
            <View style={styles.cardInner}>
              <View style={styles.avatarRow}>
                <AvatarDoodle size={110} />
              </View>
              <Text style={styles.cardName}>{profile.name}</Text>
              <Text style={styles.cardRole}>{profile.role}</Text>
              <View style={styles.cardDivider}>
                <SketchUnderline width={140} seed={10} amp={2.2} color={Palette.pencil} />
              </View>
              <View style={styles.cardMeta}>
                <Text style={styles.cardMetaLine}>坐标：地球上，时区 +8</Text>
                <Text style={styles.cardMetaLine}>状态：造物中 zzz…</Text>
                <Text style={styles.cardMetaLine}>语言：中文 / English / TypeScript</Text>
              </View>
            </View>
            <Tape width={96} tilt={-8} style={styles.cardTape} />
          </SketchBox>
          <Text style={styles.cardCaption}>（一张手写名片）</Text>

          {wide ? (
            <DoodleArrow width={80} height={56} color={Palette.pencil} seed={23} style={styles.cardArrow} />
          ) : null}
        </View>

        {/* ---------------- 右：故事流 ---------------- */}
        <View style={styles.storyCol}>
          <View style={styles.storyBlock}>
            <HandTitle text="我的故事" size={30} underlineColor={Palette.markerBlue} />
            <View style={styles.storyWrap}>
              {profile.story.map((line, i) => (
                <StoryText key={i} text={line} />
              ))}
            </View>
          </View>

          {/* 一些数字 */}
          <View style={styles.storyBlock}>
            <HandTitle text="一些数字" size={30} underlineColor={Palette.markerBlue} />
            <View style={[styles.statRow, !wide && { flexWrap: 'wrap' }]}>
              {profile.stats.map((s, i) => (
                <View key={s.label} style={styles.statBox}>
                  <Text style={styles.statNum}>
                    {s.num}
                    {s.unit ? <Text style={styles.statUnit}>{s.unit}</Text> : null}
                  </Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                  <Star
                    size={13}
                    color={[Palette.markerRed, Palette.markerBlue, '#C9902A', '#6C8B5A'][i % 4]}
                    seed={80 + i}
                    style={styles.statStar}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* 便利贴墙 */}
          <View style={styles.storyBlock}>
            <HandTitle text="便利贴墙" size={30} underlineColor={Palette.markerBlue} />
            <View style={[styles.stickyRow, !wide && { flexDirection: 'column' }]}>
              {profile.sticky.map((note, i) => (
                <StickyNote
                  key={i}
                  color={STICKY_COLORS[note.color as keyof typeof STICKY_COLORS]}
                  seed={60 + i}
                  tilt={[-2, 1.5, -1][i % 3]}
                  style={styles.stickyNote}
                >
                  <Text style={styles.stickyText}>{note.text}</Text>
                </StickyNote>
              ))}
            </View>
            <Text style={styles.stickyHint}>（从我的桌面上撕下来的）</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/** story 段落：{关键词} → 荧光笔 */
function StoryText({ text }: { text: string }) {
  const parts = text.split(/(\{.*?\})/g);
  return (
    <Text style={styles.storyLine}>
      {parts.map((p, i) =>
        p.startsWith('{') && p.endsWith('}') ? (
          <Text key={i} style={highlightSpan}>
            {p.slice(1, -1)}
          </Text>
        ) : (
          p
        )
      )}
    </Text>
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
    gap: Space.xl,
    paddingBottom: Space.lg,
  },

  headRow: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Space.md,
  },
  headEn: {
    fontFamily: FontFamily.hand,
    fontSize: 24,
    color: Palette.pencil,
    marginBottom: 6,
    transform: [{ rotate: '-1deg' }],
  },
  headStar: {
    marginBottom: 10,
  },

  body: {
    gap: Space.xl,
    alignItems: 'flex-start',
  },

  /* 名片 */
  cardCol: {
    position: 'relative',
    width: 300,
    alignItems: 'center',
  },
  cardColNarrow: {
    width: '100%',
  },
  cardInner: {
    padding: Space.lg,
    alignItems: 'center',
    width: 260,
    minWidth: 240,
  },
  avatarRow: {
    marginBottom: Space.sm,
  },
  cardName: {
    fontFamily: FontFamily.kaiBold,
    fontSize: 30,
    color: Palette.ink,
  },
  cardRole: {
    fontFamily: FontFamily.kai,
    fontSize: 15,
    color: Palette.pencil,
    marginTop: 4,
    textAlign: 'center',
  },
  cardDivider: {
    marginVertical: Space.md,
  },
  cardMeta: {
    gap: 4,
    alignSelf: 'flex-start',
  },
  cardMetaLine: {
    fontFamily: FontFamily.kai,
    fontSize: 14,
    color: Palette.ink,
    lineHeight: 24,
  },
  cardTape: {
    top: -14,
    right: 90,
  },
  cardCaption: {
    fontFamily: FontFamily.kai,
    fontSize: 14,
    color: Palette.pencil,
    marginTop: Space.sm,
    opacity: 1,
  },
  cardArrow: {
    position: 'absolute',
    right: -66,
    top: 60,
    opacity: 0.7,
  },

  /* 故事流 */
  storyCol: {
    flex: 1,
    gap: Space.xl,
    minWidth: 320,
  },
  storyBlock: {
    gap: Space.md,
  },
  storyWrap: {
    gap: 4,
    backgroundColor: 'rgba(255,253,247,0.6)',
    paddingHorizontal: Space.md,
    paddingVertical: Space.sm,
  },
  storyLine: {
    fontFamily: FontFamily.kai,
    fontSize: TypeScale.body,
    lineHeight: 32,
    color: Palette.ink,
  },

  /* 数字 */
  statRow: {
    flexDirection: 'row',
    gap: Space.lg,
  },
  statBox: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    paddingVertical: Space.md,
    borderBottomWidth: 1.6,
    borderLeftWidth: 1.6,
    borderBottomColor: Palette.stroke,
    borderLeftColor: Palette.stroke,
    borderBottomLeftRadius: 10,
    backgroundColor: 'rgba(255,253,247,0.8)',
    minWidth: 120,
  },
  statNum: {
    fontFamily: FontFamily.hand,
    fontSize: 44,
    lineHeight: 46,
    color: Palette.markerRed,
  },
  statUnit: {
    fontSize: 22,
    color: Palette.pencil,
  },
  statLabel: {
    fontFamily: FontFamily.kai,
    fontSize: 15,
    color: Palette.ink,
    marginTop: 2,
  },
  statStar: {
    position: 'absolute',
    top: 8,
    right: 10,
    opacity: 0.75,
  },

  /* 便利贴 */
  stickyRow: {
    flexDirection: 'row',
    gap: Space.lg,
  },
  stickyNote: {
    flex: 1,
    minHeight: 110,
  },
  stickyText: {
    fontFamily: FontFamily.kai,
    fontSize: 17,
    lineHeight: 28,
    color: '#4A4232',
  },
  stickyHint: {
    fontFamily: FontFamily.kai,
    fontSize: 14,
    color: Palette.pencil,
    opacity: 1,
  },
});
