import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {BORDER, C, FONT, R, S, W, cursorPointer, hardGlow, hardShadow, noSelect} from '../theme/tokens';
import {Post, Work, SkillGroup} from '../data/profile';
import {Tag, TagRow} from './ui/Tag';
import {Hoverable} from './ui/Hoverable';
import {Meter} from './ui/Meter';

/* ============================================================
 *  可复用卡片：首页与各列表页共用同一份实现，保证五端一致
 * ============================================================ */

/* ---------------- 数据卡 ---------------- */
export function StatCard({
  value,
  unit,
  label,
  color,
}: {
  value: string;
  unit: string;
  label: string;
  color: string;
}) {
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: color,
          borderWidth: BORDER.base,
          borderColor: C.ink,
          borderRadius: R.lg,
          padding: 16,
          minHeight: 104,
          justifyContent: 'space-between',
        },
        hardGlow(5, C.ink, color, 16),
      ]}>
      <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
        <Text style={{fontFamily: FONT.display, fontSize: 34, lineHeight: 34, color: C.ink}}>{value}</Text>
        <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 13, color: C.ink, marginBottom: 3}}>
          {unit}
        </Text>
      </View>
      <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 12, color: C.ink, opacity: 0.75}}>
        {label}
      </Text>
    </View>
  );
}

/* ---------------- 作品卡 ---------------- */
export function WorkCard({work, onPress}: {work: Work; onPress?: () => void}) {
  return (
    <Hoverable
      style={{flex: 1}}
      hoverStyle={{transform: [{translateX: -3}, {translateY: -3}]} as any}>
      <Pressable
        onPress={onPress}
        style={[
          {
            flex: 1,
            backgroundColor: C.white,
            borderWidth: BORDER.base,
            borderColor: C.ink,
            borderRadius: R.lg,
            overflow: 'hidden',
          },
          hardShadow(6, C.ink),
          cursorPointer,
        ]}>
        {/* 顶部色带 */}
        <View
          style={{
            height: 84,
            backgroundColor: work.color,
            borderBottomWidth: BORDER.base,
            borderBottomColor: C.ink,
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}>
          <Text style={{fontFamily: FONT.display, fontSize: 30, color: C.ink, opacity: 0.9}}>{work.year}</Text>
          <View style={{position: 'absolute', right: 12, top: 12}}>
            <Tag label={work.category} color={C.ink} variant="solid" />
          </View>
        </View>

        <View style={{padding: 16}}>
          <Text style={{fontFamily: FONT.display, fontSize: 19, lineHeight: 24, color: C.ink}}>{work.title}</Text>
          <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 12, color: work.color, marginTop: 4}}>
            {work.subtitle}
          </Text>
          <Text
            numberOfLines={3}
            style={{fontFamily: FONT.body, fontSize: 13, lineHeight: 20, color: C.inkSoft, marginTop: 10}}>
            {work.desc}
          </Text>

          <View
            style={{
              marginTop: 12,
              paddingTop: 10,
              borderTopWidth: 2,
              borderTopColor: C.paperDeep,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 11, color: C.ink, flexShrink: 1}}>
              {work.metric}
            </Text>
            <Text style={{fontFamily: FONT.display, fontSize: 14, color: work.color, marginLeft: 8}}>↗</Text>
          </View>

          <View style={{marginTop: 10}}>
            <TagRow items={work.tags} color={work.color} />
          </View>
        </View>
      </Pressable>
    </Hoverable>
  );
}

/* ---------------- 文章卡 ---------------- */
export function PostCard({post, onPress, compact}: {post: Post; onPress?: () => void; compact?: boolean}) {
  return (
    <Hoverable style={{flex: 1}} hoverStyle={{transform: [{translateX: -3}, {translateY: -3}]} as any}>
      <Pressable
        onPress={onPress}
        style={[
          {
            flex: 1,
            backgroundColor: C.white,
            borderWidth: BORDER.base,
            borderColor: C.ink,
            borderRadius: R.lg,
            padding: 18,
          },
          hardShadow(5, C.ink),
          cursorPointer,
          noSelect,
        ]}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View
            style={{
              backgroundColor: post.color,
              borderWidth: 2,
              borderColor: C.ink,
              borderRadius: R.sm,
              paddingHorizontal: 8,
              paddingVertical: 2,
              marginRight: 8,
            }}>
            <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 11, color: C.ink}}>
              {post.category}
            </Text>
          </View>
          <Text style={{fontFamily: FONT.body, fontSize: 11, color: C.inkSoft}}>{post.date}</Text>
          <Text style={{fontFamily: FONT.body, fontSize: 11, color: C.inkSoft, marginLeft: 'auto'}}>
            {post.readingTime}
          </Text>
        </View>

        <Text
          numberOfLines={2}
          style={{fontFamily: FONT.display, fontSize: compact ? 17 : 19, lineHeight: compact ? 23 : 26, color: C.ink}}>
          {post.title}
        </Text>

        {!compact && (
          <Text
            numberOfLines={3}
            style={{fontFamily: FONT.body, fontSize: 13, lineHeight: 21, color: C.inkSoft, marginTop: 8}}>
            {post.excerpt}
          </Text>
        )}

        <View style={{marginTop: 12}}>
          <TagRow items={post.tags} color={post.color} variant="ghost" />
        </View>
      </Pressable>
    </Hoverable>
  );
}

/* ---------------- 技能分组卡 ---------------- */
export function SkillGroupCard({group, index}: {group: SkillGroup; index: number}) {
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: C.white,
          borderWidth: BORDER.base,
          borderColor: C.ink,
          borderRadius: R.lg,
          overflow: 'hidden',
        },
        hardShadow(6, C.ink),
      ]}>
      <View
        style={{
          backgroundColor: group.color,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: BORDER.base,
          borderBottomColor: C.ink,
        }}>
        <Text style={{fontFamily: FONT.display, fontSize: 18, color: C.ink}}>{group.group}</Text>
        <Text style={{fontFamily: FONT.body, fontSize: 12, color: C.ink, opacity: 0.78, marginTop: 3}}>
          {group.desc}
        </Text>
      </View>

      <View style={{padding: 16}}>
        {group.items.map((item, i) => (
          <View key={item.name} style={{marginBottom: i === group.items.length - 1 ? 0 : S.lg}}>
            <View style={{flexDirection: 'row', alignItems: 'baseline', marginBottom: 6}}>
              <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 14, color: C.ink, flex: 1}}>
                {item.name}
              </Text>
              <Text style={{fontFamily: FONT.display, fontSize: 12, color: group.color}}>{item.level}</Text>
            </View>
            <Meter value={item.level} color={group.color} height={14} />
            <Text style={{fontFamily: FONT.body, fontSize: 11, color: C.inkSoft, marginTop: 5}}>{item.note}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
