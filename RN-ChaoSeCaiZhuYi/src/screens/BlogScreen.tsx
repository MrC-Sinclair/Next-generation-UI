import React, {useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {BORDER, C, FONT, R, W, cursorPointer, hardGlow} from '../theme/tokens';
import {useResponsive} from '../utils/responsive';
import {POST_CATEGORIES, Post, ScreenKey, posts} from '../data/profile';
import {Block} from '../components/ui/Block';
import {NeoButton} from '../components/ui/Button';
import {Tag, TagRow} from '../components/ui/Tag';
import {Grid} from '../components/ui/Grid';
import {PostCard} from '../components/Cards';
import {Stripes} from '../components/ui/Decor';
import {openUrl} from '../utils/links';

/* ============================================================
 *  博客 / BLOG
 * ============================================================ */
export function BlogScreen({onNavigate}: {onNavigate: (key: ScreenKey) => void}) {
  const m = useResponsive();
  const [filter, setFilter] = useState<string>('全部');
  const [reading, setReading] = useState<Post | null>(null);

  const list = filter === '全部' ? posts : posts.filter(p => p.category === filter);
  const hero = posts[0];

  const catColor = (c: string) =>
    c === '全部' ? C.ink : c === '工程' ? C.magenta : c === '设计' ? C.cyan : C.yellow;

  return (
    <View>
      {/* 头部 */}
      <View style={{marginBottom: 26}}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View style={{width: 26, height: 26, backgroundColor: C.lime, borderWidth: 2, borderColor: C.ink, marginRight: 10}} />
          <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 12, letterSpacing: 3, color: C.inkSoft}}>
            05 / BLOG
          </Text>
        </View>
        <Text style={{fontFamily: FONT.display, fontSize: m.type.h1, lineHeight: m.type.h1 * 1.1, color: C.ink}}>
          博客
        </Text>
        <Text
          style={{
            fontFamily: FONT.body,
            fontSize: m.type.body,
            lineHeight: m.type.body * 1.75,
            color: C.inkSoft,
            marginTop: 12,
            maxWidth: 680,
          }}>
          写下来是为了想清楚。大部分是工程复盘，偶尔是配色和观察。
        </Text>
      </View>

      {/* 头条 */}
      <Block bg={hero.color} pad={{h: 24, v: 22}} radius={R.lg} shadow={7} glow={hero.color} style={{marginBottom: 26, overflow: 'hidden'}}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
          <Tag label="FEATURED" color={C.ink} variant="solid" />
          <Text style={{fontFamily: FONT.body, fontSize: 12, color: C.ink, marginLeft: 10}}>
            {hero.date} · {hero.readingTime}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: FONT.display,
            fontSize: m.type.h2,
            lineHeight: m.type.h2 * 1.3,
            color: C.ink,
          }}>
          {hero.title}
        </Text>
        <Text
          style={{
            fontFamily: FONT.body,
            fontSize: m.type.body,
            lineHeight: m.type.body * 1.8,
            color: C.ink,
            marginTop: 12,
          }}>
          {hero.excerpt}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 18, flexWrap: 'wrap'}}>
          <TagRow items={hero.tags} color={C.ink} variant="outline" />
          <View style={{marginLeft: 'auto'}}>
            <NeoButton title="读这篇 →" color={C.ink} onPress={() => setReading(hero)} />
          </View>
        </View>
      </Block>

      {/* 筛选 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 22}}>
        {POST_CATEGORIES.map(cat => {
          const isActive = cat === filter;
          const color = catColor(cat);
          return (
            <Pressable
              key={cat}
              onPress={() => {
                setFilter(cat);
                setReading(null);
              }}
              style={[
                {
                  paddingHorizontal: 18,
                  paddingVertical: 9,
                  borderRadius: R.pill,
                  marginRight: 10,
                  borderWidth: BORDER.base,
                  borderColor: C.ink,
                  backgroundColor: isActive ? color : C.white,
                },
                isActive ? hardGlow(4, C.ink, color, 16) : null,
                cursorPointer,
              ]}>
              <Text
                style={{
                  fontFamily: FONT.body,
                  fontWeight: W.bold,
                  fontSize: 13,
                  color: isActive ? (cat === '全部' ? C.paper : C.ink) : C.ink,
                }}>
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* 展开阅读 */}
      {!!reading && (
        <Block bg={C.white} pad={{h: 26, v: 24}} radius={R.lg} shadow={7} style={{marginBottom: 24}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Tag label={`${reading.category} · ${reading.date}`} color={reading.color} variant="solid" />
            <Pressable
              onPress={() => setReading(null)}
              style={[
                {
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderWidth: BORDER.thin,
                  borderColor: C.ink,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                cursorPointer,
              ]}>
              <Text style={{fontFamily: FONT.display, fontSize: 13, color: C.ink}}>✕</Text>
            </Pressable>
          </View>

          <Text
            style={{
              fontFamily: FONT.display,
              fontSize: m.type.h2,
              lineHeight: m.type.h2 * 1.3,
              color: C.ink,
              marginTop: 14,
            }}>
            {reading.title}
          </Text>

          <View style={{height: 4, width: 64, backgroundColor: reading.color, marginVertical: 16}} />

          <Text
            style={{
              fontFamily: FONT.body,
              fontSize: m.type.body + 1,
              lineHeight: (m.type.body + 1) * 1.95,
              color: C.ink,
            }}>
            {reading.excerpt}
          </Text>

          <Text
            style={{
              fontFamily: FONT.body,
              fontSize: m.type.body,
              lineHeight: m.type.body * 1.9,
              color: C.inkSoft,
              marginTop: 16,
            }}>
            （正文在原文站点继续。这里放的是摘要，足够你判断要不要点进去。）
          </Text>

          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 20}}>
            <NeoButton title="打开原文 ↗" color={reading.color} onPress={() => openUrl('https://example.com/blog/' + reading.id)} />
          </View>
        </Block>
      )}

      {/* 列表 */}
      <Grid columns={m.columns} gap={18}>
        {list.map(p => (
          <PostCard key={p.id} post={p} onPress={() => setReading(p)} />
        ))}
      </Grid>

      <View style={{marginTop: 34}}>
        <Stripes height={12} />
        <Text
          style={{
            fontFamily: FONT.body,
            fontSize: 13,
            color: C.inkSoft,
            textAlign: 'center',
            marginTop: 16,
          }}>
          共 {posts.length} 篇 · 更新频率：每月 1-2 篇
        </Text>
      </View>
    </View>
  );
}
