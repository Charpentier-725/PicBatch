export default {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
    __DEV__: false
  },
  mini: {
    // 生产环境小程序配置
    enableSourceMap: false, // 生产环境关闭 source map
    minifyXML: {
      collapseWhitespace: true // 压缩 XML
    },

    // Webpack 生产环境优化
    webpackChain(chain) {
      // 生产环境压缩优化
      chain.merge({
        optimization: {
          minimize: true,
          splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
              // 提取公共依赖
              common: {
                name: 'common',
                minChunks: 2,
                priority: 1
              },
              // 提取第三方库
              vendors: {
                name: 'vendors',
                test: /[\\/]node_modules[\\/]/,
                priority: 10
              },
              // 提取 Taro 框架代码
              taro: {
                name: 'taro',
                test: /[\\/]node_modules[\\/]@tarojs[\\/]/,
                priority: 15
              }
            }
          }
        }
      })

      // 压缩配置
      chain.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions = {
          ...args[0].terserOptions,
          compress: {
            drop_console: true, // 移除 console
            drop_debugger: true, // 移除 debugger
            pure_funcs: ['console.log'] // 移除 console.log
          }
        }
        return args
      })
    }
  },
  h5: {
    // H5 生产环境配置
    publicPath: '/',

    // 生产环境输出优化
    output: {
      filename: 'js/[name].[contenthash:8].js',
      chunkFilename: 'js/[name].[contenthash:8].js'
    },

    // CSS 提取配置
    miniCssExtractPluginOption: {
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css'
    },

    // Webpack 生产环境优化
    webpackChain(chain) {
      // 代码分割优化
      chain.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          },
          taro: {
            name: 'taro',
            test: /[\\/]node_modules[\\/]@tarojs[\\/]/,
            priority: 15
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5
          }
        }
      })

      // 生产环境性能优化
      chain.merge({
        performance: {
          hints: 'warning',
          maxEntrypointSize: 512000, // 入口文件最大 500KB
          maxAssetSize: 512000 // 资源文件最大 500KB
        }
      })
    }
  }
}
