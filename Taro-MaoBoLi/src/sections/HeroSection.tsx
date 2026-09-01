import { Text, View } from '@tarojs/components'
import { cta, profile, stats } from '../data/site'
import './HeroSection.scss'

const ORB_CHIPS = ['Taro', 'ArkTS', 'React']

export default function HeroSection() {
  return (
    <View className='hero' id='hero'>
      <View className='wrap hero__inner'>
        {/* ── 左：文案 ── */}
        <View className='hero__copy'>
          <View className='hero__badge rise' style={{ animationDelay: '0.05s' }}>
            <View className='hero__badge-dot' />
            <Text className='hero__badge-text'>
              {profile.status} · {profile.city}
            </Text>
          </View>

          <Text className='hero__hello rise' style={{ animationDelay: '0.12s' }}>
            你好，我是
          </Text>

          <Text className='hero__name rise aurora-text' style={{ animationDelay: '0.18s' }}>
            {profile.name}
          </Text>

          <Text className='hero__title rise' style={{ animationDelay: '0.26s' }}>
            {profile.title}
          </Text>

          <View className='hero__rule rise' style={{ animationDelay: '0.32s' }} />

          <Text className='hero__tagline rise' style={{ animationDelay: '0.36s' }}>
            {profile.tagline}
          </Text>

          <Text className='hero__intro rise' style={{ animationDelay: '0.42s' }}>
            {profile.intro}
          </Text>

          <View className='hero__cta rise' style={{ animationDelay: '0.5s' }}>
            <View className='btn btn--primary'>
              <Text>{cta.primary}</Text>
            </View>
            <View className='btn btn--ghost'>
              <Text>{cta.secondary}</Text>
            </View>
          </View>
        </View>

        {/* ── 右：液态头像球 ── */}
        <View className='hero__visual rise' style={{ animationDelay: '0.3s' }}>
          <View className='orb'>
            <View className='orb__glow' />
            <View className='orb__ring' />
            <View className='orb__ring orb__ring--2' />
            <View className='orb__glass'>
              <Text className='orb__mono'>{profile.monogram}</Text>
            </View>

            {ORB_CHIPS.map((c, i) => (
              <View key={c} className={`orb__chip orb__chip--${i + 1}`}>
                <Text className='orb__chip-text'>{c}</Text>
              </View>
            ))}
          </View>

          {/* 数据条 */}
          <View className='hero__stats'>
            {stats.map((s) => (
              <View key={s.label} className='hero__stat'>
                <Text className='hero__stat-value'>{s.value}</Text>
                <Text className='hero__stat-label'>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}
