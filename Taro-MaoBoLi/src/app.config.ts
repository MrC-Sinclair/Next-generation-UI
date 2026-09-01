// 注：Taro 4.1.x/4.2.x 已知 bug（NervJS/taro#19031），app.config.ts 引入 @tarojs/taro
// 会在 Node 编译环境触发 @tarojs/runtime env.js 裸访问 window 导致 ReferenceError，
// 故按官方 workaround 移除 import，直接导出配置对象（功能等价）。
export default {
  pages: ['pages/index/index'],
  window: {
    // 使用自定义导航栏，让极光背景贯穿状态栏，观感更沉浸
    navigationStyle: 'custom',
    navigationBarBackgroundColor: '#04050d',
    navigationBarTextStyle: 'white',
    navigationBarTitleText: '林亦舟 · 全栈跨端工程师',
    backgroundTextStyle: 'light',
    backgroundColor: '#04050d'
  },
  // 暗色模式下的原生控件配色
  darkmode: true
}
