# 轻图（PicBatch） - 技术实现方案

> 版本：2.0（基于 2025 年最新技术栈）
> 更新日期：2025-10-06
> 状态：MVP 开发阶段

---

## 一、技术架构设计

### 1.1 核心技术栈（2025 最新版本）

```yaml
前端框架: Vite 7 + React 19 + TypeScript 5.3+
UI 组件库: shadcn/ui v3.2+ (基于 Radix UI + Tailwind CSS)
图片处理: Canvas API + browser-image-compression v2.0+
文件处理: jszip v3.10+ + file-saver v2.0+
上传交互: react-dropzone v14.2+
状态管理: zustand v4.5+ (轻量级状态管理)
部署平台: Vercel (免费 CDN + 自动部署)
```

### 1.2 技术选型理由

| 技术 | 选择理由 | 2025 年新特性 | 替代方案 |
|------|----------|--------------|----------|
| **Vite 7** | 更快的冷启动，优化的依赖预打包，性能分析工具 | `optimizeDeps.holdUntilCrawlEnd` 选项，改进的 HMR | Webpack, Rspack |
| **React 19** | Actions、use API、原生 metadata 支持，Context 简化 | 自动批量更新、Suspense 改进、资源预加载 API | Vue 3, Svelte 5 |
| **TypeScript 5.3+** | 类型安全，减少运行时错误，IDE 支持好 | 更好的类型推断和性能 | JavaScript |
| **shadcn/ui v3.2+** | 按需引入，完全可定制，TypeScript 优先，零运行时 | 更多组件、改进的可访问性 | Ant Design, MUI, Radix UI |
| **Canvas API** | 浏览器原生支持，无需 WASM 编译，兼容性好 | 持续优化的浏览器性能 | @squoosh/lib, sharp-wasm |
| **browser-image-compression** | 纯 JS 实现，自动 Web Worker，压缩效果好 | 持续维护，兼容性强 | compressorjs, pica |
| **zustand v4.5+** | API 简洁，无样板代码，包体积小 (3KB)，React 19 兼容 | 改进的 TypeScript 支持 | Jotai, Valtio, Redux Toolkit |
| **Vercel** | 零配置部署，免费 CDN，自动 HTTPS，边缘函数支持 | 改进的构建缓存和性能 | Netlify, Cloudflare Pages |

### 1.2.1 React 19 核心新特性应用

**本项目将使用的 React 19 新特性：**

1. **Actions + useTransition** - 简化异步操作和加载状态
   ```typescript
   const [isPending, startTransition] = useTransition();
   const handleProcess = () => {
     startTransition(async () => {
       await processImages();
     });
   };
   ```

2. **use API** - 简化 Promise 处理
   ```typescript
   function ImageProcessor({ imagePromise }) {
     const image = use(imagePromise); // 自动 Suspense
     return <ProcessedImage data={image} />;
   }
   ```

3. **简化的 Context API** - 无需 `.Provider`
   ```typescript
   const ThemeContext = createContext('light');
   // 直接使用 <ThemeContext value="dark">
   ```

4. **原生 Metadata 支持** - 自动提升到 <head>
   ```typescript
   function ImageConverter() {
     return (
       <>
         <title>图片格式转换 - 轻图</title>
         <meta name="description" content="免费在线图片格式转换" />
         {/* 组件内容 */}
       </>
     );
   }
   ```

5. **资源预加载 API** - 优化性能
   ```typescript
   import { preload, preinit } from 'react-dom';
   preload('/worker.js', { as: 'script' });
   preinit('/critical.css', { as: 'style' });
   ```

### 1.2.2 Vite 7 性能优化特性

