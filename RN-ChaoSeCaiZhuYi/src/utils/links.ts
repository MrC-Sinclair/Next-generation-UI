import {Linking, Platform} from 'react-native';

/** 跨端打开外链：Web 用新窗口，原生端走系统浏览器 */
export function openUrl(url: string) {
  if (Platform.OS === 'web') {
    (window as any)?.open?.(url, '_blank', 'noopener,noreferrer');
    return;
  }
  Linking.openURL(url).catch(() => {});
}

/** 跨端复制文本：Web 走 navigator.clipboard，原生端走 RN Clipboard */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (Platform.OS === 'web') {
      await (navigator as any)?.clipboard?.writeText?.(text);
      return true;
    }
    const Clipboard = require('react-native').Clipboard;
    if (Clipboard?.setString) Clipboard.setString(text);
    return true;
  } catch (e) {
    return false;
  }
}

/** 跨端发送邮件 */
export function sendEmail(email: string, subject = '你好，我在你的网站上看到你') {
  openUrl(`mailto:${email}?subject=${encodeURIComponent(subject)}`);
}
