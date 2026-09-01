import type { ReactNode } from 'react'
import { View } from '@tarojs/components'
import './GlassCard.scss'

interface Props {
  children?: ReactNode
  className?: string
  /** 是否启用 H5 悬停抬升 */
  hover?: boolean
  /** 入场动画延迟（秒） */
  delay?: number
  /** 圆角档位 */
  radius?: 'md' | 'lg' | 'xl'
  onClick?: () => void
}

/**
 * 液态毛玻璃卡片
 *
 * 结构：玻璃基座 + 顶部高光条 + 内容。
 * 入场用 animation-fill-mode: both，即便某端不支持动画也只是「不动画」，不会白屏。
 */
export default function GlassCard({
  children,
  className = '',
  hover = false,
  delay = 0,
  radius = 'lg',
  onClick
}: Props) {
  return (
    <View
      className={`gcard gcard--${radius} rise ${hover ? 'gcard--hover' : ''} ${className}`}
      style={{ animationDelay: `${delay}s` }}
      onClick={onClick}
    >
      <View className='gcard__sheen' />
      <View className='gcard__body'>{children}</View>
    </View>
  )
}
