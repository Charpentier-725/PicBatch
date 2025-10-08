export default {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    __DEV__: true
  },
  mini: {
    // 开发环境小程序配置
    enableSourceMap: true, // 启用 source map,方便调试
    debugReact: true, // 启用 React DevTools

    // Webpack DevServer 配置
    webpackChain(chain) {
      // 开发环境优化
      chain.devtool('cheap-module-source-map')

      // 开发环境性能配置
      chain.optimization.minimize(false)
    },

    // 小程序开发者工具配置
    compile: {
      exclude: [
        // 排除不需要编译的文件
        (modulePath) => /node_modules/.test(modulePath) &&
                        !/taro/.test(modulePath)
      ]
    }
  },
  h5: {
    // H5 开发环境配置
    devServer: {
      host: 'localhost',
      port: 10086,
      https: false,
      hot: true,
      open: true
    },

    // H5 开发模式优化
    webpackChain(chain) {
      // 开发环境快速构建
      chain.devtool('eval-cheap-module-source-map')

      // 禁用压缩以加快构建速度
      chain.optimization.minimize(false)

      // 热更新优化
      chain.optimization.runtimeChunk('single')
    }
  }
}
