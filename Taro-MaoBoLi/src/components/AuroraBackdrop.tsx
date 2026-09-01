import { View } from '@tarojs/components'
import './AuroraBackdrop.scss'

/**
 * 极光流动背景
 *
 * 固定在视口底层，不参与滚动。
 * H5 上启用高斯模糊 + 液态形变；小程序 / 鸿蒙降级为纯径向渐变（性能与兼容性考虑）。
 */
export default function AuroraBackdrop() {
  return (
    <View className='aurora'>
      <View className='aurora__grid' />
      <View className='aurora__blob aurora__blob--cyan' />
      <View className='aurora__blob aurora__blob--blue' />
      <View className='aurora__blob aurora__blob--violet' />
      <View className='aurora__blob aurora__blob--magenta' />
      <View className='aurora__veil' />
    </View>
  )
}
