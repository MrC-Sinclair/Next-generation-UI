import { Text, View } from '@tarojs/components'
import { profile } from '../data/site'
import './SiteFooter.scss'

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <View className='footer'>
      <View className='wrap footer__inner'>
        <View className='footer__brand'>
          <View className='footer__mono'>
            <Text className='footer__mono-text'>{profile.monogram}</Text>
          </View>
          <Text className='footer__name'>
            {profile.name} · {profile.nameEn}
          </Text>
        </View>

        <Text className='footer__note'>
          本站由 Taro 4 单代码库构建 · 同时运行于 PC / 安卓 / iOS / 鸿蒙 / 微信小程序
        </Text>

        <Text className='footer__copy'>© {year} {profile.name}. All rights reserved.</Text>
      </View>
    </View>
  )
}
