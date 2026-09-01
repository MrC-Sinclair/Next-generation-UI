const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro 配置：Android / iOS / 鸿蒙（RN-OH）共用
 * ------------------------------------------------------------
 * - 让 Metro 认识 .web.tsx 之外的平台后缀；
 * - 支持 @/ 别名指向 src/；
 * - 鸿蒙侧由 @react-native-oh/react-native-harmony 注入平台后缀 `.harmony`，
 *   这里预留 sourceExts，保证 `xxx.harmony.tsx` 优先命中。
 */
const config = {
  resolver: {
    sourceExts: ['harmony.tsx', 'harmony.ts', 'tsx', 'ts', 'jsx', 'js', 'json'],
    extraNodeModules: {},
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  watchFolders: [path.resolve(__dirname, 'src')],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
