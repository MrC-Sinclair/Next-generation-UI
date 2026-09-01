import { useEffect, useState } from 'react'
import { Text, View } from '@tarojs/components'
import GlassCard from '../components/GlassCard'
import SectionHeading from '../components/SectionHeading'
import { skillGroups } from '../data/site'
import './SkillsSection.scss'

export default function SkillsSection() {
  // 挂载后再撑开进度条，让 width 过渡真实生效（小程序 / 鸿蒙同样支持 transition）
  const [grown, setGrown] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setGrown(true), 320)
    return () => clearTimeout(t)
  }, [])

  return (
    <View className='skills' id='skills'>
      <View className='wrap'>
        <SectionHeading
          eyebrow='02 — SKILLS'
          title='技能栈'
          desc='工具会过时，解决问题的能力不会。这里是我目前用得最顺手的那些。'
          delay={0.05}
        />

        <View className='skills__grid'>
          {skillGroups.map((g, gi) => (
            <GlassCard
              key={g.name}
              className={`skills__card acc-${g.accent}`}
              delay={0.1 + gi * 0.08}
              hover
            >
              <View className='skills__head'>
                <View className='skills__mark' />
                <View className='skills__head-text'>
                  <Text className='skills__name'>{g.name}</Text>
                  <Text className='skills__desc'>{g.desc}</Text>
                </View>
              </View>

              <View className='skills__list'>
                {g.items.map((s, si) => (
                  <View className='sk' key={s.name}>
                    <View className='sk__top'>
                      <Text className='sk__name'>{s.name}</Text>
                      <Text className='sk__val'>{s.level}</Text>
                    </View>

                    <View className='sk__track'>
                      <View
                        className='sk__fill'
                        style={{
                          width: grown ? `${s.level}%` : '0%',
                          transitionDelay: `${0.1 + gi * 0.08 + si * 0.06}s`
                        }}
                      />
                      <View className='sk__shine' />
                    </View>
                  </View>
                ))}
              </View>
            </GlassCard>
          ))}
        </View>
      </View>
    </View>
  )
}