**项目将启用的 Vite 7 优化：**

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    holdUntilCrawlEnd: false, // 改进冷启动性能
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-image': ['browser-image-compression', 'heic2any'],
          'vendor-zip': ['jszip', 'file-saver'],
        }
      }
    },
    cssCodeSplit: true, // 自动 CSS 代码分割
  },
  server: {
    warmup: {
      clientFiles: ['./src/App.tsx', './src/main.tsx'], // 预热关键文件
    }
  }
});
```

### 1.3 架构分层

```
┌─────────────────────────────────────┐
│         UI Layer (React)            │
│  FileUploader │ ToolPanel │ Results │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│      State Layer (Zustand)          │
│  files │ settings │ progress        │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     Business Logic Layer            │
│  imageUtils │ compression │ zip     │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│   Browser API Layer (Web Worker)    │
│  Canvas │ Blob │ FileReader          │
└─────────────────────────────────────┘
```

---

## 二、图片处理技术方案

### 2.1 功能实现映射表

| 功能 | 实现方式 | 核心 API | 预计性能 |
|------|----------|----------|----------|
| **格式转换** | Canvas.toBlob() | `canvas.toBlob(blob, 'image/webp', quality)` | <1s/张 |
| **画质压缩** | browser-image-compression | `imageCompression(file, options)` | <2s/张 |
| **尺寸裁剪** | Canvas drawImage() | `ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)` | <0.5s/张 |
| **HEIC 转换** | heic2any | `heic2any({blob: file, toType: 'image/jpeg'})` | <3s/张 |
| **批量下载** | JSZip | `zip.file(filename, blob); zip.generateAsync()` | <5s/50张 |

### 2.2 格式转换实现细节

#### 支持的格式矩阵

| 源格式 | → JPG | → PNG | → WebP | 实现难度 |
|--------|-------|-------|--------|----------|
| **JPG** | ✅ (重压缩) | ✅ | ✅ | 低 |
| **PNG** | ✅ | ✅ (重压缩) | ✅ | 低 |
| **WebP** | ✅ | ✅ | ✅ (重压缩) | 低 |
| **HEIC** | ✅ (需 polyfill) | ✅ (需 polyfill) | ✅ (需 polyfill) | 中 |

#### 核心转换流程

```typescript
File → createImageBitmap() → Canvas → toBlob(format) → Blob
```

**关键代码逻辑：**

```typescript
async function convertImage(
  file: File,
  outputFormat: 'image/jpeg' | 'image/png' | 'image/webp',
  quality: number = 90
): Promise<Blob> {
  // 1. 解码图片为 ImageBitmap
  const img = await createImageBitmap(file);

  // 2. 创建 Canvas 并绘制
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  // 3. 转换为目标格式
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob!),
      outputFormat,
      quality / 100
    );
  });
}
```

### 2.3 压缩策略

#### 两种压缩模式

**模式 1：按质量压缩（Quality-based）**
- 用户指定质量系数（0-100）
- 适用场景：对画质有要求，文件大小次要

**模式 2：按目标大小压缩（Size-based）**
- 用户指定目标文件大小（如 500KB）
- 自动迭代计算最优质量参数
- 适用场景：严格的文件大小限制（如 App 上传）

#### 压缩实现

```typescript
import imageCompression from 'browser-image-compression';

async function compressImage(
  file: File,
  options: {
    targetSizeKB?: number;  // 目标大小（KB）
    quality?: number;       // 质量（0-100）
  }
): Promise<Blob> {
  const compressionOptions = {
    maxSizeMB: options.targetSizeKB ? options.targetSizeKB / 1024 : undefined,
    maxWidthOrHeight: 4096,  // 最大尺寸限制
    useWebWorker: true,      // 自动使用 Web Worker
    initialQuality: options.quality ? options.quality / 100 : 0.8,
    alwaysKeepResolution: false,  // 允许降低分辨率以满足大小要求
  };

  return await imageCompression(file, compressionOptions);
}
```

### 2.4 批量处理队列设计

**并发控制策略：**
- 同时处理数量：3-5 个（避免内存溢出）
- 处理顺序：FIFO（先进先出）
- 失败重试：最多 2 次

```typescript
async function processBatch(files: File[], concurrency = 3) {
  const queue = [...files];
  const results = [];
  const processing = new Set();

  while (queue.length > 0 || processing.size > 0) {
    // 补充队列到并发数
    while (processing.size < concurrency && queue.length > 0) {
      const file = queue.shift()!;
      const promise = processImage(file)
        .then(result => {
          results.push(result);
          processing.delete(promise);
        })
        .catch(error => {
          results.push({ file, error });
          processing.delete(promise);
        });
      processing.add(promise);
    }

    // 等待任意一个完成
    if (processing.size > 0) {
      await Promise.race(processing);
    }
  }

  return results;
}
```

---

## 三、MVP 1.0 功能分解

### Phase 1: 基础框架搭建（1天，8小时）

**任务清单：**
- [ ] 初始化 Vite + React + TypeScript 项目
- [ ] 配置 Tailwind CSS
- [ ] 安装 shadcn/ui CLI 并初始化
- [ ] 创建基础布局组件（Header、Main、Footer）
- [ ] 配置响应式断点（Mobile: <768px, Desktop: ≥768px）
- [ ] 设置 ESLint + Prettier

**验收标准：**
- ✅ `npm run dev` 可启动开发服务器
- ✅ 页面在手机和桌面端正常显示

### Phase 2: 文件上传模块（1天，8小时）

**任务清单：**
- [ ] 集成 react-dropzone
- [ ] 实现拖拽上传区域 UI
- [ ] 实现多文件选择按钮
- [ ] 文件类型验证（仅接受 image/*）
- [ ] 文件大小验证（单个文件 <50MB）
- [ ] 文件列表展示（缩略图 + 文件名 + 大小）
- [ ] 单个文件删除功能
- [ ] 清空所有文件功能

**数据结构：**
```typescript
interface UploadedFile {
  id: string;            // UUID
  file: File;            // 原始文件对象
  name: string;          // 文件名
  size: number;          // 字节数
  type: string;          // MIME 类型
  preview: string;       // 缩略图 URL (ObjectURL)
  status: 'pending';     // 初始状态
}
```

**验收标准：**
- ✅ 可拖拽上传图片
- ✅ 可点击按钮选择图片
- ✅ 显示图片缩略图和信息
- ✅ 可删除单个或全部图片

### Phase 3: 格式转换（2天，16小时）

**任务清单：**
- [ ] 实现 Canvas 图片加载封装函数
- [ ] 实现 JPG/PNG/WebP 互转逻辑
- [ ] 集成 heic2any 库处理 HEIC 格式
- [ ] 创建格式选择器 UI 组件（Radio Group）
- [ ] 创建质量滑块组件（0-100）
- [ ] 实现单个图片处理函数
- [ ] 实现批量处理队列管理
- [ ] 处理异常情况（解码失败、格式不支持等）

**核心函数签名：**
```typescript
// 格式转换
async function convertFormat(
  file: File,
  targetFormat: 'jpeg' | 'png' | 'webp',
  quality: number
): Promise<Blob>;

