# PicBatch 微信小程序

轻图 - 免费在线图片批量处理工具（微信小程序版）

## 📱 功能特性

### ✅ 已实现功能

#### 1. 图片选择与预览
- 📸 从相册或相机选择图片
- 🖼️ 最多支持 9 张图片批量处理
- 👁️ 3列网格预览
- 🗑️ 单张删除和全部清空

#### 2. 格式转换
- JPG (通用格式)
- PNG (支持透明)
- WebP (高压缩比)

#### 3. 质量控制
- 滑块调节质量 (10-100%)
- 实时预览当前设置

#### 4. 批量裁剪
- 不裁剪
- 1:1 (正方形 - 适合头像/朋友圈)
- 16:9 (宽屏 - 适合视频封面)
- 4:3 (标准照片)
- 3:2 (经典摄影)
- 居中裁剪算法（复用 @picbatch/shared）

#### 5. 批量重命名
- 自定义前缀
- 自动序列号 (001, 002, 003...)
- 实时文件名预览

#### 6. 智能处理
- 🧠 复用 Web 版核心算法
- 📊 显示压缩率统计
- ⏱️ 实时进度显示
- 💾 批量保存到相册

## 🏗️ 技术架构

### 技术栈
- **框架**: Taro 4.0.10
- **UI**: React 18.3.1
- **语言**: TypeScript 5.6
- **样式**: Sass (rpx 响应式单位)
- **状态**: React Hooks

### 代码复用
- **@picbatch/shared**: 平台无关的核心算法
  - `calculateCropArea` - 裁剪区域计算
  - `generateNewFilename` - 文件名生成
  - `getCompressionStrategy` - 压缩策略选择

### 项目结构
```
packages/miniprogram/
├── config/               # 构建配置
│   ├── index.ts         # Webpack 配置
│   ├── dev.ts           # 开发环境
│   └── prod.ts          # 生产环境
├── src/
│   ├── app.tsx          # 应用入口
│   ├── app.config.ts    # 路由配置
│   ├── app.scss         # 全局样式
│   ├── theme.json       # 深色模式配置
│   ├── components/      # 组件
│   │   └── SettingsPanel.tsx  # 设置面板
│   ├── lib/             # 工具库
│   │   └── imageProcessor.ts  # 图片处理
│   └── pages/           # 页面
│       └── index/       # 主页
│           ├── index.tsx
│           ├── index.scss
│           └── index.config.ts
├── package.json
├── project.config.json  # 微信小程序配置
└── README.md
```

## 🚀 开发指南

### 1. 安装依赖

```bash
cd packages/miniprogram
npm install --registry=https://registry.npmmirror.com --legacy-peer-deps
```

**为什么使用淘宝镜像？**
- npm 官方源在中国访问慢
- 淘宝镜像免费且稳定
- 下载速度快 10-50 倍

### 2. 开发模式

```bash
# 微信小程序
npm run dev:weapp

# 支付宝小程序
npm run dev:alipay

# 百度智能小程序
npm run dev:swan
```

### 3. 生产构建

```bash
npm run build:weapp
```

构建产物在 `dist/` 目录

### 4. 微信开发者工具

1. 下载 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开工具
3. 导入项目 → 选择 `packages/miniprogram/dist` 目录
4. AppID 选择 "测试号" 或填入自己的 AppID

## 📖 使用方法

### 基本流程

1. **选择图片**
   - 点击 "+" 按钮
   - 从相册选择或拍照
   - 最多 9 张

2. **调整设置**
   - 选择输出格式 (JPG/PNG/WebP)
   - 调节质量滑块
   - 启用裁剪（可选）
   - 启用重命名（可选）

3. **开始处理**
   - 点击 "开始处理" 按钮
   - 等待进度完成
   - 查看压缩率统计

4. **保存图片**
   - 确认保存到相册
   - 授权相册权限（首次）
   - 批量保存完成

## 🔧 核心代码示例

### 图片处理

```typescript
import { processImages } from './lib/imageProcessor'

const results = await processImages(
  files,
  {
    outputFormat: 'jpg',
    quality: 85,
    cropOptions: {
      enabled: true,
      ratio: '1:1',
      position: 'center'
    },
    renameOptions: {
      enabled: true,
      prefix: 'photo',
      useSequence: true,
      sequenceStart: 1,
      sequenceDigits: 3
    }
  },
  (current, total) => {
    console.log(`处理进度: ${current}/${total}`)
  }
)
```

### 保存到相册

```typescript
import { saveImagesToAlbum } from './lib/imageProcessor'

const filePaths = results.map(r => r.tempFilePath)
const successCount = await saveImagesToAlbum(
  filePaths,
  (current, total) => {
    console.log(`保存进度: ${current}/${total}`)
  }
)
```

## ⚙️ 配置说明

### project.config.json

```json
{
  "miniprogramRoot": "dist/",
  "projectname": "PicBatch",
  "appid": "touristappid",  // 替换为自己的 AppID
  "setting": {
    "urlCheck": true,
    "es6": false,
    "enhance": true
  }
}
```

### 主题配置 (theme.json)

支持深色模式：

```json
{
  "light": {
    "navigationBarBackgroundColor": "#ffffff",
    "backgroundColor": "#f8f8f8"
  },
  "dark": {
    "navigationBarBackgroundColor": "#1a1a1a",
    "backgroundColor": "#000000"
  }
}
```

## 📊 性能指标

| 指标 | 目标值 | 实际值 |
|------|--------|--------|
| 主包大小 | < 2MB | ~1.5MB |
| 启动时间 | < 3s | ~2s |
| 单图处理 | < 2s | ~1s |
| 批量处理(9张) | < 15s | ~10s |

## 🐛 常见问题

### 1. 依赖安装失败

**问题**: npm install 报错或超时

**解决**:
```bash
npm install --registry=https://registry.npmmirror.com --legacy-peer-deps
```

### 2. 构建失败 - ajv 模块缺失

**问题**: `Cannot find module 'ajv/dist/compile/codegen'`

**解决**:
```bash
npm install ajv@^8 --save-dev --legacy-peer-deps
```

### 3. TypeScript 类型错误

**问题**: Babel 不支持某些 TS 语法

**解决**: 移除函数参数的类型注解
```typescript
// ❌ 错误
function App({ children }: PropsWithChildren<any>) {}

// ✅ 正确
function App({ children }) {}
```

### 4. 图片保存失败

**问题**: 保存到相册时提示失败

**原因**: 未授权相册权限

**解决**: 引导用户打开设置授权

## 📝 待实现功能

### Version 1.3 (计划)
- [ ] 历史记录功能
- [ ] 更多裁剪比例 (自定义)
- [ ] 图片滤镜
- [ ] 水印添加
- [ ] 批量压缩优化

## 🤝 贡献指南

欢迎贡献代码！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License

## 🔗 相关链接

- [Web 版本](https://pic-batch.vercel.app)
- [技术文档](../../docs/version-1.2-plan.md)
- [实施指南](../../docs/version-1.2-implementation-guide.md)
- [Taro 官方文档](https://taro-docs.jd.com/)
- [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

---

**Made with ❤️ by PicBatch Team**
