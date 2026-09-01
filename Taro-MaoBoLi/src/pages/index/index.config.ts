// 注：Taro 已知 bug（NervJS/taro#19031），*.config.ts 引入 @tarojs/taro 会在编译期触发 window 引用错误，
// 按官方 workaround 直接导出配置对象。
export default {
  navigationStyle: 'custom',
  navigationBarTitleText: '林亦舟 · 全栈跨端工程师',
  disableScroll: true
}