// HEIC 转换
async function convertHEIC(file: File): Promise<Blob>;

// 批量处理
async function processAllFiles(
  files: UploadedFile[],
  options: ConversionOptions
): Promise<ProcessedFile[]>;
```

**验收标准：**
- ✅ JPG/PNG/WebP 三种格式可互相转换
- ✅ HEIC 可转为 JPG
- ✅ 质量滑块可调节输出质量
- ✅ 批量处理不阻塞 UI

### Phase 4: 画质压缩（1天，8小时）

**任务清单：**
- [ ] 集成 browser-image-compression 库
- [ ] 实现按质量压缩功能
- [ ] 实现按目标大小压缩功能
- [ ] 创建压缩参数设置 UI
  - 质量滑块（0-100）
  - 目标大小输入框（KB）
  - 模式切换（质量优先 / 大小优先）
- [ ] 实现压缩前后对比显示
- [ ] 添加压缩比例显示（如：压缩 65%）

**UI 设计：**
```
┌─────────────────────────────┐
│ 压缩模式：○ 质量优先 ● 大小优先 │
├─────────────────────────────┤
│ 目标大小：[500] KB           │
│ 或质量： ━━●━━━━━ 80%        │
└─────────────────────────────┘
```

**验收标准：**
- ✅ 可按质量百分比压缩
- ✅ 可按目标文件大小压缩
- ✅ 显示压缩前后对比数据

### Phase 5: 批量下载（1天，8小时）

**任务清单：**
- [ ] 集成 jszip 和 file-saver
- [ ] 实现批量打包 ZIP 功能
- [ ] 实现文件命名规则
  - 保留原文件名
  - 处理重名冲突（添加序号）
- [ ] 创建下载按钮 UI
- [ ] 添加打包进度显示
- [ ] 处理打包失败情况

**打包逻辑：**
```typescript
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

async function downloadAsZip(files: ProcessedFile[]) {
  const zip = new JSZip();

  // 添加文件到 ZIP
  files.forEach((file, index) => {
    const filename = file.newName || `image_${index + 1}.${file.extension}`;
    zip.file(filename, file.blob);
  });

  // 生成 ZIP 文件
  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  }, (metadata) => {
    // 更新打包进度
    updateProgress(metadata.percent);
  });

  // 触发下载
  saveAs(content, `PicBatch_${Date.now()}.zip`);
}
```

**验收标准：**
- ✅ 可一键下载所有处理后的图片
- ✅ ZIP 文件命名合理
- ✅ 显示打包进度

### Phase 6: 进度与状态（1天，8小时）

**任务清单：**
- [ ] 设计文件状态枚举
- [ ] 实现单个文件进度条
- [ ] 实现总体进度条
- [ ] 创建状态图标（等待、处理中、成功、失败）
- [ ] 实现 Toast 通知组件
- [ ] 错误信息展示（悬浮提示）
- [ ] 处理中禁用操作按钮

**状态定义：**
```typescript
enum FileStatus {
  PENDING = 'pending',       // 等待处理
  PROCESSING = 'processing', // 处理中
  SUCCESS = 'success',       // 成功
  ERROR = 'error'            // 失败
}

