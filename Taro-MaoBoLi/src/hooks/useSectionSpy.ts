import { useCallback, useRef, useState } from 'react'
import Taro from '@tarojs/taro'

/**
 * 区块滚动联动
 *
 * 在 scrollTop = 0 时测量一次，此时 boundingClientRect().top 即等于
 * 该区块在 ScrollView 内容坐标系里的偏移量（页面本身不滚动）。
 * 测量失败时静默降级：导航不高亮，其余功能不受影响。
 */
export function useSectionSpy(ids: string[]) {
  const tops = useRef<Record<string, number>>({})
  const [active, setActive] = useState<string>(ids[0] ?? '')

  const measure = useCallback(() => {
    ids.forEach((id) => {
      try {
        Taro.createSelectorQuery()
          .select(`#${id}`)
          .boundingClientRect()
          .selectViewport()
          .scrollOffset()
          .exec((res: any[]) => {
            const rect = res?.[0]
            const off = res?.[1]
            if (rect && typeof rect.top === 'number') {
              tops.current[id] = rect.top + (off?.scrollTop || 0)
            }
          })
      } catch (_) {
        /* 某些端不支持选择器查询，忽略 */
      }
    })
  }, [ids])

  const sync = useCallback((scrollTop: number) => {
    const entries = Object.entries(tops.current)
    if (!entries.length) return

    let cur = entries[0][0]
    let curTop = Number.NEGATIVE_INFINITY

    entries.forEach(([id, top]) => {
      if (scrollTop + 160 >= top && top >= curTop) {
        cur = id
        curTop = top
      }
    })

    setActive(cur)
  }, [])

  return { measure, sync, active, setActive }
}
