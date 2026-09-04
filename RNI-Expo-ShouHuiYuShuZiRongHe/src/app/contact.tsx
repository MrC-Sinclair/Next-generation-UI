/**
 * 联系方式：明信片式邮箱卡（点击复制）+ 回信守则
 */
import React, { useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Stack } from 'expo-router';

import { PageShell } from '@/components/page-shell';
import { CircleMark, DoodleArrow, SketchBox, SketchUnderline, Star, StickyNote, Tape } from '@/components/sketch';
import { contact, profile } from '@/content/profile';
import { usePageTitle } from '@/hooks/use-page-title';
import { FontFamily, Layout, Palette, Space } from '@/theme/tokens';

export default function Contact() {
  const { width } = useWindowDimensions();
  const wide = width >= Layout.wideBreak;
  const [copied, setCopied] = useState(false);
  usePageTitle(`联系方式 · 阿澈的小站`);

  const copyEmail = async () => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(contact.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } else {
        Linking.openURL(`mailto:${contact.email}`);
      }
    } catch {
      Linking.openURL(`mailto:${contact.email}`);
    }
  };

  return (
    <PageShell title="联系方式" titleEn="say hi, politely" seed={501}>
      <Stack.Screen options={{ title: '联系方式' }} />

      <View style={[styles.body, { flexDirection: wide ? 'row' : 'column' }]}>
        {/* ---------- 左：明信片 ---------- */}
        <View style={styles.cardCol}>
          <SketchBox seed={510} tilt={-1.5} style={styles.card}>
            <Tape width={80} height={22} tilt={-6} style={styles.tape} />
            <View style={styles.cardInner}>
              <Text style={styles.cardLabel}>寄信地址 · 收件人：{profile.name}</Text>

              <Pressable onPress={copyEmail} style={styles.emailBlock}>
                <Text style={styles.email}>{contact.email}</Text>
                <SketchUnderline
                  width={300}
                  color="rgba(201,80,42,0.7)"
                  seed={511}
                  style={styles.emailLine}
                />
                <Text style={styles.emailAction}>{copied ? '已复制 ✓' : '点击复制'}</Text>
              </Pressable>

              <Text style={styles.emailHint}>{contact.emailHint}</Text>

              {/* 邮票角：手绘圈章 */}
              <View style={styles.stamp} pointerEvents="none">
                <CircleMark size={54} color={Palette.markerBlue} seed={512} strokeWidth={1.8} />
                <Text style={styles.stampText}>AIR MAIL</Text>
              </View>
            </View>
          </SketchBox>

          {/* 其他入口 */}
          <View style={styles.linksBlock}>
            {profile.links.map((l, i) => {
              const rot = [-0.5, 0.4, -0.3][i % 3];
              return (
                <Pressable
                  key={l.label}
                  onPress={() => Linking.openURL(l.href)}
                  style={[styles.linkRow, { transform: [{ rotate: `${rot}deg` }] }]}
                >
                  <Text style={styles.linkLabel}>{l.label}</Text>
                  <DoodleArrow width={34} height={14} color={Palette.pencil} seed={513 + i} />
                  <Text style={styles.linkUrl}>{l.href.replace(/^https?:\/\//, '')}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ---------- 右：回信守则 ---------- */}
        <View style={styles.noteCol}>
          <StickyNote color="pink" seed={520} tilt={2} style={styles.note}>
            <View style={styles.noteInner}>
              {contact.replyNote.map((line, i) => (
                <Text key={i} style={[styles.noteLine, i === 0 && styles.noteTitle]}>
                  {line}
                </Text>
              ))}
            </View>
          </StickyNote>
          <View style={styles.decoRow}>
            <Star size={14} color={Palette.markerRed} filled seed={521} />
            <Text style={styles.decoText}>慢回，但必回。</Text>
            <Star size={13} color={Palette.markerBlue} seed={522} />
          </View>
        </View>
      </View>
    </PageShell>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Space.xl,
    alignItems: 'flex-start',
  },
  cardCol: {
    flex: 1.35,
    minWidth: 300,
    gap: Space.xl,
  },
  noteCol: {
    flex: 1,
    minWidth: 240,
    gap: Space.lg,
  },
  card: {
    position: 'relative',
  },
  tape: {
    alignSelf: 'center',
    top: -11,
  },
  cardInner: {
    padding: Space.xl,
    paddingTop: Space.lg,
    gap: Space.md,
    position: 'relative',
  },
  cardLabel: {
    fontFamily: FontFamily.kai,
    fontSize: 14,
    color: Palette.pencil,
    letterSpacing: 1,
  },
  emailBlock: {
    gap: 2,
  },
  email: {
    fontFamily: FontFamily.kaiBold,
    fontSize: 30,
    color: Palette.ink,
  },
  emailLine: {
    marginLeft: 2,
  },
  emailAction: {
    fontFamily: FontFamily.handBody,
    fontSize: 14,
    color: Palette.markerRed,
    marginTop: 6,
    marginLeft: 2,
  },
  emailHint: {
    fontFamily: FontFamily.kai,
    fontSize: 15,
    color: Palette.pencil,
    opacity: 1,
  },
  stamp: {
    position: 'absolute',
    right: Space.md,
    top: Space.lg,
    alignItems: 'center',
    opacity: 0.9,
  },
  stampText: {
    fontFamily: FontFamily.handBody,
    fontSize: 11,
    color: Palette.markerBlue,
    marginTop: -12,
    transform: [{ rotate: '-8deg' }],
  },
  linksBlock: {
    gap: Space.md,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  linkLabel: {
    fontFamily: FontFamily.kaiBold,
    fontSize: 17,
    color: Palette.ink,
    width: 78,
  },
  linkUrl: {
    fontFamily: FontFamily.handBody,
    fontSize: 15,
    color: Palette.pencil,
  },
  note: {
    maxWidth: 300,
  },
  noteInner: {
    padding: Space.md,
    gap: 4,
  },
  noteTitle: {
    fontFamily: FontFamily.kaiBold,
    fontSize: 18,
  },
  noteLine: {
    fontFamily: FontFamily.kai,
    fontSize: 16,
    lineHeight: 26,
    color: '#4A4232',
  },
  decoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  decoText: {
    fontFamily: FontFamily.kai,
    fontSize: 15,
    color: Palette.pencil,
  },
});
