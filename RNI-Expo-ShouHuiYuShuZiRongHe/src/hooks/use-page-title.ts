/**
 * 设置 web 页签标题（仅 web 生效）
 */
import { useEffect } from 'react';
import { Platform } from 'react-native';

export function usePageTitle(title: string) {
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.title = title;
    }
  }, [title]);
}
