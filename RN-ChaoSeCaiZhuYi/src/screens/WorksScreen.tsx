import React, {useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {BORDER, C, FONT, R, S, W, cursorPointer, hardShadow} from '../theme/tokens';
import {useResponsive} from '../utils/responsive';
import {WORK_CATEGORIES, Work, ScreenKey, works} from '../data/profile';
import {Block} from '../components/ui/Block';
import {NeoButton} from '../components/ui/Button';
import {Tag, TagRow} from '../components/ui/Tag';
import {Grid} from '../components/ui/Grid';
import {WorkCard} from '../components/Cards';
import {Stripes} from '../components/ui/Decor';
import {openUrl} from '../utils/links';

/* ============================================================
 *  作品集 / WORKS
 * ============================================================ */
export function WorksScreen({onNavigate}: {onNavigate: (key: ScreenKey) => void}) {
  const m = useResponsive();
  const [filter, setFilter] = useState<string>('全部');
  const [selected, setSelected] = useState<Work | null>(null);

  const list = filter === '全部' ? works : works.filter(w => w.category === filter);

  return (
    <View>
      {/* 头部 */}
      <View style={{marginBottom: 26}}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View style={{width: 26, height: 26, backgroundColor: C.yellow, borderWidth: 2, borderColor: C.ink, marginRight: 10}} />
          <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 12, letterSpacing: 3, color: C.inkSoft}}>
            03 / WORKS
          </Text>
        </View>
        <Text style={{fontFamily: FONT.display, fontSize: m.type.h1, lineHeight: m.type.h1 * 1.1, color: C.ink}}>
          作品集
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
          从商业项目到自娱自乐的小实验。每一个都至少跑在两个端上——这是我给自己定的最低要求。
        </Text>
      </View>

      {/* 筛选 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 22}}>
        {WORK_CATEGORIES.map(cat => {
          const isActive = cat === filter;
          const color = cat === '全部' ? C.ink : cat === 'App' ? C.magenta : cat === '设计' ? C.cyan : cat === '开源' ? C.yellow : C.violet;
          return (
            <Pressable
              key={cat}
              onPress={() => {
                setFilter(cat);
                setSelected(null);
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
                hardShadow(isActive ? 4 : 0, C.ink),
                cursorPointer,
              ]}>
              <Text
                style={{
                  fontFamily: FONT.body,
                  fontWeight: W.bold,
                  fontSize: 13,
                  color: isActive ? (color === C.ink ? C.paper : C.ink) : C.ink,
                }}>
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* 详情面板（点击卡片展开） */}
      {!!selected && (
        <Block
          bg={selected.color}
          pad={{h: 24, v: 22}}
          radius={R.lg}
          shadow={7}
          style={{marginBottom: 24, overflow: 'hidden'}}>
          <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'}}>
            <View style={{flex: 1, paddingRight: 12}}>
              <Tag label={`${selected.category} · ${selected.year}`} color={C.ink} variant="solid" />
              <Text
                style={{
                  fontFamily: FONT.display,
                  fontSize: m.type.h2,
                  lineHeight: m.type.h2 * 1.25,
                  color: C.ink,
                  marginTop: 10,
                }}>
                {selected.title}
              </Text>
              <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 14, color: C.ink, marginTop: 4}}>
                {selected.subtitle}
              </Text>
            </View>
            <Pressable
              onPress={() => setSelected(null)}
              style={[
                {
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  borderWidth: BORDER.thin,
                  borderColor: C.ink,
                  backgroundColor: C.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                cursorPointer,
              ]}>
              <Text style={{fontFamily: FONT.display, fontSize: 15, color: C.ink}}>✕</Text>
            </Pressable>
          </View>

          <Text
            style={{
              fontFamily: FONT.body,
              fontSize: m.type.body,
              lineHeight: m.type.body * 1.8,
              color: C.ink,
              marginTop: 14,
            }}>
            {selected.desc}
          </Text>

          <View
            style={{
              marginTop: 16,
              paddingTop: 14,
              borderTopWidth: 3,
              borderTopColor: C.ink,
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
            <View style={{marginRight: 12, marginBottom: 8}}>
              <Tag label={selected.metric} color={C.ink} variant="solid" size="md" />
            </View>
            <TagRow items={selected.tags} color={C.ink} variant="outline" />
            <View style={{marginLeft: 'auto', marginBottom: 8}}>
              <NeoButton title="访问项目 ↗" color={C.ink} onPress={() => openUrl(selected.link)} />
            </View>
          </View>
        </Block>
      )}

      {/* 作品网格 */}
      <Grid columns={m.columns} gap={18}>
        {list.map(w => (
          <WorkCard key={w.id} work={w} onPress={() => setSelected(w)} />
        ))}
      </Grid>

      {list.length === 0 && (
        <Block bg={C.paperDeep} pad={{h: 20, v: 30}} radius={R.lg} shadow={0} borderWidth={BORDER.thin}>
          <Text style={{fontFamily: FONT.body, fontSize: 14, color: C.inkSoft, textAlign: 'center'}}>
            这个分类下还没有作品，换个标签看看？
          </Text>
        </Block>
      )}

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
          共 {works.length} 个项目 · 点击卡片查看详情
        </Text>
      </View>
    </View>
  );
}
