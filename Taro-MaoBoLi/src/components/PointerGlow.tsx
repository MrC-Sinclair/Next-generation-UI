import { useEffect, useRef } from 'react'
import { View } from '@tarojs/components'
import { IS_H5 } from '../hooks/useEnv'
import './PointerGlow.scss'

/**
 * 鼠标跟随光晕（仅 H5）
 *
 * 用 rAF 节流 + transform 位移，只触发合成层，不触发布局回流。
 * 触屏端与小程序 / 鸿蒙直接返回 null。
 */
export default function PointerGlow() {
  const ref = useRef<any>(null)

  useEffect(() => {
    if (!IS_H5 || typeof window === 'undefined') return undefined

    const el = ref.current as HTMLElement | null
    if (!el) return undefined

    let raf = 0
    let shown = false

    const onMove = (e: MouseEvent) => {
      if (!shown) {
        shown = true
        el.classList.add('pointer-glow--on')
      }
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!IS_H5) return null

  return <View ref={ref} className='pointer-glow' />
}
