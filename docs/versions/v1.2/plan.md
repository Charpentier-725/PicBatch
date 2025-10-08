# PicBatch Version 1.2 开发计划

## 📋 版本目标

**核心目标**: 发布微信小程序版本，让用户在微信内直接使用图片批处理功能

**发布时间**: Q1 2026

---

## 🎯 主要功能

### 1. 微信小程序核心功能移植

将 Web 版本的核心功能适配到微信小程序：

#### 必备功能 (MVP)
- ✅ 格式转换 (JPG/PNG/WebP)
- ✅ 质量压缩
- ✅ 批量裁剪
- ✅ 批量重命名
- ✅ 历史记录

#### 微信特有优化
- 📱 适配微信内置浏览器
- 🔄 微信分享功能
- 💾 本地缓存优化
- 📊 数据统计上报

---

## 🛠️ 技术选型

### 框架对比

#### Option 1: Taro (推荐) ⭐
**优势**:
- React 语法，与现有 Web 版代码高度一致
- 官方维护，社区活跃
- 支持多端编译 (微信/支付宝/抖音小程序)
- TypeScript 支持完善
- 可复用大部分现有逻辑代码

**劣势**:
- 学习曲线稍陡
- 包体积略大

**技术栈**:
```
Taro 4.0
React 18
TypeScript 5.6
Zustand (状态管理)
```

#### Option 2: Uniapp
**优势**:
- Vue 语法，简单易学
- 丰富的 UI 组件库
- 跨平台支持好

**劣势**:
- 需要重写大部分代码 (Vue vs React)
- 与现有代码库差异大

**决策**: 选择 **Taro**，最大化代码复用

---

## 📁 项目结构

### 方案 A: Monorepo (推荐) ⭐

```
PicBatch/
├── packages/
│   ├── web/                 # 现有 Web 版本
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── miniprogram/         # 微信小程序版本
│   │   ├── src/
│   │   │   ├── app.tsx
│   │   │   ├── app.config.ts
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── lib/         # 共享逻辑
│   │   ├── package.json
│   │   └── project.config.json
│   │
│   └── shared/              # 共享代码
│       ├── lib/
│       │   ├── crop.ts      # 裁剪逻辑
│       │   ├── rename.ts    # 重命名逻辑
│       │   ├── compress.ts  # 压缩逻辑
│       │   └── types.ts     # 类型定义
│       └── package.json
│
├── package.json             # Root package
├── pnpm-workspace.yaml      # PNPM workspace config
└── turbo.json               # Turborepo config (可选)
```

**优势**:
- 代码复用率高 (共享核心逻辑)
- 统一管理依赖
- 便于同步更新

### 方案 B: 独立仓库

在当前项目基础上直接添加 Taro 配置

**劣势**:
- 代码组织混乱
- 难以维护

**决策**: 采用 **Monorepo** 结构

---

## 🔧 技术实现细节

### 1. 图片处理适配

**Web 版本** (Canvas API):
```typescript
// 使用 Canvas 和 Blob
const canvas = document.createElement('canvas');
const blob = await new Promise<Blob>(...);
```

**小程序版本** (Taro API):
```typescript
// 使用 Taro.createCanvasContext
import Taro from '@tarojs/taro';

const ctx = Taro.createCanvasContext('myCanvas');
const tempFilePath = await Taro.canvasToTempFilePath({...});
```

**共享核心算法**:
```typescript
// shared/lib/crop.ts
export function calculateCropArea(
  imgWidth: number,
  imgHeight: number,
  options: CropOptions
) {
  // 纯计算逻辑，无平台依赖
  // Web 和小程序都可以使用
}
```

### 2. 文件处理

**Web 版本**:
```typescript
// File API
const file = event.target.files[0];
```

**小程序版本**:
```typescript
// Taro.chooseImage
const res = await Taro.chooseImage({
  count: 9, // 最多选择 9 张
  sizeType: ['original', 'compressed'],
  sourceType: ['album', 'camera']
});
```

### 3. 存储

**Web 版本**:
```typescript
// IndexedDB
const db = await openDB('PicBatch', 1);
```

