# PicBatch 实现路线图与任务清单

> 基于 MVP PRD、技术设计方案和 2025 最新技术栈的完整实施计划
> 创建日期：2025-10-06
> 项目周期：8-10 工作日（MVP 1.0）

---

## 📋 目录

- [项目概览](#项目概览)
- [阶段 0：项目初始化](#阶段-0项目初始化)
- [阶段 1：基础框架搭建](#阶段-1基础框架搭建)
- [阶段 2：文件上传模块](#阶段-2文件上传模块)
- [阶段 3：格式转换核心](#阶段-3格式转换核心)
- [阶段 4：画质压缩功能](#阶段-4画质压缩功能)
- [阶段 5：批量下载功能](#阶段-5批量下载功能)
- [阶段 6：进度与状态管理](#阶段-6进度与状态管理)
- [阶段 7：优化与测试](#阶段-7优化与测试)
- [阶段 8：部署上线](#阶段-8部署上线)
- [后续版本规划](#后续版本规划)
- [风险控制](#风险控制)

---

## 项目概览

### 核心目标

构建一个**隐私优先、免费开放、易用高效**的浏览器端图片批量处理工具。

### 关键指标

| 指标 | 目标值 | 验收标准 |
|------|--------|----------|
| 首次加载时间 | <3MB | 打包体积不超过 3MB |
| 单张图片处理 | ≤2秒 | 中等分辨率图片转换时间 |
| 批量处理能力 | 支持 50 张 | 不崩溃、不卡顿 |
| 用户任务时长 | ≤2 分钟 | 从上传到下载完成 |
| 浏览器兼容 | Chrome/Edge/微信 | 核心功能正常运行 |

### 技术栈

```yaml
前端框架: Vite 7 + React 19 + TypeScript 5.6
UI 组件: shadcn/ui v3.2+
状态管理: zustand v4.5+
图片处理: Canvas API + browser-image-compression
文件处理: jszip + file-saver
部署平台: Vercel
```

### 项目里程碑

```
Day 1: 项目初始化 + 基础框架
Day 2: 文件上传功能完成
Day 4: 格式转换功能完成
Day 5: 压缩功能完成
Day 6: 下载功能完成
Day 7: 状态管理完善
Day 8: 优化测试完成
Day 9: 部署上线
Day 10: 监控与迭代准备
```

---

## 阶段 0：项目初始化

**目标：** 搭建完整的开发环境，配置好所有工具链

**工时：** 2-3 小时

### 任务清单

#### 0.1 创建项目 [P0]

**执行命令：**
```bash
# 使用 Vite 7 最新模板
npm create vite@latest picbatch -- --template react-ts
cd picbatch
```

**验收标准：**
- [x] 项目目录创建成功
- [x] package.json 生成
- [x] 可以运行 `npm install`

---

#### 0.2 升级到 React 19 [P0]

**执行命令：**
```bash
npm install react@19 react-dom@19
npm install -D @types/react@19 @types/react-dom@19
```

**更新 vite.config.ts：**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    holdUntilCrawlEnd: false, // Vite 7 优化
  },
  server: {
    warmup: {
      clientFiles: ['./src/App.tsx', './src/main.tsx'],
    },
  },
})
```

**验收标准：**
- [x] React 19 安装成功
- [x] 开发服务器可以启动
- [x] 无类型错误

---

#### 0.3 配置 Tailwind CSS [P0]

**执行命令：**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**tailwind.config.js 配置：**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**src/index.css：**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**验收标准：**
- [x] Tailwind 样式生效
- [x] 暗色模式配置完成

---

#### 0.4 安装 shadcn/ui [P0]

**执行命令：**
```bash
npx shadcn@latest init
```

**配置选项：**
```
✔ Would you like to use TypeScript? … yes
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Where is your global CSS file? … src/index.css
✔ Would you like to use CSS variables for colors? … yes
✔ Where is your tailwind.config.js located? … tailwind.config.js
✔ Configure the import alias for components: … @/components
✔ Configure the import alias for utils: … @/lib/utils
```

**验收标准：**
- [x] components.json 生成
- [x] lib/utils.ts 创建成功
- [x] 可以添加组件

---

#### 0.5 安装核心依赖 [P0]

**执行命令：**
```bash
# 生产依赖
npm install zustand react-dropzone browser-image-compression jszip file-saver heic2any

# 开发依赖
npm install -D @types/file-saver
```

**验收标准：**
- [x] 所有依赖安装成功
- [x] package.json 版本正确
- [x] 无依赖冲突

---

#### 0.6 配置 ESLint 和 Prettier [P1]

**执行命令：**
```bash
npm install -D eslint@9 prettier eslint-plugin-react-hooks eslint-plugin-react-refresh
```

**eslint.config.js（ESLint 9 扁平化配置）：**
```javascript
import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
```

**.prettierrc：**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

**验收标准：**
- [x] ESLint 配置生效
- [x] Prettier 格式化正常
- [x] IDE 集成成功

---

#### 0.7 创建项目文件结构 [P0]

**执行命令：**
```bash
mkdir -p src/{components,lib,store,types,hooks,workers}
mkdir -p src/components/ui
```

**文件结构：**
```
src/
├── components/
│   ├── ui/              # shadcn/ui 组件
│   ├── FileUploader.tsx
│   ├── FileList.tsx
│   ├── FileItem.tsx
│   ├── ToolPanel.tsx
│   ├── ProgressBar.tsx
│   └── DownloadButton.tsx
├── lib/
│   ├── imageUtils.ts
│   ├── compression.ts
│   ├── zipUtils.ts
│   └── fileUtils.ts
├── store/
│   └── useStore.ts
├── types/
│   └── index.ts
├── hooks/
│   ├── useImageProcessor.ts
│   └── useFileUpload.ts
├── workers/
│   └── imageProcessor.worker.ts
├── App.tsx
├── main.tsx
└── index.css
```

**验收标准：**
- [x] 所有目录创建成功
- [x] 文件结构清晰合理

---

#### 0.8 配置 Git 和版本控制 [P1]

**.gitignore：**
```
# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# production
dist
dist-ssr

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/*
!.vscode/settings.json
.idea

# Vite
.vite
```

**执行命令：**
```bash
git init
git add .
git commit -m "chore: initial project setup with Vite 7 + React 19"
```

**验收标准：**
- [x] Git 仓库初始化
- [x] 首次提交完成
- [x] .gitignore 配置正确

---

### 阶段 0 验收检查表

- [ ] 项目可以正常启动（`npm run dev`）
- [ ] 所有依赖安装无错误
- [ ] TypeScript 类型检查通过
- [ ] ESLint 检查通过
- [ ] 可以添加 shadcn/ui 组件
- [ ] Git 版本控制配置完成

**预计完成时间：** Day 1 上午

---

## 阶段 1：基础框架搭建

**目标：** 完成应用基础布局和路由结构

**工时：** 4-5 小时

### 任务清单

#### 1.1 创建类型定义 [P0]

**文件：** `src/types/index.ts`

```typescript
export enum FileStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview: string;
  status: FileStatus;
}

export interface ProcessedFile extends UploadedFile {
  progress: number;
  processedBlob?: Blob;
  error?: string;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
  processingTime?: number;
}

export type OutputFormat = 'jpeg' | 'png' | 'webp';
export type CompressionMode = 'quality' | 'size';

export interface ConversionOptions {
  outputFormat: OutputFormat;
  quality: number;
  compressionMode: CompressionMode;
  targetSize?: number;
  maxWidthOrHeight?: number;
}
```

**验收标准：**
- [x] 所有类型定义清晰
- [x] 无 TypeScript 错误

---

#### 1.2 创建 Zustand Store [P0]

**文件：** `src/store/useStore.ts`

```typescript
import { create } from 'zustand';
import { ProcessedFile, FileStatus, OutputFormat, CompressionMode } from '@/types';

interface AppState {
  // 文件相关
  files: ProcessedFile[];
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateFileStatus: (id: string, status: FileStatus, progress?: number) => void;
  updateFileResult: (id: string, blob: Blob, size: number) => void;

  // 设置相关
  outputFormat: OutputFormat;
  quality: number;
  compressionMode: CompressionMode;
  targetSize?: number;
  setOutputFormat: (format: OutputFormat) => void;
  setQuality: (quality: number) => void;
  setCompressionMode: (mode: CompressionMode) => void;
  setTargetSize: (size?: number) => void;

  // 处理相关
  processing: boolean;
  totalProgress: number;
  setProcessing: (processing: boolean) => void;
  setTotalProgress: (progress: number) => void;
}

export const useStore = create<AppState>((set) => ({
  // 初始状态
  files: [],
  outputFormat: 'jpeg',
  quality: 80,
  compressionMode: 'quality',
  targetSize: undefined,
  processing: false,
  totalProgress: 0,

  // Actions
  addFiles: (newFiles) => {
    const files = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file),
      status: FileStatus.PENDING,
      progress: 0,
      originalSize: file.size,
    }));
    set((state) => ({ files: [...state.files, ...files] }));
  },

  removeFile: (id) => {
    set((state) => {
      const file = state.files.find((f) => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return { files: state.files.filter((f) => f.id !== id) };
    });
  },

  clearFiles: () => {
    set((state) => {
      state.files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      return { files: [] };
    });
  },

  updateFileStatus: (id, status, progress) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, status, progress: progress ?? f.progress } : f
      ),
    }));
  },

  updateFileResult: (id, blob, size) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id
          ? {
              ...f,
              processedBlob: blob,
              compressedSize: size,
              compressionRatio: Math.round((1 - size / f.originalSize) * 100),
              status: FileStatus.SUCCESS,
              progress: 100,
            }
          : f
      ),
    }));
  },

  setOutputFormat: (format) => set({ outputFormat: format }),
  setQuality: (quality) => set({ quality }),
  setCompressionMode: (mode) => set({ compressionMode: mode }),
  setTargetSize: (size) => set({ targetSize: size }),
  setProcessing: (processing) => set({ processing }),
  setTotalProgress: (progress) => set({ totalProgress: progress }),
}));
```

**验收标准：**
- [x] Store 创建成功
- [x] 所有 Actions 实现
- [x] TypeScript 类型正确

---

#### 1.3 添加 shadcn/ui 基础组件 [P0]

**执行命令：**
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add progress
npx shadcn@latest add slider
npx shadcn@latest add radio-group
npx shadcn@latest add select
npx shadcn@latest add toast
npx shadcn@latest add separator
npx shadcn@latest add badge
npx shadcn@latest add alert
```

**验收标准：**
- [x] 所有组件添加成功
- [x] 可以正常导入使用

---

#### 1.4 创建主布局组件 [P0]

**文件：** `src/components/Header.tsx`

```typescript
export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-xl font-bold text-primary-foreground">轻</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">轻图 PicBatch</h1>
            <p className="text-xs text-muted-foreground">免费在线图片批量处理</p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <a href="#features" className="text-sm hover:text-primary">
            功能
          </a>
          <a href="#about" className="text-sm hover:text-primary">
            关于
          </a>
        </nav>
      </div>
    </header>
  );
}
```

**文件：** `src/App.tsx`

```typescript
import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex flex-col gap-8">
          {/* 主要内容区域 */}
          <div className="text-center">
            <h2 className="text-3xl font-bold">开始处理您的图片</h2>
            <p className="mt-2 text-muted-foreground">
              上传、转换、压缩、下载 - 全在浏览器本地完成
            </p>
          </div>

          {/* 功能区域占位 */}
          <div className="grid gap-6">
            {/* 这里将放置上传、设置、文件列表等组件 */}
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
```

**验收标准：**
- [x] 页面布局完整
- [x] 响应式设计生效
- [x] 暗色模式支持

---

#### 1.5 配置主题切换 [P2]

**文件：** `src/components/ThemeToggle.tsx`

```typescript
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}
```

**验收标准：**
- [x] 主题切换正常
- [x] 持久化存储（可选）

---

### 阶段 1 验收检查表

- [ ] 类型定义完整无误
- [ ] Zustand store 功能正常
- [ ] 主布局渲染正确
- [ ] 响应式设计在移动端正常
- [ ] 暗色模式切换正常

**预计完成时间：** Day 1 下午

---

## 阶段 2：文件上传模块

**目标：** 完成拖拽上传、文件验证和列表展示

**工时：** 6-8 小时

### 任务清单

#### 2.1 创建文件工具函数 [P0]

**文件：** `src/lib/fileUtils.ts`

```typescript
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
    return { valid: false, error: '不支持的文件格式' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: '文件大小超过 50MB' };
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}
```

**验收标准：**
- [x] 文件验证逻辑正确
- [x] 文件大小格式化正确

---

#### 2.2 创建文件上传组件 [P0]

**文件：** `src/components/FileUploader.tsx`

```typescript
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { validateFile } from '@/lib/fileUtils';
import { useToast } from '@/hooks/use-toast';

export function FileUploader() {
  const { addFiles } = useStore();
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles: File[] = [];
      const errors: string[] = [];

      acceptedFiles.forEach((file) => {
        const { valid, error } = validateFile(file);
        if (valid) {
          validFiles.push(file);
        } else {
          errors.push(`${file.name}: ${error}`);
        }
      });

      if (validFiles.length > 0) {
        addFiles(validFiles);
        toast({
          title: '上传成功',
          description: `已添加 ${validFiles.length} 个文件`,
        });
      }

      if (errors.length > 0) {
        toast({
          title: '部分文件上传失败',
          description: errors.join('\n'),
          variant: 'destructive',
        });
      }
    },
    [addFiles, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic'],
    },
    multiple: true,
  });

  return (
    <Card
      {...getRootProps()}
      className={`cursor-pointer border-2 border-dashed p-12 text-center transition-colors ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {isDragActive ? (
          <>
            <Upload className="h-12 w-12 text-primary" />
            <p className="text-lg font-medium">松开以上传文件</p>
          </>
        ) : (
          <>
            <Image className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">拖拽图片到这里</p>
              <p className="text-sm text-muted-foreground">
                或点击选择文件（支持 JPG、PNG、WebP、HEIC）
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              支持批量上传，单个文件最大 50MB
            </p>
          </>
        )}
      </div>
    </Card>
  );
}
```

**验收标准：**
- [x] 拖拽上传正常
- [x] 点击上传正常
- [x] 文件验证生效
- [x] 错误提示清晰

---

#### 2.3 创建文件列表项组件 [P0]

**文件：** `src/components/FileItem.tsx`

```typescript
import { ProcessedFile, FileStatus } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { formatFileSize } from '@/lib/fileUtils';
import { useStore } from '@/store/useStore';

interface FileItemProps {
  file: ProcessedFile;
}

export function FileItem({ file }: FileItemProps) {
  const { removeFile } = useStore();

  const getStatusIcon = () => {
    switch (file.status) {
      case FileStatus.SUCCESS:
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case FileStatus.ERROR:
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case FileStatus.PROCESSING:
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        {/* 缩略图 */}
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-muted">
          <img
            src={file.preview}
            alt={file.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* 文件信息 */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-medium truncate">{file.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => removeFile(file.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatFileSize(file.originalSize)}</span>
            {file.compressedSize && (
              <>
                <span>→</span>
                <span>{formatFileSize(file.compressedSize)}</span>
                <Badge variant="secondary" className="text-xs">
                  -{file.compressionRatio}%
                </Badge>
              </>
            )}
          </div>

          {/* 进度条 */}
          {file.status === FileStatus.PROCESSING && (
            <Progress value={file.progress} className="h-1" />
          )}

          {/* 错误信息 */}
          {file.status === FileStatus.ERROR && file.error && (
            <p className="text-xs text-destructive">{file.error}</p>
          )}
        </div>

        {/* 状态图标 */}
        <div className="flex-shrink-0">{getStatusIcon()}</div>
      </div>
    </Card>
  );
}
```

**验收标准：**
- [x] 文件信息显示完整
- [x] 缩略图正常显示
- [x] 删除功能正常
- [x] 状态显示正确

---

#### 2.4 创建文件列表组件 [P0]

**文件：** `src/components/FileList.tsx`

```typescript
import { useStore } from '@/store/useStore';
import { FileItem } from './FileItem';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export function FileList() {
  const { files, clearFiles } = useStore();

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          已选择 {files.length} 个文件
        </h3>
        <Button variant="outline" size="sm" onClick={clearFiles}>
          <Trash2 className="mr-2 h-4 w-4" />
          清空全部
        </Button>
      </div>

      <div className="grid gap-3">
        {files.map((file) => (
          <FileItem key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}
```

**验收标准：**
- [x] 文件列表渲染正常
- [x] 清空功能正常

---

#### 2.5 集成到主应用 [P0]

**更新 `src/App.tsx`：**

```typescript
import { Header } from '@/components/Header';
import { FileUploader } from '@/components/FileUploader';
import { FileList } from '@/components/FileList';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">开始处理您的图片</h2>
            <p className="mt-2 text-muted-foreground">
              上传、转换、压缩、下载 - 全在浏览器本地完成
            </p>
          </div>

          <FileUploader />
          <FileList />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
```

**验收标准：**
- [x] 上传和列表联动正常
- [x] 整体布局合理

---

### 阶段 2 验收检查表

- [ ] 可以拖拽上传图片
- [ ] 可以点击按钮选择图片
- [ ] 文件验证正常（类型、大小）
- [ ] 文件列表显示正确
- [ ] 可以删除单个文件
- [ ] 可以清空所有文件
- [ ] 错误提示友好

**预计完成时间：** Day 2

---

## 阶段 3：格式转换核心

**目标：** 实现图片格式转换核心逻辑

**工时：** 12-16 小时

### 任务清单

#### 3.1 创建图片处理工具函数 [P0]

**文件：** `src/lib/imageUtils.ts`

```typescript
import { OutputFormat } from '@/types';

/**
 * 将图片转换为指定格式
 */
export async function convertFormat(
  file: File,
  outputFormat: OutputFormat,
  quality: number = 90
): Promise<Blob> {
  // 如果是 HEIC，先转换为 JPEG
  let sourceFile = file;
  if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
    sourceFile = await convertHEIC(file);
  }

  // 使用 createImageBitmap 解码图片
  const imageBitmap = await createImageBitmap(sourceFile);

  // 创建 Canvas 并绘制
  const canvas = document.createElement('canvas');
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  ctx.drawImage(imageBitmap, 0, 0);

  // 转换为目标格式
  const mimeType = `image/${outputFormat === 'jpeg' ? 'jpeg' : outputFormat}`;
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
 */
export async function convertHEIC(file: File): Promise<File> {
  const heic2any = (await import('heic2any')).default;

  const convertedBlob = (await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.9,
  })) as Blob;

  return new File([convertedBlob], file.name.replace(/\.heic$/i, '.jpg'), {
    type: 'image/jpeg',
  });
}

/**
 * 获取输出文件名
 */
export function getOutputFilename(
  originalName: string,
  outputFormat: OutputFormat
): string {
  const basename = originalName.replace(/\.[^/.]+$/, '');
  const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
  return `${basename}.${ext}`;
}
```

**验收标准：**
- [x] 格式转换逻辑正确
- [x] HEIC 转换支持
- [x] 错误处理完善

---

#### 3.2 创建压缩工具函数 [P0]

**文件：** `src/lib/compression.ts`

```typescript
import imageCompression from 'browser-image-compression';

/**
 * 按质量压缩图片
 */
export async function compressByQuality(
  file: File,
  quality: number
): Promise<Blob> {
  const options = {
    maxWidthOrHeight: 4096,
    useWebWorker: true,
    initialQuality: quality / 100,
    alwaysKeepResolution: true,
  };

  return await imageCompression(file, options);
}

/**
 * 按目标大小压缩图片
 */
export async function compressBySize(
  file: File,
  targetSizeKB: number
): Promise<Blob> {
  const options = {
    maxSizeMB: targetSizeKB / 1024,
    maxWidthOrHeight: 4096,
    useWebWorker: true,
    initialQuality: 0.8,
    alwaysKeepResolution: false,
  };

  return await imageCompression(file, options);
}
```

**验收标准：**
- [x] 质量压缩正常
- [x] 大小压缩正常

---

#### 3.3 创建工具面板组件 [P0]

**文件：** `src/components/ToolPanel.tsx`

```typescript
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/store/useStore';
import { OutputFormat, CompressionMode } from '@/types';

export function ToolPanel() {
  const {
    outputFormat,
    quality,
    compressionMode,
    targetSize,
    setOutputFormat,
    setQuality,
    setCompressionMode,
    setTargetSize,
  } = useStore();

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">处理设置</h3>

      <div className="space-y-6">
        {/* 输出格式 */}
        <div className="space-y-2">
          <Label>输出格式</Label>
          <Select value={outputFormat} onValueChange={(v) => setOutputFormat(v as OutputFormat)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 压缩模式 */}
        <div className="space-y-2">
          <Label>压缩模式</Label>
          <RadioGroup
            value={compressionMode}
            onValueChange={(v) => setCompressionMode(v as CompressionMode)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="quality" id="quality" />
              <Label htmlFor="quality" className="font-normal">
                质量优先
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="size" id="size" />
              <Label htmlFor="size" className="font-normal">
                大小优先
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* 质量滑块 */}
        {compressionMode === 'quality' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>图片质量</Label>
              <span className="text-sm text-muted-foreground">{quality}%</span>
            </div>
            <Slider
              value={[quality]}
              onValueChange={([v]) => setQuality(v)}
              min={1}
              max={100}
              step={1}
            />
          </div>
        )}

        {/* 目标大小 */}
        {compressionMode === 'size' && (
          <div className="space-y-2">
            <Label>目标大小 (KB)</Label>
            <Input
              type="number"
              value={targetSize || ''}
              onChange={(e) => setTargetSize(Number(e.target.value) || undefined)}
              placeholder="例如: 500"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
```

**验收标准：**
- [x] 格式选择正常
- [x] 压缩模式切换正常
- [x] 质量滑块交互流畅
- [x] 目标大小输入验证

---

#### 3.4 创建图片处理 Hook [P0]

**文件：** `src/hooks/useImageProcessor.ts`

```typescript
import { useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { FileStatus } from '@/types';
import { convertFormat, getOutputFilename } from '@/lib/imageUtils';
import { compressByQuality, compressBySize } from '@/lib/compression';
import { useToast } from '@/hooks/use-toast';

export function useImageProcessor() {
  const {
    files,
    outputFormat,
    quality,
    compressionMode,
    targetSize,
    updateFileStatus,
    updateFileResult,
    setProcessing,
    setTotalProgress,
  } = useStore();
  const { toast } = useToast();

  const processFile = useCallback(
    async (fileId: string) => {
      const file = files.find((f) => f.id === fileId);
      if (!file) return;

      try {
        updateFileStatus(fileId, FileStatus.PROCESSING, 0);

        // 1. 格式转换
        updateFileStatus(fileId, FileStatus.PROCESSING, 30);
        let blob = await convertFormat(file.file, outputFormat, quality);

        // 2. 压缩（如果是大小模式）
        if (compressionMode === 'size' && targetSize) {
          updateFileStatus(fileId, FileStatus.PROCESSING, 60);
          const tempFile = new File([blob], file.name, { type: blob.type });
          blob = await compressBySize(tempFile, targetSize);
        }

        // 3. 完成
        updateFileStatus(fileId, FileStatus.PROCESSING, 100);
        updateFileResult(fileId, blob, blob.size);
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error);
        updateFileStatus(fileId, FileStatus.ERROR, 0);
        toast({
          title: '处理失败',
          description: `${file.name} 处理失败`,
          variant: 'destructive',
        });
      }
    },
    [files, outputFormat, quality, compressionMode, targetSize, updateFileStatus, updateFileResult, toast]
  );

  const processAllFiles = useCallback(async () => {
    if (files.length === 0) {
      toast({
        title: '没有文件',
        description: '请先上传图片',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);
    setTotalProgress(0);

    const pendingFiles = files.filter((f) => f.status === FileStatus.PENDING);
    const total = pendingFiles.length;

    for (let i = 0; i < total; i++) {
      await processFile(pendingFiles[i].id);
      setTotalProgress(Math.round(((i + 1) / total) * 100));
    }

    setProcessing(false);
    toast({
      title: '处理完成',
      description: `成功处理 ${total} 个文件`,
    });
  }, [files, processFile, setProcessing, setTotalProgress, toast]);

  return {
    processAllFiles,
    processFile,
  };
}
```

**验收标准：**
- [x] 单个文件处理正常
- [x] 批量处理正常
- [x] 进度更新正确
- [x] 错误处理完善

---

#### 3.5 创建处理按钮组件 [P0]

**文件：** `src/components/ProcessButton.tsx`

```typescript
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Play } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import { FileStatus } from '@/types';

export function ProcessButton() {
  const { files, processing, totalProgress } = useStore();
  const { processAllFiles } = useImageProcessor();

  const pendingCount = files.filter((f) => f.status === FileStatus.PENDING).length;
  const canProcess = pendingCount > 0 && !processing;

  return (
    <div className="space-y-4">
      <Button
        onClick={processAllFiles}
        disabled={!canProcess}
        size="lg"
        className="w-full"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            处理中...
          </>
        ) : (
          <>
            <Play className="mr-2 h-5 w-5" />
            开始处理 ({pendingCount} 个文件)
          </>
        )}
      </Button>

      {processing && (
        <div className="space-y-2">
          <Progress value={totalProgress} />
          <p className="text-center text-sm text-muted-foreground">
            总进度: {totalProgress}%
          </p>
        </div>
      )}
    </div>
  );
}
```

**验收标准：**
- [x] 按钮状态正确
- [x] 进度显示正常
- [x] 禁用逻辑正确

---

#### 3.6 集成到主应用 [P0]

**更新 `src/App.tsx`：**

```typescript
import { Header } from '@/components/Header';
import { FileUploader } from '@/components/FileUploader';
import { FileList } from '@/components/FileList';
import { ToolPanel } from '@/components/ToolPanel';
import { ProcessButton } from '@/components/ProcessButton';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">开始处理您的图片</h2>
            <p className="mt-2 text-muted-foreground">
              上传、转换、压缩、下载 - 全在浏览器本地完成
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
            <div className="space-y-6">
              <FileUploader />
              <FileList />
            </div>

            <div className="space-y-6">
              <ToolPanel />
              <ProcessButton />
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
```

**验收标准：**
- [x] 布局合理
- [x] 响应式正常

---

### 阶段 3 验收检查表

- [ ] JPG/PNG/WebP 格式互转正常
- [ ] HEIC 转 JPG 正常
- [ ] 质量滑块影响输出质量
- [ ] 批量处理不阻塞 UI
- [ ] 进度显示准确
- [ ] 错误处理完善

**预计完成时间：** Day 4

---

## 阶段 4：画质压缩功能

**目标：** 完善按质量和按大小的压缩功能

**工时：** 6-8 小时

### 任务清单

#### 4.1 测试质量压缩 [P0]

**测试用例：**
1. 上传一张 5MB 的 JPG 图片
2. 设置质量为 50%
3. 处理后验证文件大小明显减小
4. 视觉质量可接受

**验收标准：**
- [x] 质量压缩生效
- [x] 文件大小合理
- [x] 画质可接受

---

#### 4.2 测试大小压缩 [P0]

**测试用例：**
1. 上传一张 3MB 的图片
2. 设置目标大小 500KB
3. 处理后验证文件大小接近 500KB

**验收标准：**
- [x] 大小压缩生效
- [x] 目标大小达成

---

#### 4.3 添加压缩前后对比 [P1]

**增强 `FileItem` 组件：**

```typescript
// 在 FileItem 中添加压缩比例显示
{file.compressionRatio !== undefined && (
  <div className="flex items-center gap-2">
    <Badge variant="secondary">
      压缩 {file.compressionRatio}%
    </Badge>
    <span className="text-xs text-muted-foreground">
      {formatFileSize(file.originalSize)} → {formatFileSize(file.compressedSize!)}
    </span>
  </div>
)}
```

**验收标准：**
- [x] 压缩比例显示正确
- [x] 文件大小对比清晰

---

### 阶段 4 验收检查表

- [ ] 质量压缩正常工作
- [ ] 大小压缩正常工作
- [ ] 压缩比例计算正确
- [ ] 压缩前后对比清晰

**预计完成时间：** Day 5

---

## 阶段 5：批量下载功能

**目标：** 实现 ZIP 打包和批量下载

**工时：** 6-8 小时

### 任务清单

#### 5.1 创建 ZIP 工具函数 [P0]

**文件：** `src/lib/zipUtils.ts`

```typescript
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ProcessedFile } from '@/types';
import { getOutputFilename } from './imageUtils';

export async function createAndDownloadZip(
  files: ProcessedFile[],
  outputFormat: string,
  onProgress?: (percent: number) => void
): Promise<void> {
  const zip = new JSZip();
  const nameCounter = new Map<string, number>();

  // 添加文件到 ZIP
  files.forEach((file) => {
    if (!file.processedBlob) return;

    // 生成文件名
    let filename = getOutputFilename(file.name, outputFormat as any);

    // 处理重名
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

  // 生成 ZIP
  const content = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      onProgress?.(metadata.percent);
    }
  );

  // 下载
  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(content, `PicBatch_${timestamp}.zip`);
}
```

**验收标准：**
- [x] ZIP 生成正常
- [x] 文件名处理正确
- [x] 重名处理正常

---

#### 5.2 创建下载按钮组件 [P0]

**文件：** `src/components/DownloadButton.tsx`

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { FileStatus } from '@/types';
import { createAndDownloadZip } from '@/lib/zipUtils';
import { useToast } from '@/hooks/use-toast';

export function DownloadButton() {
  const { files, outputFormat } = useStore();
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const successCount = files.filter((f) => f.status === FileStatus.SUCCESS).length;

  const handleDownload = async () => {
    if (successCount === 0) {
      toast({
        title: '没有可下载的文件',
        description: '请先处理图片',
        variant: 'destructive',
      });
      return;
    }

    setDownloading(true);
    setDownloadProgress(0);

    try {
      const successFiles = files.filter((f) => f.status === FileStatus.SUCCESS);
      await createAndDownloadZip(successFiles, outputFormat, setDownloadProgress);

      toast({
        title: '下载成功',
        description: `已下载 ${successCount} 个文件`,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: '下载失败',
        description: '打包文件时出错',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleDownload}
        disabled={successCount === 0 || downloading}
        size="lg"
        className="w-full"
        variant="secondary"
      >
        {downloading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            打包中...
          </>
        ) : (
          <>
            <Download className="mr-2 h-5 w-5" />
            下载全部 ({successCount} 个文件)
          </>
        )}
      </Button>

      {downloading && (
        <div className="space-y-2">
          <Progress value={downloadProgress} />
          <p className="text-center text-sm text-muted-foreground">
            打包进度: {Math.round(downloadProgress)}%
          </p>
        </div>
      )}
    </div>
  );
}
```

**验收标准：**
- [x] 下载按钮状态正确
- [x] 打包进度显示正常
- [x] 下载成功

---

#### 5.3 集成到主应用 [P0]

**更新 `src/App.tsx`：**

```typescript
<div className="space-y-6">
  <ToolPanel />
  <ProcessButton />
  <DownloadButton />
</div>
```

**验收标准：**
- [x] 下载按钮显示正常
- [x] 功能集成成功

---

### 阶段 5 验收检查表

- [ ] 可以打包所有已处理的文件
- [ ] ZIP 文件命名合理
- [ ] 文件重名处理正确
- [ ] 打包进度显示准确
- [ ] 下载触发正常

**预计完成时间：** Day 6

---

## 阶段 6：进度与状态管理

**目标：** 完善进度显示和状态反馈

**工时：** 6-8 小时

### 任务清单

#### 6.1 优化文件状态显示 [P0]

已在 `FileItem` 组件中实现，验证：

- [x] 等待状态显示
- [x] 处理中状态（加载动画）
- [x] 成功状态（绿色勾）
- [x] 失败状态（红色叉）

**验收标准：**
- [x] 所有状态图标正确
- [x] 状态切换流畅

---

#### 6.2 添加总体统计信息 [P1]

**创建组件：** `src/components/Statistics.tsx`

```typescript
import { Card } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { FileStatus } from '@/types';
import { formatFileSize } from '@/lib/fileUtils';

export function Statistics() {
  const { files } = useStore();

  const stats = {
    total: files.length,
    pending: files.filter((f) => f.status === FileStatus.PENDING).length,
    processing: files.filter((f) => f.status === FileStatus.PROCESSING).length,
    success: files.filter((f) => f.status === FileStatus.SUCCESS).length,
    error: files.filter((f) => f.status === FileStatus.ERROR).length,
    originalSize: files.reduce((sum, f) => sum + f.originalSize, 0),
    compressedSize: files.reduce((sum, f) => sum + (f.compressedSize || 0), 0),
  };

  const savedRatio =
    stats.compressedSize > 0
      ? Math.round((1 - stats.compressedSize / stats.originalSize) * 100)
      : 0;

  if (files.length === 0) return null;

  return (
    <Card className="p-4">
      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <div>
          <p className="text-muted-foreground">总文件数</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div>
          <p className="text-muted-foreground">已完成</p>
          <p className="text-2xl font-bold text-green-600">{stats.success}</p>
        </div>
        <div>
          <p className="text-muted-foreground">原始大小</p>
          <p className="text-xl font-semibold">{formatFileSize(stats.originalSize)}</p>
        </div>
        {stats.compressedSize > 0 && (
          <div>
            <p className="text-muted-foreground">压缩后</p>
            <p className="text-xl font-semibold">
              {formatFileSize(stats.compressedSize)}
              <span className="ml-2 text-sm text-green-600">(-{savedRatio}%)</span>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
```

**验收标准：**
- [x] 统计数据正确
- [x] 实时更新

---

#### 6.3 添加 Toast 通知优化 [P1]

确保以下场景都有清晰的通知：

- [x] 文件上传成功/失败
- [x] 文件处理开始/完成/失败
- [x] 批量处理完成
- [x] 下载开始/完成/失败

**验收标准：**
- [x] 所有操作都有反馈
- [x] 通知内容清晰

---

### 阶段 6 验收检查表

- [ ] 文件状态图标清晰
- [ ] 进度条更新流畅
- [ ] 统计信息准确
- [ ] Toast 通知完善
- [ ] 错误信息友好

**预计完成时间：** Day 7

---

## 阶段 7：优化与测试

**目标：** 性能优化、兼容性测试、体验优化

**工时：** 8-10 小时

### 任务清单

#### 7.1 实现 Web Worker [P1]

**文件：** `src/workers/imageProcessor.worker.ts`

```typescript
import { convertFormat } from '../lib/imageUtils';
import { compressBySize } from '../lib/compression';

interface WorkerMessage {
  id: string;
  file: File;
  options: {
    outputFormat: 'jpeg' | 'png' | 'webp';
    quality: number;
    compressionMode: 'quality' | 'size';
    targetSize?: number;
  };
}

self.addEventListener('message', async (e: MessageEvent<WorkerMessage>) => {
  const { id, file, options } = e.data;

  try {
    // 格式转换
    let blob = await convertFormat(file, options.outputFormat, options.quality);

    // 压缩
    if (options.compressionMode === 'size' && options.targetSize) {
      const tempFile = new File([blob], file.name, { type: blob.type });
      blob = await compressBySize(tempFile, options.targetSize);
    }

    self.postMessage({
      id,
      success: true,
      blob,
      size: blob.size,
    });
  } catch (error) {
    self.postMessage({
      id,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
```

**更新 Hook 使用 Worker：** （可选，如果性能有问题）

**验收标准：**
- [x] Worker 工作正常
- [x] UI 不阻塞

---

#### 7.2 性能测试 [P0]

**测试场景：**

| 场景 | 要求 | 实际 | 通过 |
|------|------|------|------|
| 上传 50 张图片 | 不崩溃 | ? | ⬜ |
| 单张图片处理 | ≤2秒 | ? | ⬜ |
| 50 张批量处理 | ≤2分钟 | ? | ⬜ |
| 首屏加载 | <3MB | ? | ⬜ |
| 内存占用 | 正常 | ? | ⬜ |

**验收标准：**
- [x] 所有场景通过

---

#### 7.3 移动端适配测试 [P0]

**测试设备：**

- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] 微信内置浏览器

**测试项：**

- [ ] 上传功能正常
- [ ] 按钮可点击（最小 44px）
- [ ] 滑块易操作
- [ ] 布局合理不溢出
- [ ] 性能可接受

**验收标准：**
- [x] 所有设备正常工作

---

#### 7.4 浏览器兼容性测试 [P0]

**测试浏览器：**

- [ ] Chrome (最新版)
- [ ] Edge (最新版)
- [ ] Safari (最新版)
- [ ] 微信浏览器

**验收标准：**
- [x] 核心功能都正常

---

#### 7.5 代码分割和懒加载 [P1]

**更新 `vite.config.ts`：**

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom'],
        'vendor-ui': ['@radix-ui/react-dropdown-menu', '@radix-ui/react-slider'],
        'vendor-image': ['browser-image-compression', 'heic2any'],
        'vendor-zip': ['jszip', 'file-saver'],
      },
    },
  },
},
```

**验收标准：**
- [x] 打包体积 <3MB
- [x] 代码分割合理

---

#### 7.6 添加加载状态和骨架屏 [P2]

**创建 Loading 组件：** `src/components/ui/skeleton.tsx`

（使用 shadcn/ui）

```bash
npx shadcn@latest add skeleton
```

**验收标准：**
- [x] 加载体验流畅

---

#### 7.7 错误边界 [P1]

**创建组件：** `src/components/ErrorBoundary.tsx`

```typescript
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">出错了</h1>
            <p className="mt-2 text-muted-foreground">请刷新页面重试</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**在 `main.tsx` 中使用：**

```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**验收标准：**
- [x] 错误捕获正常
- [x] 友好的错误提示

---

#### 7.8 添加 SEO 元数据 [P1]

**更新 `index.html`：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO -->
    <meta name="description" content="轻图 - 免费在线图片批量处理工具，支持格式转换、压缩、裁剪。完全在浏览器本地处理，保护您的隐私。" />
    <meta name="keywords" content="图片转换,图片压缩,批量处理,JPG转PNG,WebP,在线工具" />
    <meta name="author" content="PicBatch" />

    <!-- Open Graph -->
    <meta property="og:title" content="轻图 PicBatch - 免费在线图片批量处理" />
    <meta property="og:description" content="免费、快速、隐私安全的在线图片处理工具" />
    <meta property="og:type" content="website" />

    <title>轻图 PicBatch - 免费在线图片批量处理</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**验收标准：**
- [x] SEO 标签完整

---

#### 7.9 性能优化检查 [P0]

**运行构建：**

```bash
npm run build
```

**检查项：**

- [ ] 打包体积 <3MB
- [ ] Lighthouse 分数 >90
- [ ] 无 console 错误
- [ ] 无 TypeScript 错误

**验收标准：**
- [x] 所有检查通过

---

### 阶段 7 验收检查表

- [ ] 50 张图片批量处理不卡顿
- [ ] 移动端体验流畅
- [ ] 所有浏览器兼容
- [ ] 打包体积达标
- [ ] 错误处理完善
- [ ] SEO 优化完成

**预计完成时间：** Day 8

---

## 阶段 8：部署上线

**目标：** 部署到 Vercel，配置域名，监控上线

**工时：** 4-6 小时

### 任务清单

#### 8.1 准备部署 [P0]

**创建 `vercel.json`：**

```json
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

**验收标准：**
- [x] vercel.json 配置完成

---

#### 8.2 Vercel 部署 [P0]

**执行步骤：**

1. 访问 [vercel.com](https://vercel.com)
2. 连接 GitHub 仓库
3. 导入项目
4. 自动部署

**验收标准：**
- [x] 部署成功
- [x] 可以访问

---

#### 8.3 配置环境变量 [P1]

**在 Vercel Dashboard 设置：**

```
VITE_APP_NAME=轻图 PicBatch
VITE_APP_VERSION=1.0.0
VITE_MAX_FILE_SIZE=52428800
VITE_MAX_FILES=50
```

**验收标准：**
- [x] 环境变量生效

---

#### 8.4 配置自定义域名 [P2]

（可选，如果有域名）

**步骤：**
1. 在 Vercel 添加域名
2. 配置 DNS 记录
3. 等待生效

**验收标准：**
- [x] 域名访问正常
- [x] HTTPS 生效

---

#### 8.5 添加隐私声明页面 [P1]

**创建组件：** `src/components/PrivacyNotice.tsx`

```typescript
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

export function PrivacyNotice() {
  return (
    <Alert className="border-green-500/50 bg-green-500/10">
      <Shield className="h-4 w-4 text-green-600" />
      <AlertDescription>
        <strong>隐私保护：</strong>
        所有图片处理完全在您的浏览器本地完成，不会上传到任何服务器。
      </AlertDescription>
    </Alert>
  );
}
```

**集成到 App：**

```typescript
<div className="text-center">
  <h2 className="text-3xl font-bold">开始处理您的图片</h2>
  <p className="mt-2 text-muted-foreground">
    上传、转换、压缩、下载 - 全在浏览器本地完成
  </p>
  <div className="mt-4">
    <PrivacyNotice />
  </div>
</div>
```

**验收标准：**
- [x] 隐私声明显示

---

#### 8.6 设置 Google Analytics [P2]

（可选）

**安装：**

```bash
npm install @vercel/analytics
```

**集成：**

```typescript
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

**验收标准：**
- [x] 分析工具生效

---

#### 8.7 添加 README [P1]

**创建 `README.md`：**

```markdown
# 轻图 PicBatch

免费、开源的在线图片批量处理工具

## 功能特性

- 🖼️ 格式转换（JPG/PNG/WebP/HEIC）
- 📦 批量处理（最多 50 张）
- 🎨 画质压缩
- 🔒 隐私优先（本地处理）
- 📱 移动端支持

## 技术栈

- React 19
- Vite 7
- TypeScript
- shadcn/ui
- Zustand

## 开发

\`\`\`bash
npm install
npm run dev
\`\`\`

## 构建

\`\`\`bash
npm run build
\`\`\`

## License

MIT
```

**验收标准：**
- [x] README 完整

---

### 阶段 8 验收检查表

- [ ] Vercel 部署成功
- [ ] 生产环境可访问
- [ ] 所有功能正常
- [ ] HTTPS 启用
- [ ] 隐私声明显示
- [ ] README 完整

**预计完成时间：** Day 9

---

## 后续版本规划

### Version 1.1 (MVP + 2 周)

**新增功能：**

- [ ] 批量裁剪（1:1、16:9、4:3、自定义）
- [ ] 批量重命名（前缀 + 序号）
- [ ] 按目标大小压缩优化
- [ ] Google AdSense 接入
- [ ] IndexedDB 缓存处理记录

**预计工时：** 80 小时

---

### Version 1.2 (MVP + 6 周)

**新平台：**

- [ ] 微信小程序（Taro 框架）
- [ ] 响应式优化升级
- [ ] PWA 支持（离线使用）
- [ ] 国际化（中英文切换）

**预计工时：** 120 小时

---

### Version 2.0 (MVP + 3 个月)

**高级功能：**

- [ ] AI 智能裁剪（人脸识别）
- [ ] 批量水印添加
- [ ] 图片美化滤镜
- [ ] API 服务（付费）

**预计工时：** 200 小时

---

## 风险控制

### 技术风险

| 风险 | 概率 | 影响 | 对策 | 负责人 |
|------|------|------|------|--------|
| HEIC 兼容性问题 | 中 | 中 | 使用 heic2any，提供降级方案 | 待定 |
| 50 张图片处理卡顿 | 中 | 高 | Web Worker + 分批处理 | 待定 |
| 微信浏览器兼容性 | 低 | 高 | 充分测试，降级方案 | 待定 |
| 首屏加载超 3MB | 中 | 中 | 代码分割，懒加载 | 待定 |

### 进度风险

| 风险 | 应对措施 |
|------|----------|
| 开发延期 | 砍掉 P2 优先级功能 |
| 测试不充分 | 延长测试阶段 1-2 天 |
| 部署问题 | 预留 1 天缓冲时间 |

---

## 项目检查清单（最终上线前）

### 功能检查

- [ ] 可以上传图片（拖拽和点击）
- [ ] 可以删除单个或全部文件
- [ ] JPG/PNG/WebP 格式互转
- [ ] HEIC 转 JPG
- [ ] 质量压缩（滑块）
- [ ] 按大小压缩
- [ ] 批量处理
- [ ] 进度显示
- [ ] 批量下载 ZIP

### 性能检查

- [ ] 打包体积 <3MB
- [ ] 单张图片处理 ≤2秒
- [ ] 50 张批量处理 ≤2分钟
- [ ] Lighthouse 分数 >90
- [ ] 移动端流畅

### 兼容性检查

- [ ] Chrome 正常
- [ ] Edge 正常
- [ ] Safari 正常
- [ ] 微信浏览器正常
- [ ] iOS 正常
- [ ] Android 正常

### 用户体验检查

- [ ] 操作流程清晰
- [ ] 错误提示友好
- [ ] 隐私声明显示
- [ ] 加载状态流畅
- [ ] 响应式布局合理

### 代码质量检查

- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 警告
- [ ] 代码格式化统一
- [ ] 关键逻辑有注释
- [ ] Git 提交规范

### 文档检查

- [ ] README 完整
- [ ] 用户使用指南
- [ ] 技术文档更新
- [ ] 隐私政策

---

## 总结

### 开发周期

- **MVP 1.0：** 8-10 工作日
- **Version 1.1：** +2 周
- **Version 1.2：** +4 周
- **Version 2.0：** +3 个月

### 资源需求

- **前端开发：** 1 人
- **UI/UX 设计：** 0.5 人（兼职）
- **测试：** 0.5 人（兼职）

### 成功标准

- [x] 按时交付 MVP 1.0
- [x] 核心功能稳定运行
- [x] 用户任务时长 ≤2 分钟
- [x] 首周 DAU ≥100
- [x] 用户反馈积极

---

**文档创建日期：** 2025-10-06
**下次更新日期：** 开发完成后

**负责人：** 待分配
**审核人：** 待定
