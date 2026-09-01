import { Text, View } from '@tarojs/components'
import SectionHeading from '../components/SectionHeading'
import { posts } from '../data/site'
import './BlogSection.scss'

export default function BlogSection() {
  return (
    <View className='blog' id='blog'>
      <View className='wrap'>
        <SectionHeading
          eyebrow='04 — WRITING'
          title='文章'
          desc='把踩过的坑写下来，免得下次再踩一遍。'
          delay={0.05}
        />

        <View className='blog__grid'>
          {posts.map((p, i) => (
            <View
              key={p.id}
              className={`bcard acc-${p.accent} rise`}
              style={{ animationDelay: `${0.1 + i * 0.07}s` }}
            >
              <View className='bcard__bar' />

              <View className='bcard__meta'>
                <View className='bcard__cat'>
                  <Text className='bcard__cat-text'>{p.category}</Text>
                </View>
                <Text className='bcard__date'>{p.date}</Text>
              </View>

              <Text className='bcard__title'>{p.title}</Text>
              <Text className='bcard__excerpt'>{p.excerpt}</Text>

              <View className='bcard__foot'>
                <Text className='bcard__read'>{p.readTime}</Text>
                <View className='bcard__arrow'>
                  <Text className='bcard__arrow-text'>阅读</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
