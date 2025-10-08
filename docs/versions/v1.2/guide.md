# Version 1.2 实施指南

## ✅ 已完成内容

### 1. 技术规划 ✅
- 📄 完整的技术方案文档 ([version-1.2-plan.md](./version-1.2-plan.md))
- 🏗️ Monorepo 架构设计
- 🔧 Taro 框架选型

### 2. 项目结构搭建 ✅
- ✅ 创建 `packages/` 目录结构
- ✅ 创建 `packages/shared` 共享逻辑包
- ✅ 创建 `packages/miniprogram` 小程序包骨架
- ✅ 提取平台无关的核心算法

### 3. 共享代码包 (packages/shared) ✅

**已完成文件:**
- `package.json` - 包配置
- `tsconfig.json` - TypeScript 配置
- `lib/types.ts` - 类型定义 (从 src/types/index.ts 复制)
- `lib/crop.ts` - 裁剪逻辑 (从 src/lib/crop.ts 复制)
- `lib/rename.ts` - 重命名逻辑 (从 src/lib/rename.ts 复制)
- `lib/smartCompress.ts` - 原始压缩逻辑
- `lib/compress-core.ts` - ✨ 新建：平台无关的压缩算法
- `lib/index.ts` - 导出文件

**核心特性:**
- 纯计算逻辑,无浏览器 API 依赖
- 可在 Web 和小程序环境中复用
- TypeScript 严格模式

### 4. 小程序项目骨架 (packages/miniprogram) 🚧

**已完成文件:**
- `package.json` - Taro 依赖配置
- `config/index.ts` - Taro 构建配置

**待完成文件** (下一步):
- `config/dev.ts` - 开发环境配置
- `config/prod.ts` - 生产环境配置
- `project.config.json` - 微信小程序配置
- `src/app.tsx` - 应用入口
- `src/app.config.ts` - 应用配置
- `src/app.scss` - 全局样式

---

## 📋 下一步实施步骤

### Step 1: 完成 Taro 配置文件

#### 1.1 创建 `config/dev.ts`
```typescript
export default {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {}
}
```

#### 1.2 创建 `config/prod.ts`
```typescript
export default {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    /**
     * WebpackChain 插件配置
     * @docs https://github.com/neutrinojs/webpack-chain
     */
    // webpackChain (chain) {
    //   /**
     *    * 如果 h5 端编译后体积过大,可以使用 webpack-bundle-analyzer 插件对打包体积进行分析。
     *    * @docs https://github.com/webpack-contrib/webpack-bundle-analyzer
     */
    //   chain.plugin('analyzer')
    //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
    //   /**
     *    * 如果 h5 端首屏加载时间过长,可以使用 prerender-spa-plugin 插件预加载首页。
     *    * @docs https://github.com/chrisvfritz/prerender-spa-plugin
     */
    //   const path = require('path')
    //   const Prerender = require('prerender-spa-plugin')
    //   const staticDir = path.join(__dirname, '..', 'dist')
    //   chain
    //     .plugin('prerender')
    //     .use(new Prerender({
    //       staticDir,
    //       routes: [ '/pages/index/index' ],
    //       postProcess: (context) => ({ ...context, outputPath: path.join(staticDir, 'index.html') })
    //     }))
    // }
  }
}
```

#### 1.3 创建 `project.config.json`
```json
{
  "miniprogramRoot": "dist/",
  "projectname": "PicBatch",
  "description": "免费在线图片批量处理工具 - 微信小程序版",
  "appid": "touristappid",
  "setting": {
    "urlCheck": true,
    "es6": false,
    "enhance": true,
    "compileHotReLoad": false,
    "postcss": false,
    "minified": false
  },
  "compileType": "miniprogram"
}
```

### Step 2: 创建应用入口文件

#### 2.1 创建 `src/app.config.ts`
```typescript
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/result/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'PicBatch - 轻图',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f8f8f8'
  },
  tabBar: {
    color: '#666',
    selectedColor: '#0066ff',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '处理',
        iconPath: 'assets/tab-home.png',
        selectedIconPath: 'assets/tab-home-active.png'
      }
    ]
  },
  darkmode: true,
  themeLocation: 'theme.json',
  lazyCodeLoading: 'requiredComponents'
})
```

#### 2.2 创建 `src/app.tsx`
```typescript
import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return children
}

export default App
```

