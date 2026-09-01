/**
 * Capacitor 配置（可选路径）
 *
 * 用于把 build:h5 的产物直接打包成安卓 / iOS 原生 App。
 * 适合个人主页这类内容型站点：不需要配置 Xcode / Android Studio 的 RN 原生环境，
 * 一条命令就能产出真机可装的 APK / IPA。
 *
 * 首次使用：
 *   npm i -D @capacitor/cli @capacitor/core
 *   npm i @capacitor/android @capacitor/ios
 *   npx cap add android && npx cap add ios
 *   npm run build:h5 && npx cap sync
 *   npx cap open android   # 或 npx cap open ios
 */
const config = {
  appId: 'dev.yizhou.site',
  appName: '林亦舟',
  webDir: 'dist/h5',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#04050d',
      showSpinner: false
    }
  }
}

export default config
