/**
 * 字体加载：霞鹜文楷（中文手写）+ Caveat / Patrick Hand（英文手写）
 *
 * 可读性关键决策：中文正文统一用 Medium 字重。
 * Regular 笔画太细，页面被缩小显示（嵌入式预览、缩放）时会"淡墨化"看不清。
 */
import { useFonts } from 'expo-font';

export function useSiteFonts() {
  return useFonts({
    // 中文手写正文 → Medium（笔画粗，抗缩放）
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    LXGWWenKai: require('../../assets/fonts/LXGWWenKai-Medium.ttf'),
    // 中文手写加重 → 同 Medium（保持 token 兼容）
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    LXGWWenKaiMedium: require('../../assets/fonts/LXGWWenKai-Medium.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Caveat: require('../../assets/fonts/Caveat.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    PatrickHand: require('../../assets/fonts/PatrickHand-Regular.ttf'),
  });
}