interface ProcessedFile extends UploadedFile {
  status: FileStatus;
  progress: number;          // 0-100
  processedBlob?: Blob;
  error?: string;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number; // 压缩比例
}
```

**验收标准：**
- ✅ 每个文件显示独立进度
- ✅ 总进度条显示整体进度
- ✅ 成功/失败状态清晰可见
- ✅ 错误信息可读性好

### Phase 7: 优化与测试（1天，8小时）

**任务清单：**
- [ ] 实现 Web Worker 处理图片
- [ ] 代码分割优化（动态 import）
- [ ] 图片懒加载优化
- [ ] 性能测试（50张图片批处理）
- [ ] 移动端适配测试（iOS/Android）
- [ ] 微信浏览器兼容测试
- [ ] 首次加载体积检查（<3MB）
- [ ] 编写用户使用文档

**Web Worker 实现：**
```typescript
// imageProcessor.worker.ts
self.addEventListener('message', async (e) => {
  const { file, options } = e.data;

  try {
    const result = await processImage(file, options);
    self.postMessage({ success: true, result });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
});

// 主线程调用
const worker = new Worker(new URL('./imageProcessor.worker.ts', import.meta.url));
worker.postMessage({ file, options });
worker.addEventListener('message', (e) => {
  if (e.data.success) {
    handleSuccess(e.data.result);
  } else {
    handleError(e.data.error);
  }
});
```

**验收标准：**
- ✅ 50张中等分辨率图片可在 2 分钟内处理完成
- ✅ 处理过程中 UI 不卡顿
- ✅ 移动端操作流畅
- ✅ 微信浏览器可正常使用
- ✅ 打包后体积 <3MB

---

## 四、项目文件结构

```
PicBatch/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/                      # shadcn/ui 组件库
│   │   │   ├── button.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   └── toast.tsx
│   │   ├── FileUploader.tsx         # 文件上传区域
│   │   ├── FileList.tsx             # 文件列表展示
│   │   ├── FileItem.tsx             # 单个文件项
│   │   ├── ToolPanel.tsx            # 操作面板
│   │   │   ├── FormatSelector.tsx   # 格式选择器
│   │   │   ├── QualitySlider.tsx    # 质量滑块
│   │   │   └── CompressionSettings.tsx
│   │   ├── ProgressBar.tsx          # 进度条
│   │   ├── DownloadButton.tsx       # 下载按钮
│   │   └── Header.tsx               # 页面头部
│   ├── workers/
│   │   └── imageProcessor.worker.ts # 图片处理 Worker
│   ├── lib/
│   │   ├── imageUtils.ts            # 图片处理工具函数
│   │   │   ├── convertFormat()
│   │   │   ├── convertHEIC()
│   │   │   ├── resizeImage()
│   │   │   └── cropImage()
│   │   ├── compression.ts           # 压缩封装
│   │   │   ├── compressByQuality()
│   │   │   └── compressBySize()
│   │   ├── zipUtils.ts              # ZIP 打包工具
│   │   │   └── createZip()
│   │   └── fileUtils.ts             # 文件处理工具
│   │       ├── validateFile()
│   │       ├── formatFileSize()
│   │       └── generateFilename()
│   ├── store/
│   │   └── useStore.ts              # Zustand 状态管理
│   ├── types/
│   │   └── index.ts                 # TypeScript 类型定义
│   ├── hooks/
│   │   ├── useImageProcessor.ts     # 图片处理 Hook
│   │   └── useFileUpload.ts         # 文件上传 Hook
│   ├── App.tsx                      # 根组件
│   ├── main.tsx                     # 入口文件
│   └── index.css                    # 全局样式
├── docs/
│   ├── mvp-prd.md                   # 产品需求文档
│   ├── technical-design.md          # 技术方案文档（本文档）
│   └── user-guide.md                # 用户使用指南
├── .github/
│   └── workflows/
│       └── deploy.yml               # Vercel 自动部署
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── .eslintrc.js
└── README.md
```

---

## 五、核心数据流设计

### 5.1 状态管理（Zustand）

```typescript
// store/useStore.ts
import { create } from 'zustand';

interface AppState {
  // 文件相关
  files: ProcessedFile[];
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateFileStatus: (id: string, status: FileStatus, progress?: number) => void;
  updateFileResult: (id: string, blob: Blob, size: number) => void;

  // 设置相关
  outputFormat: 'jpeg' | 'png' | 'webp';
  quality: number;                    // 0-100
  compressionMode: 'quality' | 'size';
  targetSize?: number;                // KB
  setOutputFormat: (format: string) => void;
  setQuality: (quality: number) => void;
  setCompressionMode: (mode: string) => void;
  setTargetSize: (size: number) => void;

  // 处理相关
  processing: boolean;
  totalProgress: number;              // 0-100
  startProcessing: () => Promise<void>;
  cancelProcessing: () => void;
  downloadZip: () => Promise<void>;
}

const useStore = create<AppState>((set, get) => ({
  // 初始状态
  files: [],
  outputFormat: 'jpeg',
  quality: 80,
  compressionMode: 'quality',
  processing: false,
  totalProgress: 0,

  // Actions 实现
  addFiles: (newFiles) => {
    const files = newFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file),
      status: FileStatus.PENDING,
      progress: 0,
      originalSize: file.size
    }));
    set(state => ({ files: [...state.files, ...files] }));
  },

  removeFile: (id) => {
    set(state => ({
      files: state.files.filter(f => f.id !== id)
    }));
  },

  // ... 其他 actions
}));

