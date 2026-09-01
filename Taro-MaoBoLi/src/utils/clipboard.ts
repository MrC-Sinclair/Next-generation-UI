import Taro from '@tarojs/taro'

/** 复制文本（H5 / 小程序 / 鸿蒙通用），失败时静默 */
export function copyText(text: string, tip = '已复制到剪贴板') {
  try {
    Taro.setClipboardData({
      data: text,
      success: () => {
        Taro.showToast?.({ title: tip, icon: 'none', duration: 1600 })
      }
    })
  } catch (_) {
    try {
      Taro.showToast?.({ title: text, icon: 'none', duration: 2000 })
    } catch (__) {
      /* 兜底：什么都不做 */
    }
  }
}
