/**
 * 技能栈：手绘星级（自己打的，仅供参考）
 */
import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Stack } from 'expo-router';

import { PageShell } from '@/components/page-shell';
import { SketchBox, Star } from '@/components/sketch';
import { skillGroups } from '@/content/profile';
import { usePageTitle } from '@/hooks/use-page-title';
import { FontFamily, Layout, Palette, Space } from '@/theme/tokens';

const GROUP_ACCENT = [Palette.markerRed, Palette.markerBlue, Palette.markerGreen] as const;

export default function Skills() {
  const { width } = useWindowDimensions();
  const wide = width >= Layout.wideBreak;
  usePageTitle(`技能栈 · 阿澈的小站`);

  return (
    <PageShell title="技能栈" titleEn="skills, honestly" seed={301}>
      <Stack.Screen options={{ title: '技能栈' }} />
      <View style={[styles.grid, { flexDirection: wide ? 'row' : 'column' }]}>
        {skillGroups.map((g, gi) => (
          <SkillGroupCard key={g.name} group={g} seed={310 + gi} accent={GROUP_ACCENT[gi % 3]} />
        ))}
      </View>
      <View style={styles.legendRow}>
        <Star size={15} color={Palette.markerRed} filled seed={41} />
        <Text style={styles.legend}>= 熟练（用得很顺，坑都踩过）</Text>
        <Star size={15} color={Palette.pencil} seed={43} />
        <Text style={styles.legend}>= 还在练（不敢吹）</Text>
      </View>
      <Text style={styles.hint}>（星级是自己打的，仅供参考 :)）</Text>
    </PageShell>
  );
}

function SkillGroupCard({
  group,
  seed,
  accent,
}: {
  group: (typeof skillGroups)[number];
  seed: number;
  accent: string;
}) {
  return (
    <View style={styles.cardWrap}>
      <SketchBox seed={seed} style={styles.card}>
        <View style={styles.inner}>
          <View style={styles.headRow}>
            <Text style={styles.groupTitle}>{group.name}</Text>
            <Text style={styles.groupNote}>（{group.note}）</Text>
          </View>
          <View style={styles.divider} />
          {group.items.map((s, si) => (
            <View key={s.name} style={styles.skillRow}>
              <View style={styles.nameBlock}>
                <Text style={styles.skillName}>{s.name}</Text>
                {'note' in s && s.note ? (
                  <View style={styles.noteTag}>
                    <Text style={styles.noteText}>{s.note}</Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={17}
                    seed={seed * 10 + n}
                    filled={n <= s.level}
                    color={n <= s.level ? accent : Palette.pencil}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      </SketchBox>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: Space.xl,
  },
  cardWrap: {
    flex: 1,
    minWidth: 280,
  },
  card: {
    position: 'relative',
  },
  inner: {
    padding: Space.lg,
    gap: Space.md,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Space.sm,
  },
  groupTitle: {
    fontFamily: FontFamily.kaiBold,
    fontSize: 22,
    color: Palette.ink,
  },
  groupNote: {
    fontFamily: FontFamily.kai,
    fontSize: 14,
    color: Palette.pencil,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(58,53,46,0.25)',
    borderStyle: 'dashed',
  },
  skillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Space.md,
  },
  nameBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    flexShrink: 1,
  },
  skillName: {
    fontFamily: FontFamily.kai,
    fontSize: 18,
    color: Palette.ink,
  },
  noteTag: {
    backgroundColor: 'rgba(201,80,42,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201,80,42,0.45)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    transform: [{ rotate: '-2deg' }],
  },
  noteText: {
    fontFamily: FontFamily.handBody,
    fontSize: 12,
    color: Palette.markerRed,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    flexWrap: 'wrap',
  },
  legend: {
    fontFamily: FontFamily.kai,
    fontSize: 15,
    color: Palette.pencil,
  },
  hint: {
    fontFamily: FontFamily.kai,
    fontSize: 14,
    color: Palette.pencil,
    textAlign: 'center',
    opacity: 0.85,
  },
});
