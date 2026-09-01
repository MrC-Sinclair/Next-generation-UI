const app = getApp();

Page({
  data: {
    url: ''
  },
  onLoad(options) {
    // 支持通过 /pages/index/index?url=xxx 覆盖默认地址，方便本地调试
    const url = options.url ? decodeURIComponent(options.url) : app.globalData.siteUrl;
    this.setData({ url });
  },
  onShareAppMessage() {
    return {
      title: 'CHROMA · 超色彩主义个人网站',
      path: '/pages/index/index'
    };
  }
});
