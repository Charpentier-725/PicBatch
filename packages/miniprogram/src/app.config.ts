export default defineAppConfig({
  pages: [
    'pages/index/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '轻图 - 图片处理',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f5f5f5',
    enablePullDownRefresh: false
  },
  tabBar: {
    color: '#666666',
    selectedColor: '#8B7355',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '处理',
        iconPath: 'assets/icons/process.png',
        selectedIconPath: 'assets/icons/process-active.png'
      }
    ]
  },
  lazyCodeLoading: 'requiredComponents',
  darkmode: true,
  themeLocation: 'theme.json',
  permission: {
    'scope.writePhotosAlbum': {
      desc: '需要保存处理后的图片到相册'
    }
  }
})
