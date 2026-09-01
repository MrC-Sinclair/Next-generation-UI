import React, {useRef} from 'react';
import {Pressable, ScrollView, StatusBar, Text, View} from 'react-native';
import {BORDER, C, FONT, R, W, cursorPointer, hardShadow, noSelect} from '../../theme/tokens';
import {Metrics, useResponsive} from '../../utils/responsive';
import {NAV_ITEMS, ScreenKey, profile} from '../../data/profile';
import {LiveDot, Stripes} from '../ui/Decor';

/* ============================================================
 *  AppShell：全站外壳与导航
 *  - PC（>=1024）  ：左侧固定侧边栏
 *  - 平板（600-1023）：顶部横向导航
 *  - 手机 / 小程序（<600）：底部 Tab 栏
 * ============================================================ */

export function AppShell({
  active,
  onChange,
  children,
}: {
  active: ScreenKey;
  onChange: (key: ScreenKey) => void;
  children: React.ReactNode;
}) {
  const m = useResponsive();
  const scrollRef = useRef<ScrollView>(null);

  const go = (key: ScreenKey) => {
    onChange(key);
    scrollRef.current?.scrollTo({y: 0, animated: false});
  };

  return (
    <View style={{flex: 1, backgroundColor: C.paper}}>
      <StatusBar barStyle="dark-content" backgroundColor={C.paper} />

      <View style={{flex: 1, flexDirection: m.showSidebar ? 'row' : 'column'}}>
        {m.showSidebar && <Sidebar m={m} active={active} onPress={go} />}
        {m.showTopBar && <TopBar m={m} active={active} onPress={go} />}

        <View style={{flex: 1, minWidth: 0}}>
          <ScrollView
            ref={scrollRef}
            style={{flex: 1}}
            contentContainerStyle={{
              paddingHorizontal: m.gutter,
              paddingTop: m.isDesktop ? 44 : 24,
              paddingBottom: m.isMobile ? 96 : 64,
              alignItems: 'center',
            }}
            showsVerticalScrollIndicator={false}>
            <View style={{width: '100%', maxWidth: m.contentMaxWidth}}>{children}</View>

            <SiteFooter m={m} onPress={go} />
          </ScrollView>
        </View>

        {m.showBottomTabs && <BottomTabs m={m} active={active} onPress={go} />}
      </View>
    </View>
  );
}

/* ---------------- 侧边栏（PC） ---------------- */
function Sidebar({
  m,
  active,
  onPress,
}: {
  m: Metrics;
  active: ScreenKey;
  onPress: (k: ScreenKey) => void;
}) {
  return (
    <View
      style={{
        width: m.sidebarWidth,
        backgroundColor: C.ink,
        paddingTop: 32,
        paddingBottom: 28,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        borderRightWidth: BORDER.base,
        borderRightColor: C.ink,
      }}>
      <View>
        {/* Logo */}
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
          {[C.magenta, C.yellow, C.cyan].map((c, i) => (
            <View
              key={i}
              style={{
                width: 16,
                height: 16,
                backgroundColor: c,
                borderWidth: 2,
                borderColor: C.paper,
                borderRadius: i === 1 ? 0 : 3,
                marginRight: 4,
              }}
            />
          ))}
          <Text style={{fontFamily: FONT.display, fontSize: 22, color: C.paper, marginLeft: 6}}>CHROMA</Text>
        </View>
        <Text
          style={{
            fontFamily: FONT.body,
            fontWeight: W.bold,
            fontSize: 10,
            letterSpacing: 2.4,
            color: C.cyan,
            marginBottom: 26,
          }}>
          超色彩主义 / HYPERCHROMA
        </Text>

        {/* 导航 */}
        {NAV_ITEMS.map(item => {
          const isActive = item.key === active;
          return (
            <Pressable
              key={item.key}
              onPress={() => onPress(item.key)}
              style={({pressed}) => [
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 11,
                  paddingHorizontal: 12,
                  marginBottom: 8,
                  borderRadius: R.md,
                  backgroundColor: isActive ? item.color : 'transparent',
                  borderWidth: isActive ? BORDER.thin : 0,
                  borderColor: C.ink,
                  transform: [{translateX: pressed && !isActive ? 2 : 0}],
                },
                isActive ? hardShadow(3, C.paper) : null,
                cursorPointer,
                noSelect,
              ]}>
              <Text
                style={{
                  fontFamily: FONT.display,
                  fontSize: 13,
                  color: isActive ? C.ink : item.color,
                  width: 22,
                }}>
                {item.icon}
              </Text>
              <Text
                style={{
                  fontFamily: FONT.body,
                  fontWeight: W.bold,
                  fontSize: 15,
                  color: isActive ? C.ink : C.paper,
                  flex: 1,
                }}>
                {item.label}
              </Text>
              <Text style={{fontFamily: FONT.body, fontSize: 9, letterSpacing: 1.2, color: isActive ? C.ink : '#8A7FB5'}}>
                {item.en}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View>
        <Stripes height={10} />
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 18}}>
          <LiveDot />
          <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 12, color: C.paper, marginLeft: 4}}>
            {profile.availability}
          </Text>
        </View>
        <Text style={{fontFamily: FONT.body, fontSize: 11, color: '#8A7FB5', marginTop: 6}}>
          {profile.location} · {profile.timezone}
        </Text>
        <Text style={{fontFamily: FONT.body, fontSize: 11, color: '#8A7FB5', marginTop: 2}}>
          © {new Date().getFullYear()} {profile.enName}
        </Text>
      </View>
    </View>
  );
}

