import React from 'react';
import {Text, View} from 'react-native';
import {BORDER, C, FONT, R, S, W, hardShadow, pickAccent} from '../theme/tokens';
import {useResponsive} from '../utils/responsive';
import {ScreenKey, skills} from '../data/profile';
import {Block} from '../components/ui/Block';
import {NeoButton} from '../components/ui/Button';
import {Tag} from '../components/ui/Tag';
import {Section} from '../components/ui/Section';
import {Grid} from '../components/ui/Grid';
import {SkillGroupCard} from '../components/Cards';
import {ScoreDots} from '../components/ui/Meter';

const TOOLBOX = [
  'VS Code', 'Xcode', 'Android Studio', 'DevEco Studio', 'Figma', 'Safari 响应式',
  'Metro', 'Webpack', 'Vite', 'Flipper', 'React DevTools', 'Charles',
  'Git', 'GitHub Actions', 'Fastlane', 'Sentry', 'CodePush', 'Jira',
];

const LEARNING = [
  {title: '鸿蒙 ArkUI 渲染管线', desc: '目标：把 RN-OH 的动画性能摸到与 iOS 同档。', color: C.magenta, level: 60},
  {title: 'Skia 自定义绘制', desc: '目标：把图表和粒子效果全部收进自绘层。', color: C.cyan, level: 45},
  {title: '端侧小模型', desc: '目标：给 CHROMA 取色器加一个离线配色推荐。', color: C.yellow, level: 25},
];

/* ============================================================
 *  技能栈 / SKILLS
 * ============================================================ */
export function SkillsScreen({onNavigate}: {onNavigate: (key: ScreenKey) => void}) {
  const m = useResponsive();

  return (
    <View>
      {/* 头部 */}
      <View style={{marginBottom: 26}}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View style={{width: 26, height: 26, backgroundColor: C.violet, borderWidth: 2, borderColor: C.ink, marginRight: 10}} />
          <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 12, letterSpacing: 3, color: C.inkSoft}}>
            04 / SKILLS
          </Text>
        </View>
        <Text style={{fontFamily: FONT.display, fontSize: m.type.h1, lineHeight: m.type.h1 * 1.1, color: C.ink}}>
          技能栈
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
          分数是我自己打的，标准只有一条：能不能在没有搜索引擎的情况下独立完成一个线上需求。
        </Text>
      </View>

      {/* 能力分组 */}
      <Grid columns={m.isDesktop ? 2 : 1} gap={18} style={{marginBottom: 8}}>
        {skills.map(g => (
          <SkillGroupCard key={g.group} group={g} index={0} />
        ))}
      </Grid>

      {/* 工具箱 */}
      <Section index="01" title="工具箱" en="TOOLBOX" color={C.orange} headerSize={m.type.h2}>
        <Block bg={C.white} pad={{h: 22, v: 20}} radius={R.lg} shadow={5}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {TOOLBOX.map((t, i) => (
              <View key={t} style={{marginRight: 8, marginBottom: 10}}>
                <Tag label={t} color={pickAccent(i)} variant="outline" size="md" />
              </View>
            ))}
          </View>
        </Block>
      </Section>

      {/* 在学 */}
      <Section index="02" title="正在补课" en="IN PROGRESS" color={C.green} headerSize={m.type.h2}>
        <Grid columns={m.isDesktop ? 3 : 1} gap={16}>
          {LEARNING.map(l => (
            <Block
              key={l.title}
              bg={C.white}
              pad={{h: 20, v: 18}}
              radius={R.lg}
              shadow={6}
              style={{flex: 1, minHeight: 150}}>
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: l.color,
                  borderWidth: 2,
                  borderColor: C.ink,
                  borderRadius: R.sm,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  marginBottom: 12,
                }}>
                <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 10, color: C.ink}}>LEARNING</Text>
              </View>
              <Text style={{fontFamily: FONT.display, fontSize: 17, lineHeight: 24, color: C.ink}}>{l.title}</Text>
              <Text
                style={{fontFamily: FONT.body, fontSize: 13, lineHeight: 21, color: C.inkSoft, marginTop: 8, flex: 1}}>
                {l.desc}
              </Text>
              <View style={{marginTop: 14}}>
                <ScoreDots level={l.level} color={l.color} />
              </View>
            </Block>
          ))}
        </Grid>
      </Section>

      {/* 五端支持说明 */}
      <Section index="03" title="五端支持" en="PLATFORM MATRIX" color={C.blue} headerSize={m.type.h2}>
        <Block bg={C.ink} pad={{h: 22, v: 20}} radius={R.lg} shadow={6} shadowColor={C.cyan}>
          {[
            {p: 'PC 浏览器', d: 'react-native-web · 断点自适应 320px → 4K', c: C.cyan, ok: true},
            {p: 'Android', d: 'React Native 0.75 · Hermes · 支持折叠屏', c: C.green, ok: true},
            {p: 'iOS', d: 'React Native 0.75 · 支持 iPad 与深色模式', c: C.magenta, ok: true},
            {p: '鸿蒙 HarmonyOS', d: 'RN-OH（@react-native-oh）· ArkTS 侧封装', c: C.yellow, ok: true},
            {p: '微信小程序', d: 'Taro 复刻 / 或 WebView 承载 H5 产物', c: C.violet, ok: true},
          ].map((row, i) => (
            <View
              key={row.p}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: i === 4 ? 0 : 1,
                borderBottomColor: '#3A2C6B',
              }}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: row.c,
                  borderWidth: 2,
                  borderColor: C.paper,
                  borderRadius: i % 2 ? 0 : 6,
                  marginRight: 12,
                }}
              />
              <View style={{width: m.isMobile ? 110 : 150}}>
                <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 14, color: C.paper}}>{row.p}</Text>
              </View>
              <Text style={{flex: 1, fontFamily: FONT.body, fontSize: 12, color: '#B9AEE0'}}>{row.d}</Text>
              <Text style={{fontFamily: FONT.display, fontSize: 12, color: row.c, marginLeft: 8}}>支持</Text>
            </View>
          ))}
        </Block>
      </Section>

      <Block bg={C.magenta} pad={{h: 26, v: 22}} radius={R.lg} shadow={6}>
        <View
          style={{
            flexDirection: m.isMobile ? 'column' : 'row',
            alignItems: m.isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: FONT.display,
              fontSize: m.type.h3,
              lineHeight: m.type.h3 * 1.4,
              color: C.ink,
              flexShrink: 1,
              marginBottom: m.isMobile ? 16 : 0,
            }}>
            这些技能用在了哪里？
          </Text>
          <NeoButton title="去看看作品 →" icon="◆" color={C.yellow} size="lg" onPress={() => onNavigate('works')} />
        </View>
      </Block>
    </View>
  );
}
