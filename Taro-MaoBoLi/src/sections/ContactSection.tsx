import { Text, View } from '@tarojs/components'
import GlassCard from '../components/GlassCard'
import SectionHeading from '../components/SectionHeading'
import { contacts, profile } from '../data/site'
import { copyText } from '../utils/clipboard'
import './ContactSection.scss'

export default function ContactSection() {
  return (
    <View className='contact' id='contact'>
      <View className='wrap'>
        <SectionHeading
          eyebrow='05 — CONTACT'
          title='聊聊？'
          desc='无论是合作、技术咨询，还是单纯想聊聊跨端和动效——我都很乐意。'
          delay={0.05}
        />

        <GlassCard className='contact__card' delay={0.12} radius='xl'>
          <View className='contact__aura' />

          <Text className='contact__lead'>有一个想法，或者只是想打个招呼</Text>
          <Text className='contact__sub'>选一个顺手的方式，我一般 24 小时内回。</Text>

          <View className='contact__grid'>
            {contacts.map((c) => (
              <View key={c.key} className='contact__item' onClick={() => copyText(c.copy)}>
                <Text className='contact__label'>{c.label}</Text>
                <Text className='contact__value'>{c.value}</Text>
                <View className='contact__hint'>
                  <Text className='contact__hint-text'>点击复制</Text>
                </View>
              </View>
            ))}
          </View>

          <View className='contact__cta'>
            <View className='btn btn--primary' onClick={() => copyText(contacts[0]?.copy ?? '')}>
              <Text>复制邮箱地址</Text>
            </View>
            <View className='btn btn--ghost'>
              <Text>下载简历</Text>
            </View>
          </View>
        </GlassCard>
      </View>
    </View>
  )
}