export default useStore;
```

### 5.2 数据模型

#### UploadedFile（上传文件）
```typescript
interface UploadedFile {
  id: string;              // 唯一标识符
  file: File;              // 原始文件对象
  name: string;            // 文件名
  size: number;            // 文件大小（字节）
  type: string;            // MIME 类型
  preview: string;         // 缩略图 URL
  status: FileStatus;      // 处理状态
}
```

#### ProcessedFile（处理后文件）
```typescript
interface ProcessedFile extends UploadedFile {
  status: FileStatus;
  progress: number;              // 处理进度 0-100
  processedBlob?: Blob;          // 处理后的文件
  error?: string;                // 错误信息
  originalSize: number;          // 原始大小
  compressedSize?: number;       // 压缩后大小
  compressionRatio?: number;     // 压缩比例（百分比）
  processingTime?: number;       // 处理耗时（毫秒）
}
```

#### FileStatus（文件状态枚举）
```typescript
enum FileStatus {
  PENDING = 'pending',           // 等待处理
  PROCESSING = 'processing',     // 处理中
  SUCCESS = 'success',           // 成功
  ERROR = 'error'                // 失败
}
```

#### ConversionOptions（转换选项）
```typescript
interface ConversionOptions {
  outputFormat: 'jpeg' | 'png' | 'webp';
  quality: number;                         // 0-100
  compressionMode: 'quality' | 'size';
  targetSize?: number;                     // KB（仅在 size 模式下）
  maxWidthOrHeight?: number;               // 最大尺寸限制
}
```

---

## 六、关键技术实现

### 6.1 格式转换核心函数

```typescript
// lib/imageUtils.ts

/**
 * 将图片转换为指定格式
 * @param file - 原始文件
 * @param outputFormat - 目标格式
 * @param quality - 质量（0-100）
 * @returns 转换后的 Blob
 */
export async function convertFormat(
  file: File,
  outputFormat: 'jpeg' | 'png' | 'webp',
  quality: number = 90
): Promise<Blob> {
  // 1. 预处理：如果是 HEIC，先转换为 JPEG
  let sourceFile = file;
  if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
    sourceFile = await convertHEIC(file);
  }

  // 2. 使用 createImageBitmap 解码图片
  const imageBitmap = await createImageBitmap(sourceFile);

  // 3. 创建 Canvas 并绘制
  const canvas = document.createElement('canvas');
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  ctx.drawImage(imageBitmap, 0, 0);

  // 4. 转换为目标格式
  const mimeType = `image/${outputFormat}`;
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert image'));
        }
      },
      mimeType,
      quality / 100
    );
  });
}

/**
 * 将 HEIC 格式转换为 JPEG
 * @param file - HEIC 文件
 * @returns JPEG Blob
 */
export async function convertHEIC(file: File): Promise<File> {
  const heic2any = (await import('heic2any')).default;

  const convertedBlob = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.9
  }) as Blob;

  return new File([convertedBlob], file.name.replace(/\.heic$/i, '.jpg'), {
    type: 'image/jpeg'
  });
}
```

### 6.2 压缩核心函数

```typescript
// lib/compression.ts
import imageCompression from 'browser-image-compression';

/**
 * 按质量压缩图片
 * @param file - 原始文件
 * @param quality - 质量（0-100）
 * @returns 压缩后的 Blob
 */
export async function compressByQuality(
  file: File,
  quality: number
): Promise<Blob> {
  const options: imageCompression.Options = {
    maxWidthOrHeight: 4096,
    useWebWorker: true,
    initialQuality: quality / 100,
    alwaysKeepResolution: true,  // 保持分辨率
  };

  return await imageCompression(file, options);
}

/**
 * 按目标大小压缩图片
 * @param file - 原始文件
 * @param targetSizeKB - 目标大小（KB）
 * @returns 压缩后的 Blob
 */
export async function compressBySize(
  file: File,
  targetSizeKB: number
): Promise<Blob> {
  const options: imageCompression.Options = {
    maxSizeMB: targetSizeKB / 1024,
    maxWidthOrHeight: 4096,
    useWebWorker: true,
    initialQuality: 0.8,
    alwaysKeepResolution: false,  // 允许降低分辨率以满足大小要求
  };

  return await imageCompression(file, options);
}

/**
 * 统一压缩接口
 */
export async function compressImage(
  file: File,
  options: {
    mode: 'quality' | 'size';
    quality?: number;
    targetSize?: number;
  }
): Promise<Blob> {
  if (options.mode === 'quality' && options.quality !== undefined) {
    return compressByQuality(file, options.quality);
  } else if (options.mode === 'size' && options.targetSize !== undefined) {
    return compressBySize(file, options.targetSize);
  } else {
    throw new Error('Invalid compression options');
  }
}
```

### 6.3 批量处理函数

```typescript
// lib/imageUtils.ts

/**
 * 批量处理图片
 * @param files - 文件列表
 * @param options - 转换选项
 * @param onProgress - 进度回调
 * @returns 处理结果
 */
export async function processBatchImages(
  files: ProcessedFile[],
  options: ConversionOptions,
  onProgress?: (id: string, progress: number) => void
): Promise<Map<string, Blob>> {
  const results = new Map<string, Blob>();
  const concurrency = 3; // 并发数

  // 创建处理队列
  const queue = [...files];
  const processing = new Set<Promise<void>>();

  while (queue.length > 0 || processing.size > 0) {
    // 填充处理队列到并发数
    while (processing.size < concurrency && queue.length > 0) {
      const file = queue.shift()!;

      const task = (async () => {
        try {
          // 1. 格式转换
          onProgress?.(file.id, 30);
          let blob = await convertFormat(
            file.file,
            options.outputFormat,
            options.quality
          );

          // 2. 压缩（如果需要）
          if (options.compressionMode === 'size' && options.targetSize) {
            onProgress?.(file.id, 60);
            const compressedFile = new File([blob], file.name, {
              type: blob.type
            });
            blob = await compressBySize(compressedFile, options.targetSize);
          }

          onProgress?.(file.id, 100);
          results.set(file.id, blob);
        } catch (error) {
          console.error(`Failed to process ${file.name}:`, error);
          onProgress?.(file.id, -1); // 错误标记
        }
      })();

      processing.add(task);
      task.finally(() => processing.delete(task));
    }

    // 等待任一任务完成
    if (processing.size > 0) {
      await Promise.race(processing);
    }
  }

  return results;
}
```

### 6.4 ZIP 打包函数

```typescript
// lib/zipUtils.ts
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * 创建 ZIP 文件并下载
 * @param files - 文件列表
 * @param onProgress - 打包进度回调
 */
