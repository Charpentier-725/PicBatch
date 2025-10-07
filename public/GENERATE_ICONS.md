# PWA 图标生成指南

## 方式一：使用在线工具（推荐）

访问以下任一工具，上传 `icon.svg` 生成所需尺寸：

1. **PWA Asset Generator**: https://www.pwabuilder.com/imageGenerator
   - 上传 icon.svg
   - 下载生成的所有图标
   - 解压到 public/ 目录

2. **Favicon Generator**: https://realfavicongenerator.net/
   - 上传 icon.svg  
   - 自定义设置（可选）
   - 下载生成的图标包
   - 复制到 public/ 目录

3. **Icon Kitchen**: https://icon.kitchen/
   - 上传 icon.svg
   - 选择 PWA 模式
   - 下载并解压

## 方式二：使用 Node.js 工具

```bash
# 安装工具
npm install -g pwa-asset-generator

# 生成图标
pwa-asset-generator public/icon.svg public \
  --icon-only \
  --favicon \
  --maskable \
  --padding "20%" \
  --background "#8b5cf6"
```

## 所需图标文件

将以下文件放到 `public/` 目录：

- ✅ `favicon.ico` (32x32)
- ✅ `apple-touch-icon.png` (180x180)
- ✅ `pwa-64x64.png`
- ✅ `pwa-192x192.png`
- ✅ `pwa-512x512.png`
- ✅ `maskable-icon-512x512.png`

## 方式三：手动创建占位图标（开发测试用）

如果只是测试 PWA 功能，可以暂时使用简单的占位图标。
PWA 插件会在构建时自动生成基础图标。

## 验证

生成图标后，运行：

```bash
npm run build
npm run preview
```

在浏览器开发者工具中检查：
- Application > Manifest
- Application > Service Workers

确认图标正确加载。