/* ---------------- 顶栏（平板 / 手机横屏） ---------------- */
function TopBar({m, active, onPress}: {m: Metrics; active: ScreenKey; onPress: (k: ScreenKey) => void}) {
  return (
    <View style={{backgroundColor: C.ink, borderBottomWidth: BORDER.base, borderBottomColor: C.ink}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: m.gutter,
          paddingTop: 12,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 16}}>
          <View
            style={{
              width: 22,
              height: 22,
              backgroundColor: C.magenta,
              borderWidth: 2,
              borderColor: C.paper,
              borderRadius: 4,
              marginRight: 8,
            }}
          />
          <Text style={{fontFamily: FONT.display, fontSize: 17, color: C.paper}}>CHROMA</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flex: 1}}>
          {NAV_ITEMS.map(item => {
            const isActive = item.key === active;
            return (
              <Pressable
                key={item.key}
                onPress={() => onPress(item.key)}
                style={[
                  {
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: R.pill,
                    marginRight: 8,
                    borderWidth: BORDER.thin,
                    borderColor: isActive ? item.color : '#3A2C6B',
                    backgroundColor: isActive ? item.color : 'transparent',
                  },
                  cursorPointer,
                ]}>
                <Text
                  style={{
                    fontFamily: FONT.body,
                    fontWeight: W.bold,
                    fontSize: 13,
                    color: isActive ? C.ink : C.paper,
                  }}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <Stripes height={8} />
    </View>
  );
}

/* ---------------- 底部 Tab（手机 / 小程序） ---------------- */
function BottomTabs({m, active, onPress}: {m: Metrics; active: ScreenKey; onPress: (k: ScreenKey) => void}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: C.ink,
        borderTopWidth: BORDER.base,
        borderTopColor: C.ink,
        paddingTop: 8,
        paddingBottom: 10,
      }}>
      {NAV_ITEMS.map(item => {
        const isActive = item.key === active;
        return (
          <Pressable
            key={item.key}
            onPress={() => onPress(item.key)}
            style={[{flex: 1, alignItems: 'center', paddingHorizontal: 2}, cursorPointer]}>
            <View
              style={{
                width: 30,
                height: 26,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isActive ? item.color : 'transparent',
                borderWidth: isActive ? 2 : 0,
                borderColor: C.paper,
              }}>
              <Text style={{fontFamily: FONT.display, fontSize: 12, color: isActive ? C.ink : item.color}}>
                {item.icon}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: FONT.body,
                fontWeight: W.bold,
                fontSize: 10,
                marginTop: 3,
                color: isActive ? C.paper : '#8A7FB5',
              }}
              numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------------- 页脚 ---------------- */
function SiteFooter({m, onPress}: {m: Metrics; onPress: (k: ScreenKey) => void}) {
  return (
    <View style={{width: '100%', maxWidth: m.contentMaxWidth, marginTop: 56}}>
      <Stripes height={12} />
      <View
        style={{
          borderWidth: BORDER.base,
          borderColor: C.ink,
          borderRadius: R.lg,
          backgroundColor: C.violet,
          padding: 20,
          marginTop: -1,
          flexDirection: m.isMobile ? 'column' : 'row',
          alignItems: m.isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          ...(hardShadow(6, C.ink) as object),
        }}>
        <View style={{flexShrink: 1, marginBottom: m.isMobile ? 14 : 0}}>
          <Text style={{fontFamily: FONT.display, fontSize: m.isMobile ? 20 : 24, color: C.paper}}>
            想一起做点颜色很吵的东西？
          </Text>
          <Text style={{fontFamily: FONT.body, fontSize: 13, color: '#E4DBFF', marginTop: 6}}>
            {profile.availability} · 通常在 24 小时内回复
          </Text>
        </View>
        <Pressable
          onPress={() => onPress('contact')}
          style={[
            {
              backgroundColor: C.yellow,
              borderWidth: BORDER.base,
              borderColor: C.ink,
              borderRadius: R.pill,
              paddingHorizontal: 22,
              paddingVertical: 11,
            },
            hardShadow(4, C.ink),
            cursorPointer,
          ]}>
          <Text style={{fontFamily: FONT.display, fontSize: 14, color: C.ink}}>联系我 →</Text>
        </Pressable>
      </View>

      <Text
        style={{
          fontFamily: FONT.body,
          fontSize: 11,
          color: C.inkSoft,
          textAlign: 'center',
          marginTop: 22,
          marginBottom: 8,
        }}>
        Built with React Native · 一套代码跑 PC / Android / iOS / 鸿蒙 / 小程序
      </Text>
    </View>
  );
}
