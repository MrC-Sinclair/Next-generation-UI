import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'

export type PlatformKey = 'h5' | 'weapp' | 'harmony' | 'rn' | 'unknown'

export const PLATFORM = (process.env.TARO_ENV || 'unknown') as PlatformKey
export const IS_H5 = PLATFORM === 'h5'
export const IS_WEAPP = PLATFORM === 'weapp'
export const IS_HARMONY = PLATFORM === 'harmony'
export const IS_RN = PLATFORM === 'rn'

/** 只有 H5 能稳定使用 backdrop-filter，其余端走渐变降级 */
export const SUPPORT_BLUR = IS_H5

type SysInfo = {
  statusBarHeight?: number
  windowWidth?: number
  windowHeight?: number
}

function readInfo(): SysInfo {
  try {
    const anyTaro = Taro as any
    const fn = anyTaro.getWindowInfo || anyTaro.getSystemInfoSync
    if (typeof fn === 'function') return fn() || {}
  } catch (_) {
    /* 忽略：某些端可能未实现 */
  }
  return {}
}

/** 自定义导航栏所需顶部安全距离（H5 由浏览器处理，返回 0） */
export function useSafeTop(): number {
  const [top, setTop] = useState(0)

  useEffect(() => {
    if (IS_H5) return
    setTop(Number(readInfo().statusBarHeight || 0) || 0)
  }, [])

  return top
}

/** 视口宽度：JS 侧的栅格 / 布局决策依据 */
export function useViewportWidth(): number {
  const [w, setW] = useState(0)

  useEffect(() => {
    const read = () => {
      const info = readInfo()
      const fallback = typeof window !== 'undefined' ? window.innerWidth : 375
      setW(Number(info.windowWidth || 0) || fallback)
    }

    read()

    if (IS_H5 && typeof window !== 'undefined') {
      window.addEventListener('resize', read)
      return () => window.removeEventListener('resize', read)
    }
    return undefined
  }, [])

  return w
}

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl'

export function bpOf(width: number): Breakpoint {
  if (!width) return 'sm'
  if (width >= 1440) return 'xl'
  if (width >= 1024) return 'lg'
  if (width >= 768) return 'md'
  return 'sm'
}

export function useBreakpoint(): Breakpoint {
  return bpOf(useViewportWidth())
}