#### 2.3 创建 `src/app.scss`
```scss
@import '@nutui/nutui-react-taro/dist/styles/variables.scss';

page {
  background-color: #f8f8f8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}
```

### Step 3: 创建主页面

#### 3.1 创建 `src/pages/index/index.config.ts`
```typescript
export default definePageConfig({
  navigationBarTitleText: 'PicBatch - 图片批处理',
  enablePullDownRefresh: false
})
```

#### 3.2 创建 `src/pages/index/index.tsx`
```typescript
import { useState } from 'react'
import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton, AtImagePicker } from 'taro-ui'
import './index.scss'

interface UploadedFile {
  url: string
  file: Taro.chooseImage.ImageFile
}

export default function Index() {
  const [files, setFiles] = useState<UploadedFile[]>([])

  const handleChooseImage = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera']
      })

      const newFiles = res.tempFiles.map(file => ({
        url: file.path,
        file: file
      }))

      setFiles([...files, ...newFiles])
    } catch (error) {
      Taro.showToast({
        title: '选择图片失败',
        icon: 'error'
      })
    }
  }

  const handleProcess = () => {
    if (files.length === 0) {
      Taro.showToast({
        title: '请先选择图片',
        icon: 'none'
      })
      return
    }

    // TODO: 实现图片处理逻辑
    Taro.showToast({
      title: '开始处理',
      icon: 'loading',
      duration: 2000
    })
  }

  return (
    <View className='index'>
      <View className='header'>
        <View className='title'>PicBatch</View>
        <View className='subtitle'>轻图 - 图片批处理工具</View>
      </View>

      <View className='upload-section'>
        <AtButton onClick={handleChooseImage}>
          选择图片 ({files.length}/9)
        </AtButton>

        <View className='image-grid'>
          {files.map((item, index) => (
            <Image
              key={index}
              src={item.url}
              className='preview-image'
              mode='aspectFill'
            />
          ))}
        </View>
      </View>

      <View className='action-section'>
        <AtButton
          type='primary'
          onClick={handleProcess}
          disabled={files.length === 0}
        >
          开始处理
        </AtButton>
      </View>
    </View>
  )
}
```

#### 3.3 创建 `src/pages/index/index.scss`
```scss
.index {
  padding: 40px 30px;

  .header {
    text-align: center;
    margin-bottom: 60px;

    .title {
      font-size: 48px;
      font-weight: bold;
      color: #0066ff;
      margin-bottom: 10px;
    }

    .subtitle {
      font-size: 28px;
      color: #666;
    }
  }

  .upload-section {
    margin-bottom: 60px;

    .image-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 30px;

      .preview-image {
        width: 100%;
        height: 200px;
        border-radius: 12px;
        background-color: #f0f0f0;
      }
    }
  }

  .action-section {
    position: fixed;
    bottom: 60px;
    left: 30px;
    right: 30px;
  }
}
```

### Step 4: 实现图片处理逻辑

#### 4.1 创建 `src/lib/imageProcessor.ts`
```typescript
import Taro from '@tarojs/taro'
import {
  calculateCropArea,
  generateNewFilename,
  analyzeImageData,
  getCompressionStrategy
} from '@picbatch/shared'

export interface ProcessOptions {
  format: 'jpg' | 'png' | 'webp'
  quality: number
  crop?: {
    enabled: boolean
    ratio: string
  }
  rename?: {
    enabled: boolean
    prefix: string
  }
}

export async function processImage(
  filePath: string,
  options: ProcessOptions
): Promise<string> {
  // 1. 获取图片信息
  const info = await Taro.getImageInfo({ src: filePath })

  // 2. 创建 canvas
  const canvas = Taro.createCanvasContext('imageCanvas')

  // 3. 裁剪逻辑 (使用共享算法)
  let drawWidth = info.width
  let drawHeight = info.height
  let drawX = 0
  let drawY = 0

  if (options.crop?.enabled) {
    const cropArea = calculateCropArea(info.width, info.height, {
      enabled: true,
      ratio: options.crop.ratio as any,
      position: 'center'
    })
    drawX = cropArea.x
    drawY = cropArea.y
    drawWidth = cropArea.width
    drawHeight = cropArea.height
  }

  // 4. 绘制图片
  canvas.drawImage(
    filePath,
    drawX,
    drawY,
    drawWidth,
    drawHeight,
    0,
    0,
    drawWidth,
    drawHeight
  )

  // 5. 导出图片
  const result = await Taro.canvasToTempFilePath({
    canvas: canvas,
    fileType: options.format,
    quality: options.quality / 100
  })

  return result.tempFilePath
}
```

