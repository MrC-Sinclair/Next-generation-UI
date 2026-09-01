import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, View } from '@tarojs/components'
import AuroraBackdrop from '../../components/AuroraBackdrop'
import PointerGlow from '../../components/PointerGlow'
import TopNav, { type NavItem } from '../../components/TopNav'
import AboutSection from '../../sections/AboutSection'
import BlogSection from '../../sections/BlogSection'
import ContactSection from '../../sections/ContactSection'
import HeroSection from '../../sections/HeroSection'
import ProjectsSection from '../../sections/ProjectsSection'
import SiteFooter from '../../sections/SiteFooter'
import SkillsSection from '../../sections/SkillsSection'
import { useSafeTop } from '../../hooks/useEnv'
import { useSectionSpy } from '../../hooks/useSectionSpy'
import './index.scss'

const NAV: NavItem[] = [
  { id: 'hero', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '作品' },
  { id: 'blog', label: '文章' },
  { id: 'contact', label: '联系' }
]

const IDS = NAV.map((n) => n.id)

export default function Index() {
  const safeTop = useSafeTop()
  const { measure, sync, active, setActive } = useSectionSpy(IDS)
  const [into, setInto] = useState('')
  const lastSync = useRef(0)

  // 布局稳定后测量各区块位置，供导航高亮使用
  useEffect(() => {
    const t = setTimeout(() => measure(), 420)
    return () => clearTimeout(t)
  }, [measure])

  const goTo = useCallback(
    (id: string) => {
      setActive(id)
      // 先清空再赋值：scrollIntoView 对相同值不会重复触发
      setInto('')
      setTimeout(() => setInto(id), 30)
    },
    [setActive]
  )

  const onScroll = useCallback(
    (e: any) => {
      const now = Date.now()
      if (now - lastSync.current < 100) return
      lastSync.current = now
      sync(e?.detail?.scrollTop ?? 0)
    },
    [sync]
  )

  return (
    <View className='page'>
      <AuroraBackdrop />
      <PointerGlow />

      <TopNav items={NAV} active={active} onNav={goTo} safeTop={safeTop} />

      <ScrollView
        className='page__scroll'
        scrollY
        scrollWithAnimation
        scrollIntoView={into}
        showScrollbar={false}
        onScroll={onScroll}
      >
        <View className='page__content'>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <BlogSection />
          <ContactSection />
          <SiteFooter />
        </View>
      </ScrollView>
    </View>
  )
}
