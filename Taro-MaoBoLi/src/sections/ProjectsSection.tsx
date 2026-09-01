import { Text, View } from '@tarojs/components'
import SectionHeading from '../components/SectionHeading'
import { projects } from '../data/site'
import './ProjectsSection.scss'

export default function ProjectsSection() {
  return (
    <View className='projects' id='projects'>
      <View className='wrap'>
        <SectionHeading
          eyebrow='03 — WORK'
          title='作品集'
          desc='从组件库到迁移工具链，每个项目都解决了一个真实存在的问题。'
          delay={0.05}
        />

        <View className='projects__grid'>
          {projects.map((p, i) => (
            <View
              key={p.id}
              className={`pcard acc-${p.accent} rise ${p.featured ? 'pcard--wide' : ''}`}
              style={{ animationDelay: `${0.1 + i * 0.07}s` }}
            >
              <View className='pcard__aura' />
              <View className='pcard__sheen' />

              <View className='pcard__inner'>
                <View className='pcard__top'>
                  <Text className='pcard__year'>{p.year}</Text>
                  <Text className='pcard__metric'>{p.metric}</Text>
                </View>

                <Text className='pcard__metric-label'>{p.metricLabel}</Text>

                <Text className='pcard__name'>{p.name}</Text>
                <Text className='pcard__subtitle'>{p.subtitle}</Text>
                <Text className='pcard__desc'>{p.desc}</Text>

                <View className='pcard__tags'>
                  {p.tags.map((t) => (
                    <View key={t} className='pcard__tag'>
                      <Text className='pcard__tag-text'>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