**小程序版本**:
```typescript
// Taro.setStorage
await Taro.setStorage({
  key: 'history',
  data: records
});
```

### 4. 下载

**Web 版本**:
```typescript
// ZIP 下载
const zip = new JSZip();
// ... 打包并下载
```

**小程序版本**:
```typescript
// 保存到相册
await Taro.saveImageToPhotosAlbum({
  filePath: tempFilePath
});

// 或分享
await Taro.shareFileMessage({
  filePath: tempFilePath
});
```

---

## 📦 依赖管理

### Shared Package
```json
{
  "name": "@picbatch/shared",
  "dependencies": {
    "date-fns": "^4.1.0"
  }
}
```

### MiniProgram Package
```json
{
  "name": "@picbatch/miniprogram",
  "dependencies": {
    "@tarojs/components": "^4.0.0",
    "@tarojs/runtime": "^4.0.0",
    "@tarojs/taro": "^4.0.0",
    "@tarojs/plugin-platform-weapp": "^4.0.0",
    "@tarojs/webpack5-runner": "^4.0.0",
    "@picbatch/shared": "workspace:*",
    "zustand": "^5.0.2"
  }
}
```

---

## 🎨 UI 适配

### 微信小程序设计规范

**尺寸单位**: rpx (responsive pixel)
- 750rpx = 屏幕宽度
- 1rpx = 0.5px (iPhone 6)

**安全区域**:
```scss
// 顶部状态栏
padding-top: calc(var(--status-bar-height) + 20rpx);

// 底部安全区域 (iPhone X+)
padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
```

### 颜色主题

**适配微信深色模式**:
```typescript
// app.config.ts
export default {
  darkmode: true,
  themeLocation: 'theme.json'
}

// theme.json
{
  "light": {
    "@bgColor": "#ffffff",
    "@textColor": "#000000"
  },
  "dark": {
    "@bgColor": "#1a1a1a",
    "@textColor": "#ffffff"
  }
}
```

### 组件库

**选择**: Taro UI (官方组件库)

```bash
pnpm add taro-ui
```

**核心组件**:
- AtButton
- AtImagePicker
- AtSlider
- AtSwitch
- AtTabs
- AtActionSheet

---

## 🚀 开发流程

### Phase 1: 项目搭建 (1-2天)

1. **初始化 Monorepo**
   ```bash
   # 安装 PNPM (如果没有)
   npm install -g pnpm

   # 初始化 workspace
   pnpm init

   # 创建 workspace 配置
   echo "packages:\n  - 'packages/*'" > pnpm-workspace.yaml
   ```

2. **创建 Shared Package**
   ```bash
   mkdir -p packages/shared/lib
   # 移动共享代码
   cp src/lib/crop.ts packages/shared/lib/
   cp src/lib/rename.ts packages/shared/lib/
   cp src/lib/smartCompress.ts packages/shared/lib/
   cp src/types/index.ts packages/shared/lib/types.ts
   ```

3. **初始化 Taro 项目**
   ```bash
   cd packages
   pnpm create @tarojs/cli@latest miniprogram
   # 选择: React + TypeScript + Webpack5
   ```

4. **重组现有 Web 项目**
   ```bash
   mkdir -p packages/web
   mv src vite.config.ts package.json packages/web/
   ```

### Phase 2: 核心功能开发 (3-5天)

1. **图片选择与预览**
   - 使用 `Taro.chooseImage` 选择图片
   - AtImagePicker 组件展示预览

2. **图片处理**
   - 复用 `@picbatch/shared` 的计算逻辑
   - 适配小程序 Canvas API
   - 实现批量处理队列

3. **裁剪功能**
   - 复用裁剪算法
   - 小程序 Canvas 渲染

4. **重命名功能**
   - 直接复用 `generateNewFilename`

5. **压缩功能**
   - 适配小程序压缩 API
   - 质量控制

### Phase 3: 存储与分享 (2-3天)

1. **历史记录**
   - 使用 `Taro.setStorage` 替代 IndexedDB
   - 数据结构保持一致

2. **保存图片**
   - 单张保存: `Taro.saveImageToPhotosAlbum`
   - 批量保存: 循环保存 + 权限处理

