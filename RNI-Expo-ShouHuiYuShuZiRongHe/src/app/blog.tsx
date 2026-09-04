/**
 * 博客：文章列表（草稿状态用便利贴呈现）
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';

import { PageShell } from '@/components/page-shell';
import { SketchBox, SketchUnderline, StickyNote } from '@/components/sketch';
import { posts } from '@/content/profile';
import { usePageTitle } from '@/hooks/use-page-title';
import { FontFamily, Palette, Space } from '@/theme/tokens';

const TAG_COLOR = {
  技术: { bg: 'rgba(61,107,153,0.10)', border: 'rgba(61,107,153,0.5)', text: Palette.markerBlue },
  随笔: { bg: 'rgba(201,80,42,0.10)', border: 'rgba(201,80,42,0.5)', text: Palette.markerRed },
  读书: { bg: 'rgba(95,141,126,0.12)', border: 'rgba(95,141,126,0.55)', text: '#4A7264' },
} as const;

export default function Blog() {
  usePageTitle(`博客 · 阿澈的小站`);

  return (
    <PageShell title="博客" titleEn="words, slowly" seed={401}>
      <Stack.Screen options={{ title: '博客' }} />
      <View style={styles.list}>
        {posts.map((p, i) =>
          'wip' in p && p.wip ? (
            <DraftNote key={p.title} post={p} seed={420 + i} />
          ) : (
            <PostRow key={p.title} post={p} seed={420 + i} />
          )
        )}
      </View>
      <Text style={styles.hint}>（写得慢，想清楚了才发。RSS 在联系方式页。）</Text>
    </PageShell>
  );
}

function PostRow({ post, seed }: { post: (typeof posts)[number]; seed: number }) {
  const c = TAG_COLOR[post.tag as keyof typeof TAG_COLOR] ?? TAG_COLOR.随笔;
  return (
    <View>
      <SketchBox seed={seed} tilt={seed % 2 ? 0.6 : -0.6} style={styles.post}>
        <View style={styles.inner}>
          <View style={styles.metaRow}>
            <Text style={styles.date}>{post.date}</Text>
            <View style={[styles.tag, { backgroundColor: c.bg, borderColor: c.border }]}>
              <Text style={[styles.tagText, { color: c.text }]}>{post.tag}</Text>
            </View>
          </View>
          <Text style={styles.title}>{post.title}</Text>
          <SketchUnderline
            width={180}
            color="rgba(201,80,42,0.65)"
            seed={seed + 1}
            amp={1.6}
            style={styles.titleLine}
          />
          <Text style={styles.excerpt}>{post.excerpt}</Text>
        </View>
      </SketchBox>
    </View>
  );
}

function DraftNote({ post, seed }: { post: (typeof posts)[number]; seed: number }) {
  return (
    <View style={styles.draftWrap}>
      <StickyNote color="yellow" seed={seed} tilt={-1.5} style={styles.draftNote}>
        <View style={styles.draftInner}>
          <Text style={styles.draftTag}>草稿 · {post.tag}</Text>
          <Text style={styles.draftTitle}>{post.title}</Text>
          <Text style={styles.draftText}>……写了三行，删了两行。等书读完再说。</Text>
        </View>
      </StickyNote>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Space.lg,
  },
  post: {
    position: 'relative',
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
  date: {
    fontFamily: FontFamily.handBody,
    fontSize: 16,
    color: Palette.pencil,
  },
  tag: {
    borderWidth: 1.3,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  tagText: {
    fontFamily: FontFamily.kai,
    fontSize: 13,
  },
  title: {
    fontFamily: FontFamily.kaiBold,
    fontSize: 24,
    color: Palette.ink,
    marginTop: Space.xs,
  },
  titleLine: {
    marginLeft: 2,
  },
  excerpt: {
    fontFamily: FontFamily.kai,
    fontSize: 17,
    lineHeight: 29,
    color: Palette.ink,
  },
  draftWrap: {
    paddingLeft: Space.md,
  },
  draftNote: {
    maxWidth: 420,
    opacity: 0.92,
  },
  draftInner: {
    padding: Space.md,
    gap: 4,
  },
  draftTag: {
    fontFamily: FontFamily.handBody,
    fontSize: 13,
    color: '#8A6420',
  },
  draftTitle: {
    fontFamily: FontFamily.kaiBold,
    fontSize: 20,
    color: '#5B5040',
  },
  draftText: {
    fontFamily: FontFamily.kai,
    fontSize: 16,
    color: '#4A4232',
    opacity: 1,
  },
  hint: {
    fontFamily: FontFamily.kai,
    fontSize: 14,
    color: Palette.pencil,
    textAlign: 'center',
    opacity: 0.85,
  },
});
