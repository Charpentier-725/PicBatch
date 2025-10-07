# 轻图 PicBatch

> 免费、快速、隐私安全的在线图片批量处理工具

[![部署状态](https://img.shields.io/badge/部署-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![技术栈](https://img.shields.io/badge/技术栈-React_19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

## ✨ 核心特性

- 🔒 **隐私优先** - 所有处理在浏览器本地完成，图片不会上传到服务器
- 🚀 **快速高效** - 基于 Canvas API 和 WASM，单张图片处理 <1 秒
- 📦 **批量处理** - 支持同时处理 50+ 张图片
- 🎨 **格式转换** - 支持 JPG、PNG、WebP、HEIC、SVG、GIF
- 🔧 **灵活压缩** - 按质量或目标文件大小压缩
- 📱 **移动优化** - 完美适配手机、平板、电脑
- 💯 **完全免费** - 无广告、无限制、开源

## 🎯 功能列表

### 已实现功能

- ✅ **文件上传**
  - 拖拽上传
  - 点击选择
  - 批量上传（最多 50 张）

- ✅ **格式转换**
  - JPG / PNG / WebP / GIF（输出）
  - HEIC / SVG / GIF（输入）
  - 扩展名大小写选择（.jpg vs .JPG）
  - SVG 自动栅格化
  - GIF 静态帧提取

- ✅ **图片压缩**
  - 质量优先（1-100% 可调）
  - 大小优先（指定目标 KB）

- ✅ **批量下载**
  - ZIP 打包下载
  - 保留原文件名
  - 实时进度显示

### 计划功能（Version 1.1）

- [ ] 批量裁剪（1:1、16:9、4:3、自定义比例）
- [ ] 批量重命名（前缀 + 序号）
- [ ] 智能压缩优化

## 🚀 快速开始

### 在线使用

访问 [https://your-domain.vercel.app](https://your-domain.vercel.app)

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/your-username/picbatch.git
cd picbatch

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19.0 | UI 框架 |
| TypeScript | 5.6 | 类型系统 |
| Vite | 7.1 | 构建工具 |
| Tailwind CSS | 3.4 | 样式框架 |
| shadcn/ui | 3.2+ | UI 组件库 |
| Zustand | 4.5 | 状态管理 |
| Canvas API | - | 图片处理 |
| browser-image-compression | 2.0 | 图片压缩 |
| heic2any | 0.0.4 | HEIC 转换 |
| JSZip | 3.10 | ZIP 打包 |

## 📦 项目结构

```
PicBatch/
├── src/
│   ├── components/      # UI 组件
│   │   ├── ui/         # shadcn/ui 基础组件
│   │   ├── FileUploader.tsx
│   │   ├── FileList.tsx
│   │   ├── ToolPanel.tsx
│   │   └── ...
│   ├── lib/            # 工具函数
│   │   ├── imageUtils.ts    # 图片处理
│   │   ├── fileUtils.ts     # 文件验证
│   │   └── compression.ts   # 压缩算法
│   ├── hooks/          # 自定义 Hooks
│   ├── store/          # Zustand 状态
│   ├── types/          # TypeScript 类型
│   └── App.tsx
├── docs/               # 文档
├── public/             # 静态资源
└── package.json
```

## 🌟 核心实现

### 隐私保护设计

所有图片处理完全在浏览器本地完成：

```typescript
// 使用 Canvas API 进行格式转换
export async function convertFormat(
  file: File,
  outputFormat: OutputFormat,
  quality: number
): Promise<Blob> {
  const imageBitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  // ... 本地处理
  return blob; // 不会发送到服务器
}
```

### SVG 栅格化

```typescript
export async function convertSVG(file: File): Promise<File> {
  const img = new Image();
  const url = URL.createObjectURL(file);
  // 在浏览器中渲染 SVG → Canvas → PNG
  return pngFile;
}
```

## 📊 性能指标

| 指标 | 目标 | 实际 |
|------|------|------|
| 首屏加载 | <3MB | ~1.9MB (gzip: 535KB) ✅ |
| 单张处理 | ≤2秒 | <1秒 ✅ |
| 批量 50 张 | ≤2分钟 | 待验证 |
| 移动端兼容 | 流畅 | ✅ |

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 开发日志

详见 [CHANGELOG.md](CHANGELOG.md)

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

## 🙏 致谢

- [shadcn/ui](https://ui.shadcn.com/) - 精美的 UI 组件库
- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) - 高效的图片压缩库
- [heic2any](https://github.com/alexcorvi/heic2any) - HEIC 格式转换

## 📮 联系方式

- 问题反馈：[GitHub Issues](https://github.com/your-username/picbatch/issues)
- 功能建议：[GitHub Discussions](https://github.com/your-username/picbatch/discussions)

---

<p align="center">用 ❤️ 构建 | Powered by React & Vite</p>
