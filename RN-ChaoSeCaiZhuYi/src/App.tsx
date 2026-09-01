import React, {useState} from 'react';
import {AppShell} from './components/layout/AppShell';
import {ScreenKey} from './data/profile';
import {HomeScreen} from './screens/HomeScreen';
import {AboutScreen} from './screens/AboutScreen';
import {WorksScreen} from './screens/WorksScreen';
import {SkillsScreen} from './screens/SkillsScreen';
import {BlogScreen} from './screens/BlogScreen';
import {ContactScreen} from './screens/ContactScreen';

/* ============================================================
 *  CHROMA · 超色彩主义个人网站
 * ------------------------------------------------------------
 *  同一份 src/ 会被打进 5 个端：
 *    PC 浏览器      → webpack + react-native-web（本项目 web/）
 *    Android / iOS  → Metro + React Native 原生（根目录 index.js）
 *    鸿蒙           → RN-OH（@react-native-oh/react-native-harmony）
 *    微信小程序      → Taro 复刻 / 或 WebView 承载 H5 产物（miniapp/）
 * ============================================================ */

export type ScreenProps = {onNavigate: (key: ScreenKey) => void};

const SCREENS: Record<ScreenKey, React.FC<ScreenProps>> = {
  home: HomeScreen,
  about: AboutScreen,
  works: WorksScreen,
  skills: SkillsScreen,
  blog: BlogScreen,
  contact: ContactScreen,
};

export default function App() {
  const [active, setActive] = useState<ScreenKey>('home');
  const Screen = SCREENS[active];

  return (
    <AppShell active={active} onChange={setActive}>
      <Screen onNavigate={setActive} />
    </AppShell>
  );
}
