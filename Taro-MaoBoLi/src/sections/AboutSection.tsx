import { Text, View } from '@tarojs/components'
import GlassCard from '../components/GlassCard'
import SectionHeading from '../components/SectionHeading'
import { milestones, profile } from '../data/site'
import './AboutSection.scss'

export default function AboutSection() {
  return (
    <View className='about' id='about'>
      <View className='wrap'>
        <SectionHeading
          eyebrow='01 — ABOUT'
          title='关于我'
          desc='写代码是我的手艺，也是我理解世界的方式。'
          delay={0.05}
        />

        <View className='about__grid'>
          <GlassCard className='about__card' delay={0.12}>
            <Text className='about__lead'>「{profile.tagline}」</Text>
            <Text className='about__text'>{profile.intro}</Text>

            <View className='about__meta'>
              <View className='about__meta-item'>
                <Text className='about__meta-key'>坐标</Text>
                <Text className='about__meta-val'>{profile.city}</Text>
              </View>
              <View className='about__meta-item'>
                <Text className='about__meta-key'>状态</Text>
                <Text className='about__meta-val'>{profile.status}</Text>
              </View>
            </View>
          </GlassCard>

          {/* 经历时间线 */}
          <View className='about__timeline'>
            {milestones.map((m, i) => (
              <View
                key={m.year + m.role}
                className='tl__item rise'
                style={{ animationDelay: `${0.16 + i * 0.09}s` }}
              >
                <View className='tl__axis'>
                  <View className='tl__dot' />
                </View>

                <View className='tl__body'>
                  <Text className='tl__year'>{m.year}</Text>
                  <Text className='tl__role'>{m.role}</Text>
                  <Text className='tl__org'>{m.org}</Text>
                  <Text className='tl__desc'>{m.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}
