import React from 'react';
import {Text, View} from 'react-native';
import {ACCENTS, BORDER, C, FONT, R, S, W, hardShadow, pickAccent} from '../theme/tokens';
import {useResponsive} from '../utils/responsive';
import {ScreenKey, profile} from '../data/profile';
import {Block} from '../components/ui/Block';
import {NeoButton} from '../components/ui/Button';
import {Tag, TagRow} from '../components/ui/Tag';
import {Section} from '../components/ui/Section';
import {Grid} from '../components/ui/Grid';
import {StatCard} from '../components/Cards';
import {DecorShapes, Portrait, SpinSticker, Stripes} from '../components/ui/Decor';

/* ============================================================
 *  关于我 / ABOUT
 * ============================================================ */
export function AboutScreen({onNavigate}: {onNavigate: (key: ScreenKey) => void}) {
  const m = useResponsive();
  const swatchCols = m.isMobile ? 4 : m.isDesktop ? 8 : 6;

  return (
    <View>
      {/* ============ 头部 ============ */}
      <View style={{marginBottom: 40}}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View style={{width: 26, height: 26, backgroundColor: C.cyan, borderWidth: 2, borderColor: C.ink, marginRight: 10}} />
          <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 12, letterSpacing: 3, color: C.inkSoft}}>
            02 / ABOUT ME
          </Text>
        </View>
        <Text style={{fontFamily: FONT.display, fontSize: m.type.h1, lineHeight: m.type.h1 * 1.1, color: C.ink}}>
          关于我
        </Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 14}}>
          <View style={{maxWidth: 720, flexShrink: 1}}>
            <Text
              style={{
                fontFamily: FONT.body,
                fontSize: m.type.h3,
                lineHeight: m.type.h3 * 1.7,
                color: C.ink,
              }}>
              {profile.name}，{profile.role}。住在{profile.location.replace('中国 · ', '')}，用一套代码养五个端。
            </Text>
          </View>
        </View>
      </View>

      {/* ============ 正文：左档案 / 右长文 ============ */}
      <View style={{flexDirection: m.isDesktop ? 'row' : 'column', marginBottom: 20}}>
        {/* 左：档案卡 */}
        <View style={{width: m.isDesktop ? 300 : '100%', marginRight: m.isDesktop ? 28 : 0, marginBottom: 24}}>
          <View style={{alignItems: 'center', marginBottom: 18, marginLeft: 10, marginTop: 10}}>
            <Portrait text={profile.avatarText} bg={C.violet} ring={C.yellow} size={168} />
          </View>

          <Block bg={C.ink} pad={{h: 16, v: 16}} radius={R.md} shadow={6} shadowColor={C.cyan}>
            {[
              ['NAME', `${profile.name} / ${profile.enName}`],
              ['ROLE', profile.roleEn],
              ['BASE', profile.location],
              ['STATUS', profile.availability],
              ['CONTACT', profile.handle],
            ].map(([k, v], i) => (
              <View
                key={k}
                style={{
                  paddingVertical: 9,
                  borderBottomWidth: i === 4 ? 0 : 1,
                  borderBottomColor: '#3A2C6B',
                }}>
                <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 10, letterSpacing: 2, color: C.cyan}}>
                  {k}
                </Text>
                <Text style={{fontFamily: FONT.body, fontSize: 13, color: C.paper, marginTop: 3}}>{v}</Text>
              </View>
            ))}
          </Block>

          <View style={{marginTop: 18}}>
            <Stripes height={12} />
          </View>

          <Block bg={C.magenta} pad={{h: 16, v: 14}} radius={R.md} shadow={5} style={{marginTop: 12}}>
            <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 13, lineHeight: 20, color: C.ink}}>
              “设计不是把东西变好看，是让选择变少。”
            </Text>
          </Block>
        </View>

        {/* 右：长文 */}
        <View style={{flex: 1, minWidth: 0}}>
          <Block bg={C.white} pad={{h: 28, v: 26}} radius={R.lg} shadow={6}>
            <Text
              style={{
                fontFamily: FONT.display,
                fontSize: m.type.h3,
                lineHeight: m.type.h3 * 1.4,
                color: C.ink,
                marginBottom: 16,
              }}>
              我怎么走到这里的
            </Text>
            {profile.summary.map((p, i) => (
              <Text
                key={i}
                style={{
                  fontFamily: FONT.body,
                  fontSize: m.type.body,
                  lineHeight: m.type.body * 1.85,
                  color: i === 0 ? C.ink : C.inkSoft,
                  marginBottom: 16,
                }}>
                {p}
              </Text>
            ))}

            <View style={{height: 3, backgroundColor: C.paperDeep, marginVertical: 8}} />

            <Text
              style={{
                fontFamily: FONT.body,
                fontSize: m.type.body,
                lineHeight: m.type.body * 1.85,
                color: C.inkSoft,
              }}>
              如果你也在做跨平台，或者只是想聊聊配色，随时找我。我不接"照着稿子还原就行"的活儿，但很乐意一起把定义问题的那一步做扎实。
            </Text>

            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 22}}>
              <View style={{marginRight: 12, marginBottom: 10}}>
                <NeoButton title="看看作品" icon="◆" color={C.magenta} onPress={() => onNavigate('works')} />
              </View>
              <NeoButton title="联系我" icon="✉" color={C.ink} variant="outline" onPress={() => onNavigate('contact')} />
            </View>
          </Block>

          {/* 数字 */}
          <View style={{marginTop: 22}}>
            <Grid columns={m.isMobile ? 2 : 4} gap={14}>
              {profile.stats.map(s => (
                <StatCard key={s.label} value={s.value} unit={s.unit} label={s.label} color={s.color} />
              ))}
            </Grid>
          </View>
        </View>
      </View>

      {/* ============ 经历时间线 ============ */}
      <Section index="01" title="经历" en="TIMELINE" color={C.magenta} headerSize={m.type.h2}>
        <View>
          {profile.timeline.map((t, i) => (
            <View key={t.year} style={{flexDirection: 'row'}}>
              {/* 轴 */}
              <View style={{width: 44, alignItems: 'center'}}>
                <View
                  style={{
                    width: 22,
                    height: 22,
                    backgroundColor: t.color,
                    borderWidth: BORDER.thin,
                    borderColor: C.ink,
                    borderRadius: 3,
                    transform: [{rotate: '45deg'}],
                    marginTop: 4,
                  }}
                />
                {i < profile.timeline.length - 1 && (
                  <View style={{width: 3, flex: 1, backgroundColor: C.ink, marginTop: 6, marginBottom: 4}} />
                )}
              </View>

              {/* 内容 */}
              <View style={{flex: 1, paddingLeft: 12, paddingBottom: i === profile.timeline.length - 1 ? 0 : 30}}>
                <Tag label={t.year} color={t.color} variant="solid" />
                <Text
                  style={{
                    fontFamily: FONT.display,
                    fontSize: m.type.h3,
                    lineHeight: m.type.h3 * 1.3,
                    color: C.ink,
                    marginTop: 8,
                  }}>
                  {t.title}
                </Text>
                <Text
                  style={{
                    fontFamily: FONT.body,
                    fontWeight: W.bold,
                    fontSize: 13,
                    color: t.color,
                    marginTop: 3,
                  }}>
                  {t.org}
                </Text>
                <Text
                  style={{
                    fontFamily: FONT.body,
                    fontSize: m.type.body - 1,
                    lineHeight: (m.type.body - 1) * 1.8,
                    color: C.inkSoft,
                    marginTop: 8,
                    maxWidth: 720,
                  }}>
                  {t.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Section>

      {/* ============ 工作方式 ============ */}
      <Section index="02" title="我怎么工作" en="HOW I WORK" color={C.cyan} headerSize={m.type.h2}>
        <Grid columns={m.isDesktop ? 2 : 1} gap={18}>
          {profile.values.map((v, i) => (
            <Block
              key={v.title}
              bg={C.white}
              pad={{h: 22, v: 20}}
              radius={R.lg}
              shadow={6}
              style={{flex: 1, minHeight: 150, overflow: 'hidden'}}>
              <View style={{position: 'relative'}}>
                <DecorShapes variant={i} />
                <View
                  style={[
                    {
                      width: 46,
                      height: 46,
                      backgroundColor: v.color,
                      borderWidth: BORDER.thin,
                      borderColor: C.ink,
                      borderRadius: R.sm,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 14,
                    },
                    hardShadow(3, C.ink),
                  ]}>
                  <Text style={{fontFamily: FONT.display, fontSize: 20, color: C.ink}}>{v.icon}</Text>
                </View>
                <Text style={{fontFamily: FONT.display, fontSize: 18, lineHeight: 25, color: C.ink}}>{v.title}</Text>
                <Text
                  style={{
                    fontFamily: FONT.body,
                    fontSize: 14,
                    lineHeight: 23,
                    color: C.inkSoft,
                    marginTop: 8,
                  }}>
                  {v.desc}
                </Text>
              </View>
            </Block>
          ))}
        </Grid>
      </Section>

      {/* ============ 此刻 ============ */}
      <Section index="03" title="此刻在做" en="RIGHT NOW" color={C.yellow} headerSize={m.type.h2}>
        <Block bg={C.ink} pad={{h: 24, v: 22}} radius={R.lg} shadow={6} shadowColor={C.yellow}>
          <Grid columns={m.isMobile ? 1 : m.isDesktop ? 4 : 2} gap={14}>
            {profile.now.map(n => (
              <View key={n.label} style={{flex: 1}}>
                <View
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: n.color,
                    borderWidth: 2,
                    borderColor: C.paper,
                    borderRadius: R.pill,
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    marginBottom: 10,
                  }}>
                  <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 11, color: C.ink}}>{n.label}</Text>
                </View>
                <Text style={{fontFamily: FONT.body, fontSize: 14, lineHeight: 22, color: C.paper}}>{n.text}</Text>
              </View>
            ))}
          </Grid>
        </Block>
      </Section>

      {/* ============ 爱好 + 色卡墙 ============ */}
      <Section index="04" title="爱好与收藏" en="OFF THE CLOCK" color={C.violet} headerSize={m.type.h2}>
        <Block bg={C.paperDeep} pad={{h: 24, v: 22}} radius={R.lg} shadow={0} borderWidth={BORDER.thin}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20}}>
            {profile.hobbies.map((h, i) => (
              <View key={h} style={{marginRight: 8, marginBottom: 8}}>
                <Tag label={h} color={pickAccent(i)} variant="solid" size="md" />
              </View>
            ))}
          </View>

          <Text
            style={{
              fontFamily: FONT.body,
              fontWeight: W.bold,
              fontSize: 13,
              color: C.inkSoft,
              marginBottom: 12,
            }}>
            我的城市色卡收藏 · CHROMA SWATCH WALL
          </Text>

          <Grid columns={swatchCols} gap={8}>
            {Array.from({length: swatchCols * 2}).map((_, i) => (
              <View
                key={i}
                style={{
                  aspectRatio: 1,
                  backgroundColor: ACCENTS[i % ACCENTS.length],
                  borderWidth: 2,
                  borderColor: C.ink,
                  borderRadius: i % 5 === 0 ? 8 : 3,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingBottom: 3,
                }}>
                <Text style={{fontFamily: FONT.display, fontSize: 8, color: C.ink, opacity: 0.7}}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
              </View>
            ))}
          </Grid>
        </Block>
      </Section>

      {/* 收尾 CTA */}
      <Block bg={C.lime} pad={{h: 26, v: 24}} radius={R.lg} shadow={6}>
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
            想看看我做出来的东西？
          </Text>
          <NeoButton title="进入作品集 →" icon="◆" color={C.magenta} size="lg" onPress={() => onNavigate('works')} />
        </View>
      </Block>
    </View>
  );
}