3. **分享功能**
   - 转发给好友
   - 分享到朋友圈 (需要配置)

### Phase 4: 优化与测试 (2-3天)

1. **性能优化**
   - 图片懒加载
   - 分包加载
   - 代码分割

2. **微信开发者工具测试**
   - 真机预览
   - 性能分析
   - 体验评分

3. **兼容性测试**
   - iOS 微信
   - Android 微信
   - 不同屏幕尺寸

---

## 📊 微信小程序限制与对策

### 1. 包体积限制

**限制**:
- 主包 ≤ 2MB
- 总包 ≤ 20MB

**对策**:
```javascript
// app.config.ts
export default {
  subPackages: [
    {
      root: 'pages/advanced',
      pages: ['crop', 'rename']
    }
  ]
}
```

### 2. 文件数量限制

**限制**: 最多选择 9 张图片 (一次)

**对策**:
- 分批处理
- 提示用户分批上传

### 3. Canvas 限制

**限制**:
- Canvas 尺寸上限
- 内存限制

**对策**:
- 大图缩放处理
- 分块处理
- 及时释放内存

### 4. 网络请求限制

**限制**:
- 域名白名单
- HTTPS 要求

**对策**:
- 所有处理本地完成 (无需网络)
- API 域名提前配置

---

## 🔐 权限申请

**必需权限**:
```json
// app.json
{
  "permission": {
    "scope.writePhotosAlbum": {
      "desc": "保存处理后的图片到相册"
    }
  }
}
```

**运行时申请**:
```typescript
const authSetting = await Taro.getSetting();
if (!authSetting.authSetting['scope.writePhotosAlbum']) {
  await Taro.authorize({ scope: 'scope.writePhotosAlbum' });
}
```

---

## 📈 数据统计

**微信小程序数据分析**:
- UV/PV
- 用户留存
- 功能使用频率
- 错误日志上报

**自定义埋点**:
```typescript
// 处理完成埋点
Taro.reportAnalytics('image_processed', {
  count: fileCount,
  format: outputFormat,
  feature: 'crop' // crop, rename, compress
});
```

---

## 🚀 发布流程

### 1. 注册小程序

1. 前往 [微信公众平台](https://mp.weixin.qq.com/)
2. 注册小程序账号
3. 完善基本信息
4. 获取 AppID

### 2. 配置项目

```javascript
// project.config.json
{
  "appid": "your-appid",
  "projectname": "PicBatch",
  "miniprogramRoot": "dist/",
  "setting": {
    "es6": true,
    "minified": true
  }
}
```

### 3. 提交审核

1. 上传代码到微信服务器
2. 设置体验版
3. 提交审核
4. 等待审核通过 (1-7天)
5. 发布上线

---

## 🎯 成功指标

**技术指标**:
- [ ] 主包体积 < 1.5MB
- [ ] 总包体积 < 10MB
- [ ] 启动时间 < 3秒
- [ ] 单图处理 < 2秒
- [ ] 体验评分 > 90分

**功能指标**:
- [ ] 支持 9 张图片批量处理
- [ ] 支持所有 Web 版功能
- [ ] 保存成功率 > 95%
- [ ] 崩溃率 < 0.1%

**用户指标**:
- [ ] 首月 UV > 1000
- [ ] 次日留存 > 30%
- [ ] 7日留存 > 15%

---

## 📝 后续优化方向

### Version 1.3 (可选)
1. **支付宝小程序**
2. **抖音小程序**
3. **快应用**

### 高级功能
1. **云端同步**
   - 微信云开发
   - 历史记录云端同步
   - 多端数据互通

2. **AI 功能**
   - 智能抠图
   - 智能裁剪
   - 图片修复

3. **模板功能**
   - 预设处理模板
   - 分享模板给好友

---

## 🔗 参考资源

- [Taro 官方文档](https://taro-docs.jd.com/)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [Taro UI 组件库](https://taro-ui.jd.com/)
- [微信小程序设计规范](https://developers.weixin.qq.com/miniprogram/design/)

---

**预计开发周期**: 2-3 周
**预计上线时间**: Q1 2026