export async function createAndDownloadZip(
  files: ProcessedFile[],
  onProgress?: (percent: number) => void
): Promise<void> {
  const zip = new JSZip();
  const nameCounter = new Map<string, number>();

  // 添加文件到 ZIP
  files.forEach((file) => {
    if (!file.processedBlob) return;

    // 处理重名文件
    let filename = generateFilename(file);
    if (nameCounter.has(filename)) {
      const count = nameCounter.get(filename)! + 1;
      nameCounter.set(filename, count);
      const ext = filename.split('.').pop();
      const basename = filename.replace(`.${ext}`, '');
      filename = `${basename}_${count}.${ext}`;
    } else {
      nameCounter.set(filename, 1);
    }

    zip.file(filename, file.processedBlob);
  });

  // 生成 ZIP 文件
  const content = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    },
    (metadata) => {
      onProgress?.(metadata.percent);
    }
  );

  // 触发下载
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  saveAs(content, `PicBatch_${timestamp}.zip`);
}

/**
 * 生成输出文件名
 */
function generateFilename(file: ProcessedFile): string {
  const basename = file.name.replace(/\.[^/.]+$/, '');
  const ext = file.outputFormat || 'jpg';
  return `${basename}.${ext}`;
}
```

### 6.5 Web Worker 实现

```typescript
// workers/imageProcessor.worker.ts

import { convertFormat, compressImage } from '../lib/imageUtils';
import { ConversionOptions } from '../types';

interface WorkerMessage {
  id: string;
  file: File;
  options: ConversionOptions;
}

interface WorkerResponse {
  id: string;
  success: boolean;
  blob?: Blob;
  error?: string;
  size?: number;
}

