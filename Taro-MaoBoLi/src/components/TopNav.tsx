import { Text, View } from '@tarojs/components'
import { profile } from '../data/site'
import './TopNav.scss'

export interface NavItem {
  id: string
  label: string
}

interface Props {
  items: NavItem[]
  active: string
  onNav: (id: string) => void
  /** 自定义导航栏需要的状态栏高度 */
  safeTop: number
}

/**
 * 玻璃导航
 *
 * 桌面端（≥1024px）：顶部悬浮玻璃条 + 文字导航
 * 移动端 / 小程序 / 鸿蒙：底部悬浮玻璃 Dock（两字标签，拇指可达）
 * 纯 CSS 媒体查询切换，无需 JS 判断端类型
 */
export default function TopNav({ items, active, onNav, safeTop }: Props) {
  const home = items[0]?.id ?? 'hero'

  return (
    <>
      <View className='topnav' style={{ paddingTop: `${safeTop}px` }}>
        <View className='topnav__inner'>
          <View className='topnav__brand' onClick={() => onNav(home)}>
            <View className='topnav__mono'>
              <Text className='topnav__mono-text'>{profile.monogram}</Text>
            </View>
            <View className='topnav__names'>
              <Text className='topnav__name'>{profile.name}</Text>
              <Text className='topnav__role'>{profile.title}</Text>
            </View>
          </View>

          <View className='topnav__links'>
            {items.map((it) => (
              <View
                key={it.id}
                className={`topnav__link ${active === it.id ? 'is-active' : ''}`}
                onClick={() => onNav(it.id)}
              >
                <Text className='topnav__link-text'>{it.label}</Text>
              </View>
            ))}
          </View>

          <View className='topnav__status'>
            <View className='topnav__pulse'>
              <View className='topnav__pulse-ring' />
              <View className='topnav__pulse-dot' />
            </View>
            <Text className='topnav__status-text'>{profile.status}</Text>
          </View>
        </View>
      </View>

      <View className='docknav'>
        <View className='docknav__inner'>
          {items.map((it) => (
            <View
              key={it.id}
              className={`docknav__item ${active === it.id ? 'is-active' : ''}`}
              onClick={() => onNav(it.id)}
            >
              <Text className='docknav__item-text'>{it.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  )
}