### Step 5: 安装依赖并启动

```bash
# 1. 进入小程序目录
cd packages/miniprogram

# 2. 安装依赖
npm install

# 3. 编译小程序 (微信)
npm run dev:weapp

# 4. 打开微信开发者工具
# 导入项目 -> 选择 packages/miniprogram/dist 目录
```

---

## 🚀 完整开发流程

### Phase 1: 基础搭建 (已完成 60%)
- [x] 技术方案设计
- [x] 目录结构创建
- [x] 共享代码提取
- [x] Taro 配置初始化
- [ ] 安装依赖
- [ ] 创建入口文件
- [ ] 创建主页面

### Phase 2: 核心功能 (待开发)
- [ ] 图片选择与预览
- [ ] 格式转换 (复用 shared 逻辑)
- [ ] 质量压缩
- [ ] 批量裁剪 (复用 calculateCropArea)
- [ ] 批量重命名 (复用 generateNewFilename)
- [ ] 进度显示

### Phase 3: 存储与分享 (待开发)
- [ ] 保存到相册 (Taro.saveImageToPhotosAlbum)
- [ ] 历史记录 (Taro.setStorage)
- [ ] 分享功能

### Phase 4: 优化与测试 (待开发)
- [ ] 性能优化
- [ ] 分包加载
- [ ] 微信开发者工具测试
- [ ] 真机测试

---

## 📦 代码复用策略

### 从 Web 复用到小程序

| Web 模块 | 共享包位置 | 小程序使用 |
|---------|----------|----------|
| `src/lib/crop.ts` | `@picbatch/shared/crop` | ✅ `calculateCropArea` |
| `src/lib/rename.ts` | `@picbatch/shared/rename` | ✅ `generateNewFilename` |
| `src/lib/compress-core.ts` | `@picbatch/shared/compress-core` | ✅ `analyzeImageData`, `getCompressionStrategy` |
| `src/types/index.ts` | `@picbatch/shared/types` | ✅ 所有类型 |

### 平台特定实现

| 功能 | Web (浏览器) | 小程序 (Taro) |
|-----|------------|--------------|
| 选择文件 | `<input type="file">` | `Taro.chooseImage()` |
| Canvas | `document.createElement('canvas')` | `Taro.createCanvasContext()` |
| 下载 | `JSZip` + `FileSaver` | `Taro.saveImageToPhotosAlbum()` |
| 存储 | `IndexedDB` | `Taro.setStorage()` |
| 图片信息 | `createImageBitmap()` | `Taro.getImageInfo()` |

---

## ⚠️ 注意事项

### 1. 依赖安装问题
如果 `npm install` 失败，可以尝试:
```bash
# 使用淘宝镜像
npm install --registry=https://registry.npmmirror.com

# 或使用 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

### 2. 微信小程序限制
- 最多选择 9 张图片 (一次)
- 主包 ≤ 2MB
- 总包 ≤ 20MB
- Canvas 尺寸有上限

### 3. 共享代码使用
在小程序中导入共享代码:
```typescript
// ✅ 正确
import { calculateCropArea } from '@picbatch/shared'

// ❌ 错误 (不要直接导入浏览器特定的函数)
import { cropImage } from '@picbatch/shared' // cropImage 包含 File API
```

---

## 📚 参考资源

- [Taro 官方文档](https://taro-docs.jd.com/)
- [Taro UI 组件库](https://taro-ui.jd.com/)
- [微信小程序 API](https://developers.weixin.qq.com/miniprogram/dev/api/)
- [Canvas API (微信)](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.html)

---

## 🎯 当前进度

**总体进度: 25%**

- ✅ 规划与设计 (100%)
- ✅ 共享代码提取 (100%)
- 🚧 小程序骨架搭建 (40%)
- ⏳ 核心功能开发 (0%)
- ⏳ UI 适配 (0%)
- ⏳ 测试与优化 (0%)

**下一步**: 完成 Taro 配置文件并创建应用入口