self.addEventListener('message', async (e: MessageEvent<WorkerMessage>) => {
  const { id, file, options } = e.data;

  try {
    // 1. 格式转换
    let blob = await convertFormat(
      file,
      options.outputFormat,
      options.quality
    );

    // 2. 压缩（如果需要）
    if (options.compressionMode === 'size' && options.targetSize) {
      const tempFile = new File([blob], file.name, { type: blob.type });
      blob = await compressImage(tempFile, {
        mode: 'size',
        targetSize: options.targetSize
      });
    }

    // 3. 返回结果
    const response: WorkerResponse = {
      id,
      success: true,
      blob,
      size: blob.size
    };

    self.postMessage(response, [blob as any]);
  } catch (error) {
    const response: WorkerResponse = {
      id,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    self.postMessage(response);
  }
});
```

---

## 七、开发时间估算

### 7.1 详细工时分配

| 阶段 | 任务 | 工时 | 累计 |
|------|------|------|------|
| **Phase 1** | 项目初始化 | 2h | 2h |
| | Tailwind + shadcn/ui 配置 | 2h | 4h |
| | 基础布局和响应式 | 3h | 7h |
| | ESLint + Prettier | 1h | 8h |
| **Phase 2** | react-dropzone 集成 | 2h | 10h |
| | 上传 UI 开发 | 3h | 13h |
| | 文件验证逻辑 | 2h | 15h |
| | 文件列表组件 | 1h | 16h |
| **Phase 3** | Canvas 转换封装 | 4h | 20h |
| | JPG/PNG/WebP 互转 | 4h | 24h |
| | HEIC 支持 | 3h | 27h |
| | 批量处理队列 | 3h | 30h |
| | UI 和联调 | 2h | 32h |
| **Phase 4** | browser-image-compression 集成 | 2h | 34h |
| | 压缩逻辑实现 | 3h | 37h |
| | 压缩 UI 开发 | 2h | 39h |
| | 对比显示功能 | 1h | 40h |
| **Phase 5** | JSZip 集成 | 2h | 42h |
| | 打包逻辑实现 | 3h | 45h |
| | 下载 UI 和进度 | 2h | 47h |
| | 测试和调试 | 1h | 48h |
| **Phase 6** | 状态管理完善 | 3h | 51h |
| | 进度条组件 | 2h | 53h |
| | Toast 通知 | 2h | 55h |
| | 错误处理 | 1h | 56h |
| **Phase 7** | Web Worker 实现 | 3h | 59h |
| | 性能优化 | 2h | 61h |
| | 移动端测试 | 2h | 63h |
| | 文档编写 | 1h | 64h |
| **总计** | **MVP 1.0** | **64h** | **8 工作日** |

### 7.2 里程碑规划

| 里程碑 | 完成日期 | 交付物 |
|--------|----------|--------|
| **M1: 框架完成** | Day 1 | 可运行的基础项目 |
| **M2: 上传完成** | Day 2 | 可上传和展示图片 |
| **M3: 转换完成** | Day 4 | 可转换格式 |
| **M4: 压缩完成** | Day 5 | 可压缩图片 |
| **M5: 下载完成** | Day 6 | 可打包下载 |
| **M6: 状态完成** | Day 7 | 完整用户反馈 |
| **M7: MVP 上线** | Day 8 | 生产环境部署 |

---

## 八、风险与对策

### 8.1 技术风险

| 风险项 | 影响级别 | 概率 | 影响 | 对策 |
|--------|----------|------|------|------|
| **HEIC 格式兼容性** | 中 | 60% | 部分浏览器不支持 | 使用 heic2any polyfill，降级提示 |
| **50张图片处理卡顿** | 高 | 40% | 用户体验差，投诉 | Web Worker + 分批处理（3-5个并发） |
| **微信浏览器兼容性** | 高 | 30% | 核心用户无法使用 | 降级方案（减少 ES6+ 特性），充分测试 |
| **首次加载 >3MB** | 中 | 50% | 违背性能要求 | 按需加载（动态 import）+ 代码分割 |
| **内存溢出** | 中 | 20% | 处理大图时崩溃 | 限制单个文件大小（<50MB），降低并发 |
| **Canvas 跨域问题** | 低 | 10% | 无法处理外链图片 | 仅支持本地上传，不支持 URL |

### 8.2 产品风险

| 风险项 | 对策 |
|--------|------|
| **用户不理解操作** | 添加引导动画，简化 UI，提供示例 |
| **处理时间过长** | 明确显示预估时间，允许取消操作 |
| **格式不符合需求** | 支持常见格式，提供格式说明文档 |
| **文件丢失担忧** | 强调"本地处理"，添加隐私声明 |

### 8.3 运营风险

| 风险项 | 对策 |
|--------|------|
| **服务器成本** | 使用 Vercel 免费套餐，静态托管 |
| **流量激增** | CDN 加速，按需扩容（Vercel 自动） |
| **恶意使用** | Rate Limit（客户端限制），Cloudflare 防护 |

---

## 九、性能优化策略

### 9.1 加载性能

**目标：首次加载 <3MB，<2秒可交互**

- **代码分割**
  ```typescript
  // 动态导入 HEIC 转换库（仅在需要时加载）
  const heic2any = await import('heic2any');

  // 动态导入 JSZip（仅在下载时加载）
  const JSZip = await import('jszip');
  ```

- **资源优化**
  - 图片资源使用 WebP 格式
  - SVG 图标内联（避免额外请求）
  - 字体子集化（仅包含使用的字符）

- **打包优化**
  ```typescript
  // vite.config.ts
  export default defineConfig({
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'image-libs': ['browser-image-compression', 'heic2any'],
            'ui-libs': ['react', 'react-dom'],
          }
        }
      }
    }
  });
  ```

### 9.2 运行时性能

**目标：50张图片在 2 分钟内处理完成**

- **并发控制**
  - 同时处理 3-5 个文件（避免内存溢出）
  - 使用 Web Worker（不阻塞主线程）

- **内存管理**
  ```typescript
  // 及时释放 ObjectURL
  URL.revokeObjectURL(preview);

  // 清理 Canvas
  canvas.width = 0;
  canvas.height = 0;
  ```

- **进度反馈**
  - 显示实时进度条
  - 显示预估剩余时间

### 9.3 移动端优化

- **触摸优化**
  - 增大可点击区域（最小 44x44px）
  - 滑动手势支持

- **性能优化**
  - 降低移动端并发数（2个）
  - 限制缩略图尺寸

---

## 十、测试策略

### 10.1 单元测试

**覆盖率目标：>80%**

```typescript
// __tests__/imageUtils.test.ts
import { convertFormat, compressImage } from '../lib/imageUtils';

describe('imageUtils', () => {
  test('convertFormat: JPG to PNG', async () => {
    const file = new File([mockJPG], 'test.jpg', { type: 'image/jpeg' });
    const blob = await convertFormat(file, 'png', 90);
    expect(blob.type).toBe('image/png');
  });

  test('compressImage: quality mode', async () => {
    const file = new File([mockPNG], 'test.png', { type: 'image/png' });
    const blob = await compressImage(file, { mode: 'quality', quality: 50 });
    expect(blob.size).toBeLessThan(file.size);
  });
});
```

### 10.2 集成测试

**测试场景：**
1. 上传 10 张图片 → 转换为 WebP → 下载 ZIP
2. 上传 HEIC 图片 → 转换为 JPG → 验证格式
3. 压缩图片到 500KB → 验证文件大小

### 10.3 兼容性测试

**测试矩阵：**

| 设备 | 浏览器 | 版本 | 状态 |
|------|--------|------|------|
| Windows | Chrome | Latest | ✅ |
| Windows | Edge | Latest | ✅ |
| macOS | Safari | Latest | ⚠️ 待测试 |
| iOS | Safari | Latest | ⚠️ 待测试 |
| Android | Chrome | Latest | ⚠️ 待测试 |
| 微信 | 内置浏览器 | Latest | ⚠️ 重点测试 |

---

## 十一、部署方案

### 11.1 Vercel 部署配置

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        },
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        }
      ]
    }
  ]
}
```

