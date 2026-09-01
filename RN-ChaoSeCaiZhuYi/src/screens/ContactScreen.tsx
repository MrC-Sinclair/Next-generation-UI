import React, {useState} from 'react';
import {Pressable, ScrollView, Text, TextInput, View} from 'react-native';
import {BORDER, C, FONT, R, S, W, cursorPointer, hardShadow} from '../theme/tokens';
import {useResponsive} from '../utils/responsive';
import {ScreenKey, contacts, profile, socials} from '../data/profile';
import {Block} from '../components/ui/Block';
import {NeoButton} from '../components/ui/Button';
import {Grid} from '../components/ui/Grid';
import {Hoverable} from '../components/ui/Hoverable';
import {LiveDot, SpinSticker, Stripes} from '../components/ui/Decor';
import {copyText, openUrl, sendEmail} from '../utils/links';

/* ============================================================
 *  联系方式 / CONTACT
 * ============================================================ */
export function ContactScreen({onNavigate}: {onNavigate: (key: ScreenKey) => void}) {
  const m = useResponsive();
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({name: '', email: '', message: ''});
  const [sent, setSent] = useState(false);

  const onCopy = async (key: string, value: string) => {
    const ok = await copyText(value);
    if (ok) {
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    }
  };

  const onSubmit = () => {
    const subject = `[来自网站] ${form.name || '新朋友'} 想聊聊`;
    const body = `${form.message}\n\n---\n${form.name} · ${form.email}`;
    if (typeof window !== 'undefined') {
      openUrl(`mailto:hi@kola.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    } else {
      sendEmail('hi@kola.dev', subject);
    }
    setSent(true);
  };

  return (
    <View>
      {/* 头部 */}
      <View style={{marginBottom: 26}}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View style={{width: 26, height: 26, backgroundColor: C.orange, borderWidth: 2, borderColor: C.ink, marginRight: 10}} />
          <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 12, letterSpacing: 3, color: C.inkSoft}}>
            06 / CONTACT
          </Text>
        </View>
        <Text style={{fontFamily: FONT.display, fontSize: m.type.h1, lineHeight: m.type.h1 * 1.1, color: C.ink}}>
          联系方式
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 14, flexWrap: 'wrap'}}>
          <LiveDot />
          <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 14, color: C.ink, marginLeft: 4}}>
            {profile.availability}
          </Text>
          <Text style={{fontFamily: FONT.body, fontSize: 13, color: C.inkSoft, marginLeft: 12}}>
            一般 24 小时内回复 · {profile.timezone}
          </Text>
        </View>
      </View>

      {/* 联系方式卡片 */}
      <Grid columns={m.isMobile ? 1 : m.isDesktop ? 3 : 2} gap={16} style={{marginBottom: 10}}>
        {contacts.map(c => (
          <Hoverable
            key={c.key}
            style={{flex: 1}}
            hoverStyle={{transform: [{translateX: -3}, {translateY: -3}]} as any}>
            <Block bg={c.color} pad={{h: 18, v: 16}} radius={R.md} shadow={5} style={{flex: 1, minHeight: 118}}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: C.ink,
                    backgroundColor: C.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{fontFamily: FONT.display, fontSize: 13, color: C.ink}}>{c.icon}</Text>
                </View>
                <Text
                  style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 12, letterSpacing: 1.5, color: C.ink, marginLeft: 10}}>
                  {c.label}
                </Text>
              </View>

              <Text
                style={{
                  fontFamily: FONT.body,
                  fontWeight: W.bold,
                  fontSize: 15,
                  color: C.ink,
                  flexShrink: 1,
                }}>
                {c.value}
              </Text>

              {c.copyable && (
                <Pressable
                  onPress={() => onCopy(c.key, c.value)}
                  style={[
                    {
                      alignSelf: 'flex-start',
                      marginTop: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 5,
                      borderRadius: R.pill,
                      borderWidth: 2,
                      borderColor: C.ink,
                      backgroundColor: copied === c.key ? C.lime : C.white,
                    },
                    cursorPointer,
                  ]}>
                  <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 11, color: C.ink}}>
                    {copied === c.key ? '✓ 已复制' : '复制'}
                  </Text>
                </Pressable>
              )}
            </Block>
          </Hoverable>
        ))}
      </Grid>

      {/* 表单 + 社交 */}
      <View style={{flexDirection: m.isDesktop ? 'row' : 'column', marginTop: 26}}>
        {/* 表单 */}
        <View style={{flex: 1.6, marginRight: m.isDesktop ? 20 : 0, marginBottom: 24}}>
          <Block bg={C.white} pad={{h: 24, v: 22}} radius={R.lg} shadow={6}>
            <Text style={{fontFamily: FONT.display, fontSize: m.type.h3, color: C.ink, marginBottom: 6}}>
              直接说事儿
            </Text>
            <Text style={{fontFamily: FONT.body, fontSize: 13, color: C.inkSoft, marginBottom: 18}}>
              填完点发送会唤起你的邮件客户端，内容已经帮你写好。
            </Text>

            <Field
              label="你的名字"
              value={form.name}
              onChange={v => setForm({...form, name: v})}
              placeholder="怎么称呼？"
              color={C.magenta}
            />
            <Field
              label="邮箱"
              value={form.email}
              onChange={v => setForm({...form, email: v})}
              placeholder="you@example.com"
              color={C.cyan}
            />
            <Field
              label="想聊什么"
              value={form.message}
              onChange={v => setForm({...form, message: v})}
              placeholder="项目背景、时间节点、预算区间，随便写。"
              color={C.yellow}
              multiline
            />

            <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 6}}>
              <View style={{marginRight: 12, marginBottom: 8}}>
                <NeoButton title="发送 →" icon="✉" color={C.magenta} size="lg" onPress={onSubmit} />
              </View>
              {sent && (
                <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 13, color: C.green}}>
                  ✓ 已为你打开邮件客户端
                </Text>
              )}
            </View>
          </Block>
        </View>

        {/* 社交 */}
        <View style={{width: m.isDesktop ? 260 : '100%'}}>
          <Block bg={C.ink} pad={{h: 18, v: 18}} radius={R.lg} shadow={6} shadowColor={C.magenta}>
            <Text
              style={{
                fontFamily: FONT.body,
                fontWeight: W.bold,
                fontSize: 11,
                letterSpacing: 2,
                color: C.cyan,
                marginBottom: 14,
              }}>
              ELSEWHERE
            </Text>
            {socials.map(s => (
              <Pressable
                key={s.label}
                onPress={() => openUrl(s.url)}
                style={({pressed}) => [
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 11,
                    borderBottomWidth: 1,
                    borderBottomColor: '#3A2C6B',
                    opacity: pressed ? 0.6 : 1,
                  },
                  cursorPointer,
                ]}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    backgroundColor: s.color,
                    borderWidth: 2,
                    borderColor: C.paper,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                  <Text style={{fontFamily: FONT.display, fontSize: 9, color: s.color === C.ink ? C.paper : C.ink}}>
                    {s.short}
                  </Text>
                </View>
                <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 14, color: C.paper, flex: 1}}>
                  {s.label}
                </Text>
                <Text style={{fontFamily: FONT.body, fontSize: 13, color: '#8A7FB5'}}>↗</Text>
              </Pressable>
            ))}
          </Block>

          <View style={{alignItems: 'center', marginTop: 22}}>
            <SpinSticker text="SAY HELLO" bg={C.lime} size={104} />
          </View>
        </View>
      </View>

      {/* 说明 */}
      <View style={{marginTop: 10}}>
        <Block bg={C.paperDeep} pad={{h: 20, v: 18}} radius={R.lg} shadow={0} borderWidth={BORDER.thin}>
          <Text
            style={{
              fontFamily: FONT.body,
              fontSize: 13,
              lineHeight: 22,
              color: C.inkSoft,
            }}>
            合作方式：长期项目、短期咨询、技术评审都接。远程优先，杭州本地可以线下喝咖啡。
            {'\n'}
            不接：纯切图还原、没有决策人的需求、以及要求"五彩斑斓的黑"但拒绝看参考的brief。
          </Text>
        </Block>
      </View>

      <View style={{marginTop: 26}}>
        <Stripes height={12} />
      </View>
    </View>
  );
}

/* ---------------- 表单字段 ---------------- */
function Field({
  label,
  value,
  onChange,
  placeholder,
  color,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  color: string;
  multiline?: boolean;
}) {
  return (
    <View style={{marginBottom: 16}}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
        <View style={{width: 10, height: 10, backgroundColor: color, borderWidth: 2, borderColor: C.ink, marginRight: 8}} />
        <Text style={{fontFamily: FONT.body, fontWeight: W.bold, fontSize: 12, color: C.ink}}>{label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#9A8FC4"
        multiline={multiline}
        style={[
          {
            borderWidth: BORDER.base,
            borderColor: C.ink,
            borderRadius: R.md,
            backgroundColor: C.paper,
            paddingHorizontal: 14,
            paddingVertical: multiline ? 12 : 11,
            fontFamily: FONT.body,
            fontSize: 14,
            color: C.ink,
            minHeight: multiline ? 104 : 46,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          hardShadow(3, C.ink),
        ]}
      />
    </View>
  );
}
