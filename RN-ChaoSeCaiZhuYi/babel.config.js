/**
 * Babel 配置
 * ------------------------------------------------------------
 * 原生端（Metro / Android / iOS / 鸿蒙）：使用 RN 官方 preset，
 *   它可以处理 RN 源码里的 Flow 语法 + 应用里的 TSX。
 * Web 端（webpack）：babel-loader 里用 `configFile: false`
 *   走内联 preset，与原生端解耦，互不影响。
 */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
};