### 11.2 环境变量

```env
# .env.production
VITE_APP_NAME=轻图 PicBatch
VITE_APP_VERSION=1.0.0
VITE_MAX_FILE_SIZE=52428800  # 50MB
VITE_MAX_FILES=50
```

### 11.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 十二、MVP 1.0 上线标准

### 必须功能（Launch Blockers）

- ✅ 拖拽上传多个图片
- ✅ 点击按钮选择图片
- ✅ JPG/PNG/WebP 格式互转
- ✅ 质量压缩（滑块调节 0-100）
- ✅ 批量打包下载 ZIP
- ✅ 处理进度实时显示
- ✅ 移动端响应式适配
- ✅ 错误提示清晰友好
- ✅ 首次加载 <3MB
- ✅ 单张图片处理 <2 秒

### 可以延后功能（Nice to Have）

- ⏸️ HEIC 格式支持（1.1 版本）
- ⏸️ 按目标大小压缩（1.1 版本）
- ⏸️ 批量裁剪/缩放（1.1 版本）
- ⏸️ 批量重命名（1.1 版本）
- ⏸️ 广告接入（1.1 版本）
- ⏸️ 微信小程序（1.2 版本）

### 上线前检查清单

**功能测试：**
- [ ] 可上传 50 张图片不崩溃
- [ ] 格式转换正确无误
- [ ] 压缩效果符合预期
- [ ] ZIP 下载正常
- [ ] 所有错误场景有提示

**性能测试：**
- [ ] 首屏加载 <2 秒
- [ ] 打包体积 <3MB
- [ ] 50 张图片处理 <2 分钟
- [ ] 无内存泄漏

**兼容性测试：**
- [ ] Chrome 正常
- [ ] Edge 正常
- [ ] 微信浏览器正常
- [ ] iOS Safari 正常
- [ ] Android Chrome 正常

**安全测试：**
- [ ] 无 XSS 漏洞
- [ ] 文件类型验证正确
- [ ] 无敏感信息泄露

**文档完善：**
- [ ] README 完整
- [ ] 用户使用指南
- [ ] 隐私政策声明

---

## 十三、后续版本规划

### Version 1.1（预计 +2 周）

**新增功能：**
1. HEIC 格式完整支持
2. 按目标大小压缩
3. 批量裁剪（1:1、16:9、4:3、自定义）
4. 批量重命名（前缀 + 序号）
5. Google AdSense 接入

**技术改进：**
- IndexedDB 缓存处理记录
- PWA 支持（离线使用）
- 国际化（中英文切换）

### Version 1.2（预计 +4 周）

**新平台：**
- 微信小程序上线（Taro 框架）
- 响应式优化升级

### Version 2.0（预计 +3 个月）

**高级功能：**
- AI 智能裁剪（人脸识别居中）
- 批量水印添加
- API 服务（付费）
- 图片美化滤镜

---

## 附录

### A. 依赖清单（2025 最新版本）

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zustand": "^4.5.2",
    "react-dropzone": "^14.2.3",
    "browser-image-compression": "^2.0.2",
    "jszip": "^3.10.1",
    "file-saver": "^2.0.5",
    "heic2any": "^0.0.4"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^7.0.0",
    "typescript": "^5.6.0",
    "tailwindcss": "^3.4.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.3.0"
  }
}
```

**版本说明：**
- React 19 需要对应的 @types 包
- Vite 7 需要 @vitejs/plugin-react ^4.3.0+
- TypeScript 5.6+ 提供更好的 React 19 类型支持
- ESLint 9 提供扁平化配置

### B. 参考资料

**官方文档：**
- [React 19 文档](https://react.dev/blog/2024/12/05/react-19)
- [Vite 7 发布公告](https://vite.dev/blog/announcing-vite7)
- [Canvas API 文档](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Zustand 文档](https://docs.pmnd.rs/zustand)
- [shadcn/ui 文档](https://ui.shadcn.com)

**工具库文档：**
- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)
- [JSZip 文档](https://stuk.github.io/jszip/)
- [react-dropzone](https://react-dropzone.js.org/)
- [Vercel 部署指南](https://vercel.com/docs)

**最佳实践：**
- [React 19 升级指南](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Vite 性能优化](https://vite.dev/guide/performance)
- [TypeScript React 最佳实践](https://react-typescript-cheatsheet.netlify.app/)

### C. 联系方式

**技术支持：** [GitHub Issues](https://github.com/your-org/picbatch/issues)
**产品反馈：** feedback@picbatch.com

---

**文档结束**
