/**
 * 作品集：手绘项目卡（胶带 + 状态章 + 技术标签）
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';

import { PageShell } from '@/components/page-shell';
import { DoodleArrow, SketchBox, SketchTag, Tape } from '@/components/sketch';
import { works } from '@/content/profile';
import { usePageTitle } from '@/hooks/use-page-title';
import { useViewportWidth } from '@/hooks/use-viewport-width';
import { FontFamily, Layout, Palette, Space } from '@/theme/tokens';

const STATUS_COLOR = {
  done: { bg: 'rgba(95,141,126,0.16)', border: 'rgba(95,141,126,0.6)', text: '#4A7264' },
  wip: { bg: 'rgba(244,208,111,0.38)', border: 'rgba(185,138,36,0.55)', text: '#8A6420' },
} as const;

export default function Works() {
  const width = useViewportWidth();
  const wide = width >= Layout.wideBreak;
  usePageTitle(`作品集 · 阿澈的小站`);

  return (
    <PageShell title="作品集" titleEn="things I built" seed={201}>
      <Stack.Screen options={{ title: '作品集' }} />
      <View style={[styles.grid, { flexDirection: wide ? 'row' : 'column' }]}>
        {works.map((w, i) => (
          <ProjectCard key={w.title} work={w} seed={210 + i} tilt={i % 2 ? 1 : -1} />
        ))}
      </View>
      <Text style={styles.hint}>（排序不分先后，每一个都挺上心的）</Text>
    </PageShell>
  );
}

function ProjectCard({
  work,
  seed,
  tilt,
}: {
  work: (typeof works)[number];
  seed: number;
  tilt: number;
}) {
  const c = STATUS_COLOR[work.status];
  return (
    <View style={styles.cardWrap}>
      <SketchBox seed={seed} tilt={tilt} style={styles.card}>
        <Tape width={72} height={20} tilt={tilt > 0 ? -5 : 4} style={styles.tape} />
        <View style={styles.inner}>
          <View style={styles.metaRow}>
            <Text style={styles.year}>{work.year}</Text>
            <SketchTag
              color={c.border}
              bg={c.bg}
              contentStyle={{ paddingHorizontal: 8, paddingVertical: 2 }}
              style={{ transform: [{ rotate: '2deg' }] }}
            >
              <Text style={[styles.statusText, { color: c.text }]}>{work.statusText}</Text>
            </SketchTag>
          </View>
          <Text style={styles.title}>{work.title}</Text>
          <Text style={styles.desc}>{work.desc}</Text>
          <View style={styles.techRow}>
            {work.tech.map((t, ti) => (
              <SketchTag
                key={t}
                color="rgba(61,107,153,0.55)"
                bg="rgba(61,107,153,0.08)"
                seed={seed + 7 + ti * 5}
                contentStyle={{ paddingHorizontal: 8, paddingVertical: 2 }}
                style={{ transform: [{ rotate: `${ti % 2 ? 0.6 : -0.6}deg` }] }}
              >
                <Text style={styles.techText}>{t}</Text>
              </SketchTag>
            ))}
          </View>
        </View>
      </SketchBox>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: Space.xl,
    flexWrap: 'wrap',
  },
  cardWrap: {
    flex: 1,
    minWidth: 280,
  },
  card: {
    position: 'relative',
  },
  tape: {
    alignSelf: 'center',
    top: -10,
  },
  inner: {
    padding: Space.lg,
    gap: Space.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  year: {
    fontFamily: FontFamily.handBody,
    fontSize: 17,
    color: Palette.pencil,
  },
  statusText: {
    fontFamily: FontFamily.kaiBold,
    fontSize: 14,
  },
  title: {
    fontFamily: FontFamily.kaiBold,
    fontSize: 26,
    color: Palette.ink,
  },
  desc: {
    fontFamily: FontFamily.kai,
    fontSize: 17,
    lineHeight: 28,
    color: Palette.ink,
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space.sm,
    marginTop: Space.xs,
  },
  techText: {
    fontFamily: FontFamily.kai,
    fontSize: 14,
    color: Palette.markerBlue,
  },
  hint: {
    fontFamily: FontFamily.kai,
    fontSize: 14,
    color: Palette.pencil,
    textAlign: 'center',
    opacity: 1,
  },
});
