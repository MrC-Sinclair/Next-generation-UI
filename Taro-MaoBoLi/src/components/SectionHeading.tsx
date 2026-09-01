import { Text, View } from '@tarojs/components'
import './SectionHeading.scss'

interface Props {
  /** 小标签，如 01 — ABOUT */
  eyebrow: string
  title: string
  desc?: string
  delay?: number
}

export default function SectionHeading({ eyebrow, title, desc, delay = 0 }: Props) {
  return (
    <View className='sechead rise' style={{ animationDelay: `${delay}s` }}>
      <View className='sechead__eyebrow'>
        <View className='sechead__bar' />
        <Text className='sechead__eyebrow-text'>{eyebrow}</Text>
      </View>

      <Text className='sechead__title'>{title}</Text>

      {desc ? <Text className='sechead__desc'>{desc}</Text> : null}
    </View>
  )
}
