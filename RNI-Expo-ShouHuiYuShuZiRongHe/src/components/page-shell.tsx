/**
 * 页面骨架：内容列 + 手绘页头（标题 + 英文手写副标 + 涂鸦）
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { HandTitle, Scribble, Star } from '@/components/sketch';
import { FontFamily, Layout, Palette, Space } from '@/theme/tokens';

export function PageShell({
  title,
  titleEn,
  seed = 5,
  children,
}: {
  title: string;
  titleEn?: string;
  seed?: number;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <View style={styles.head}>
          <HandTitle text={title} />
          {titleEn ? <Text style={styles.headEn}>{titleEn}</Text> : null}
          <Star size={16} color={Palette.markerRed} seed={seed + 3} style={styles.headStar} />
          <Scribble
            width={92}
            height={10}
            color={Palette.pencil}
            seed={seed + 5}
            style={styles.headScribble}
          />
        </View>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Space.lg,
    paddingTop: Space.xl,
    paddingBottom: Space.md,
  },
  content: {
    width: '100%',
    maxWidth: Layout.maxContent - Space.lg * 2,
    gap: Space.xl,
  },
  head: {
    gap: Space.xs,
  },
  headEn: {
    fontFamily: FontFamily.hand,
    fontSize: 24,
    color: Palette.pencil,
    marginTop: -Space.sm,
    marginLeft: Space.xs,
  },
  headStar: {
    position: 'absolute',
    right: 4,
    top: 6,
    opacity: 0.85,
  },
  headScribble: {
    position: 'absolute',
    right: 30,
    top: 30,
    opacity: 0.7,
    transform: [{ rotate: '-4deg' }],
  },
});
