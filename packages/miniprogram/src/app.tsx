import { PropsWithChildren } from 'react'
import { useLaunch, useDidShow, useDidHide } from '@tarojs/taro'
import './app.scss'

function App({ children }: PropsWithChildren) {
  // 应用启动生命周期
  useLaunch(() => {
    console.log('轻图 PicBatch 小程序启动')
    console.log('Version: 1.2.0')
    console.log('Environment:', process.env.NODE_ENV)
  })

  // 应用显示生命周期
  useDidShow(() => {
    console.log('小程序显示')
  })

  // 应用隐藏生命周期
  useDidHide(() => {
    console.log('小程序隐藏')
  })

  // children 是将要会渲染的页面
  return children
}

export default App
