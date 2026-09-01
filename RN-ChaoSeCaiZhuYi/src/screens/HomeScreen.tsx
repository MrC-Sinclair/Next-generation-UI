import React from 'react';
import {Text, View} from 'react-native';
import {BORDER, C, FONT, R, S, W, hardShadow, pickAccent} from '../theme/tokens';
import {useResponsive} from '../utils/responsive';
import {NAV_ITEMS, ScreenKey, posts, profile, skills, works} from '../data/profile';
import {Block} from '../components/ui/Block';
import {NeoButton} from '../components/ui/Button';
import {Tag, TagRow} from '../components/ui/Tag';
import {Section} from '../components/ui/Section';
import {Grid} from '../components/ui/Grid';
import {StatCard, WorkCard, PostCard} from '../components/Cards';
import {DecorShapes, LiveDot, Marquee, Portrait, SpinSticker, Stripes} from '../components/ui/Decor';
import {Hoverable} from '../components/ui/Hoverable';

/* ============================================================
 *  首页概览 / OVERVIEW
 * ============================================================ */
export function HomeScreen({onNavigate}: {onNavigate: (key: ScreenKey) => void}) {
  const m = useResponsive();
  const rightWidth = m.isDesktop ? Math.min(320, m.width * 0.28) : '100%';

  return (
    <View>
      {/* ============ HERO ============ */}
      <View
        style={{
          flexDirection: m.isDesktop ? 'row' : 'column',
          alignItems: m.isDesktop ? 'flex-start' : 'stretch',
          marginBottom: 44,
        }}>
        {/* 左：标题与自我介绍 */}
        <View style={{flex: 1, minWidth: 0}}>
          <View
            style={[
              {
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: C.lime,
                borderWidth: BORDER.thin,
                borderColor: C.ink,
                borderRadius: R.pill,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginBottom: 18,
              },
              hardShadow(3, C.ink),
            ]}>
            <LiveDot color={C.ink} />
            <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 12, color: C.ink, marginLeft: 4}}>
              {profile.availability}
            </Text>
          </View>

          {/* 巨型标题 */}
          <Text
            style={{
              fontFamily: FONT.display,
              fontSize: m.type.mega,
              lineHeight: m.type.mega * 1.04,
              color: C.ink,
            }}>
            {profile.taglineParts.map((p, i) => (
              <Text key={i} style={{color: p.c ?? C.ink}}>
                {p.t}
              </Text>
            ))}
          </Text>

          {/* 姓名 / 身份 */}
          <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 24}}>
            <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: m.type.h3, color: C.ink}}>
              {profile.name}
            </Text>
            <View style={{width: 8, height: 8, backgroundColor: C.magenta, borderRadius: 4, marginHorizontal: 10}} />
            <Text
              style={{
                fontFamily: FONT.body,
                fontWeight: W.bold,
                fontSize: m.type.h3 * 0.8,
                color: C.inkSoft,
                letterSpacing: 1,
              }}>
              {profile.enName}
            </Text>
            <View style={{marginLeft: 12}}>
              <Tag label={profile.role} color={C.cyan} variant="solid" size="md" />
            </View>
          </View>

          <Text
            style={{
              fontFamily: FONT.body,
              fontSize: m.type.body,
              lineHeight: m.type.body * 1.75,
              color: C.inkSoft,
              marginTop: 18,
              maxWidth: 660,
            }}>
            {profile.summary[0]}
          </Text>

          {/* 关键词 */}
          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 22}}>
            {profile.heroKeywords.map((k, i) => (
              <View key={k} style={{marginRight: 8, marginBottom: 8}}>
                <Tag label={k} color={pickAccent(i)} variant="solid" />
              </View>
            ))}
          </View>

          {/* 行动按钮 */}
          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 26}}>
            <View style={{marginRight: 14, marginBottom: 10}}>
              <NeoButton title="看看我的作品" icon="◆" color={C.magenta} size="lg" onPress={() => onNavigate('works')} />
            </View>
            <View style={{marginBottom: 10}}>
              <NeoButton
                title="了解我"
                icon="◈"
                color={C.ink}
                variant="outline"
                size="lg"
                onPress={() => onNavigate('about')}
              />
            </View>
          </View>
        </View>

        {/* 右：头像拼贴 */}
        <View style={{width: rightWidth as any, marginTop: m.isDesktop ? 8 : 40, alignItems: m.isDesktop ? 'flex-end' : 'center'}}>
          <View style={{width: 210, height: 210}}>
            <Portrait text={profile.avatarText} bg={profile.avatarBg} ring={profile.avatarRing} size={180} />
            <View style={{position: 'absolute', right: -6, bottom: -14}}>
              <SpinSticker text="8 YEARS" bg={C.lime} size={88} />
            </View>
          </View>

          <View style={{width: 210, marginTop: 34}}>
            <Stripes height={12} />
          </View>

          <Block
            bg={C.ink}
            borderWidth={BORDER.base}
            radius={R.md}
            shadow={5}
            shadowColor={C.magenta}
            pad={{h: 14, v: 12}}
            style={{width: 210, marginTop: 12}}>
            <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 11, letterSpacing: 2, color: C.cyan}}>
              {profile.location.toUpperCase()}
            </Text>
            <Text style={{fontFamily: FONT.body, fontSize: 12, color: C.paper, marginTop: 5, lineHeight: 18}}>
              {profile.roleEn} · {profile.timezone}
            </Text>
            <Text style={{fontFamily: FONT.body, fontSize: 12, color: C.paper, marginTop: 2, lineHeight: 18}}>
              {profile.handle}
            </Text>
          </Block>
        </View>
      </View>

      {/* ============ 跑马灯 ============ */}
      <View style={{marginBottom: 44}}>
        <Marquee items={profile.marquee} />
      </View>

      {/* ============ 数据速览 ============ */}
      <View style={{marginBottom: 8}}>
        <Grid columns={m.isMobile ? 2 : 4} gap={14}>
          {profile.stats.map(s => (
            <StatCard key={s.label} value={s.value} unit={s.unit} label={s.label} color={s.color} />
          ))}
        </Grid>
      </View>

      {/* ============ 01 精选作品 ============ */}
      <Section
        index="01"
        title="精选作品"
        en="SELECTED WORKS"
        color={C.magenta}
        headerSize={m.type.h2}
        right={
          <NeoButton title="全部作品 →" color={C.magenta} size="sm" onPress={() => onNavigate('works')} />
        }>
        <Grid columns={m.columns} gap={18}>
          {works.slice(0, 3).map(w => (
            <WorkCard key={w.id} work={w} onPress={() => onNavigate('works')} />
          ))}
        </Grid>
      </Section>

      {/* ============ 02 技能速览 ============ */}
      <Section
        index="02"
        title="技能速览"
        en="SKILL STACK"
        color={C.cyan}
        headerSize={m.type.h2}
        right={<NeoButton title="完整技能栈 →" color={C.cyan} size="sm" onPress={() => onNavigate('skills')} />}>
        <Block bg={C.white} pad={{h: 24, v: 22}} radius={R.lg} shadow={6}>
          {skills.map((g, gi) => (
            <View
              key={g.group}
              style={{
                flexDirection: m.isMobile ? 'column' : 'row',
                alignItems: m.isMobile ? 'flex-start' : 'center',
                paddingVertical: 14,
                borderBottomWidth: gi === skills.length - 1 ? 0 : 2,
                borderBottomColor: C.paperDeep,
              }}>
              <View style={{width: m.isMobile ? '100%' : 168, marginBottom: m.isMobile ? 10 : 0}}>
                <Tag label={g.group} color={g.color} variant="solid" size="md" />
              </View>
              <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                {g.items.map((it, ii) => (
                  <View key={it.name} style={{marginRight: 8, marginBottom: 8}}>
                    <Tag label={`${it.name} ${it.level}`} color={g.color} />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </Block>
      </Section>

      {/* ============ 03 关于我 ============ */}
      <Section
        index="03"
        title="关于我"
        en="ABOUT ME"
        color={C.yellow}
        headerSize={m.type.h2}
        right={<NeoButton title="更多 →" color={C.yellow} size="sm" onPress={() => onNavigate('about')} />}>
        <Block bg={C.yellow} pad={{h: 26, v: 26}} radius={R.lg} shadow={7}>
          <View style={{flexDirection: m.isDesktop ? 'row' : 'column'}}>
            <View style={{marginRight: m.isDesktop ? 26 : 0, marginBottom: m.isDesktop ? 0 : 20, alignItems: 'center'}}>
              <View style={{marginLeft: 10, marginTop: 10}}>
                <Portrait text={profile.avatarText} bg={C.magenta} ring={C.cyan} size={128} />
              </View>
            </View>
            <View style={{flex: 1, minWidth: 0}}>
              <Text
                style={{
                  fontFamily: FONT.body,
                  fontSize: m.type.body,
                  lineHeight: m.type.body * 1.8,
                  color: C.ink,
                }}>
                {profile.summary[1]}
              </Text>

              <View style={{marginTop: 16}}>
                <TagRow items={profile.hobbies} color={C.ink} variant="outline" />
              </View>
            </View>
          </View>
        </Block>
      </Section>

      {/* ============ 04 最新文章 ============ */}
      <Section
        index="04"
        title="最新文章"
        en="FROM THE BLOG"
        color={C.violet}
        headerSize={m.type.h2}
        right={<NeoButton title="进入博客 →" color={C.violet} size="sm" onPress={() => onNavigate('blog')} />}>
        <Grid columns={m.columns} gap={18}>
          {posts
            .filter(p => p.featured)
            .slice(0, 3)
            .map(p => (
              <PostCard key={p.id} post={p} onPress={() => onNavigate('blog')} />
            ))}
        </Grid>
      </Section>

      {/* ============ 05 此刻 ============ */}
      <Section index="05" title="此刻" en="RIGHT NOW" color={C.lime} headerSize={m.type.h2}>
        <Grid columns={m.isMobile ? 1 : m.isDesktop ? 4 : 2} gap={14}>
          {profile.now.map((n, i) => (
            <Hoverable
              key={n.label}
              style={{flex: 1}}
              hoverStyle={{transform: [{translateX: -3}, {translateY: -3}]} as any}>
              <Block bg={C.white} pad={{h: 16, v: 16}} radius={R.md} shadow={5} style={{flex: 1, minHeight: 108}}>
                <View style={{position: 'relative'}}>
                  <DecorShapes variant={i} />
                  <Tag label={n.label} color={n.color} variant="solid" />
                  <Text
                    style={{
                      fontFamily: FONT.body,
                      fontWeight: W.bold,
                      fontSize: 14,
                      lineHeight: 21,
                      color: C.ink,
                      marginTop: 12,
                    }}>
                    {n.text}
                  </Text>
                </View>
              </Block>
            </Hoverable>
          ))}
        </Grid>
      </Section>

      {/* ============ 导航快捷入口 ============ */}
      <View style={{marginTop: 8}}>
        <Block bg={C.paperDeep} pad={{h: 20, v: 18}} radius={R.lg} shadow={0} borderWidth={BORDER.thin}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            {NAV_ITEMS.filter(n => n.key !== 'home').map(n => (
              <View key={n.key} style={{marginRight: 12, marginBottom: 6}}>
                <NeoButton
                  title={n.label}
                  icon={n.icon}
                  color={n.color}
                  size="sm"
                  variant="outline"
                  onPress={() => onNavigate(n.key)}
                />
              </View>
            ))}
          </View>
        </Block>
      </View>
    </View>
  );
}
