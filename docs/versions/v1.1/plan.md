# PicBatch Version 1.1 开发计划

> 基于 MVP 1.0，新增批量裁剪、批量重命名、智能压缩等功能

**计划开始日期：** 2025-10-07
**预计完成日期：** 2025-11-04（4 周）
**预计工时：** 80 小时

---

## 📋 功能列表

### 1. 批量裁剪 ⭐⭐⭐

**优先级：** P0（最高）

**功能描述：**
- 支持常用裁剪比例（1:1、16:9、4:3、3:2）
- 支持自定义比例
- 支持裁剪位置选择（居中、左上、右上、左下、右下）
- 支持智能裁剪（基于图片内容自动选择最佳区域）

**技术方案：**

```typescript
// 新增类型定义
export type CropRatio = '1:1' | '16:9' | '4:3' | '3:2' | 'custom' | 'none';
export type CropPosition = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface CropOptions {
  ratio: CropRatio;
  customWidth?: number;  // 自定义比例宽度
  customHeight?: number; // 自定义比例高度
  position: CropPosition;
}

// 裁剪函数
export async function cropImage(
  file: File,
  options: CropOptions
): Promise<File> {
  const img = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  // 计算裁剪区域
  const { width, height, x, y } = calculateCropArea(
    img.width,
    img.height,
    options
  );

  canvas.width = width;
  canvas.height = height;

  // 绘制裁剪后的图片
  ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

  // 转为 Blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Crop failed'));
    });
  });

  return new File([blob], file.name, { type: file.type });
}

// 计算裁剪区域
function calculateCropArea(
  imgWidth: number,
  imgHeight: number,
  options: CropOptions
): { width: number; height: number; x: number; y: number } {
  let targetRatio: number;

  // 计算目标比例
  switch (options.ratio) {
    case '1:1':
      targetRatio = 1;
      break;
    case '16:9':
      targetRatio = 16 / 9;
      break;
    case '4:3':
      targetRatio = 4 / 3;
      break;
    case '3:2':
      targetRatio = 3 / 2;
      break;
    case 'custom':
      targetRatio = (options.customWidth || 1) / (options.customHeight || 1);
      break;
    default:
      return { width: imgWidth, height: imgHeight, x: 0, y: 0 };
  }

  const imgRatio = imgWidth / imgHeight;
  let width: number, height: number, x: number, y: number;

  if (imgRatio > targetRatio) {
    // 图片更宽，以高度为准
    height = imgHeight;
    width = height * targetRatio;
  } else {
    // 图片更高，以宽度为准
    width = imgWidth;
    height = width / targetRatio;
  }

  // 计算起始位置
  switch (options.position) {
    case 'center':
      x = (imgWidth - width) / 2;
      y = (imgHeight - height) / 2;
      break;
    case 'top-left':
      x = 0;
      y = 0;
      break;
    case 'top-right':
      x = imgWidth - width;
      y = 0;
      break;
    case 'bottom-left':
      x = 0;
      y = imgHeight - height;
      break;
    case 'bottom-right':
      x = imgWidth - width;
      y = imgHeight - height;
      break;
    default:
      x = (imgWidth - width) / 2;
      y = (imgHeight - height) / 2;
  }

  return { width, height, x, y };
}
```

**UI 设计：**
- 在 ToolPanel 添加裁剪选项卡
- 比例选择器（Radio Group）
- 自定义比例输入框（仅在选择 custom 时显示）
- 位置选择器（9 宫格按钮）
- 裁剪预览（可选）

**预计工时：** 20 小时

---

### 2. 批量重命名 ⭐⭐⭐

**优先级：** P0（最高）

**功能描述：**
- 支持添加前缀
- 支持添加后缀
- 支持序号格式（001、01、1）
- 支持起始序号设置
- 支持原文件名保留/替换

**技术方案：**

```typescript
// 新增类型定义
export interface RenameOptions {
  enabled: boolean;
  prefix: string;          // 前缀
  suffix: string;          // 后缀
  keepOriginalName: boolean; // 是否保留原文件名
  useSequence: boolean;    // 是否使用序号
  sequenceStart: number;   // 起始序号（默认 1）
  sequenceDigits: number;  // 序号位数（1/2/3）
}

// 重命名函数
export function generateNewFilename(
  originalName: string,
  index: number,
  options: RenameOptions,
  extension: string
): string {
  if (!options.enabled) {
    return originalName;
  }

  const basename = originalName.replace(/\.[^/.]+$/, '');
  let parts: string[] = [];

  // 添加前缀
  if (options.prefix) {
    parts.push(options.prefix);
  }

  // 保留原文件名或使用序号
  if (options.keepOriginalName) {
    parts.push(basename);
  }

  // 添加序号
  if (options.useSequence) {
    const seqNumber = options.sequenceStart + index;
    const seqString = seqNumber.toString().padStart(options.sequenceDigits, '0');
    parts.push(seqString);
  }

  // 添加后缀
  if (options.suffix) {
    parts.push(options.suffix);
  }

  // 如果没有任何内容，使用默认名称
  if (parts.length === 0) {
    parts.push(`image_${index + 1}`);
  }

  return `${parts.join('_')}.${extension}`;
}

// 示例：
// prefix: "product", keepOriginalName: false, useSequence: true,
// sequenceStart: 1, sequenceDigits: 3, suffix: "compressed"
// 结果: product_001_compressed.jpg, product_002_compressed.jpg, ...
```

**UI 设计：**
- 在 ToolPanel 添加重命名选项卡
- 前缀输入框
- 后缀输入框
- 保留原文件名开关
- 序号开关
- 起始序号输入框
- 序号位数选择器（1/2/3位）
- 实时预览示例文件名

**预计工时：** 15 小时

---

### 3. 智能压缩优化 ⭐⭐

**优先级：** P1

**功能描述：**
- 根据图片内容自动选择最佳压缩参数
- 对不同类型图片使用不同策略
  - 照片类：更高的 JPG 压缩率
  - 图标类：优先使用 PNG
  - 透明图：自动保留 Alpha 通道
- 多次迭代逼近目标大小

**技术方案：**

```typescript
// 智能压缩函数
export async function smartCompress(
  file: File,
  targetSizeKB?: number
): Promise<File> {
  // 分析图片类型
  const imageType = await analyzeImageType(file);

  // 根据类型选择策略
  let quality: number;
  let outputFormat: string;

  switch (imageType) {
    case 'photo':
      quality = 0.85;
      outputFormat = 'image/jpeg';
      break;
    case 'icon':
      quality = 1.0;
      outputFormat = 'image/png';
      break;
    case 'transparent':
      quality = 0.9;
      outputFormat = 'image/png';
      break;
    default:
      quality = 0.8;
      outputFormat = file.type;
  }

  // 如果指定了目标大小，迭代压缩
  if (targetSizeKB) {
    return await iterativeCompress(file, targetSizeKB, outputFormat);
  }

  // 否则使用推荐质量
  return await compressWithQuality(file, quality, outputFormat);
}

// 分析图片类型
async function analyzeImageType(file: File): Promise<'photo' | 'icon' | 'transparent' | 'other'> {
  const img = await createImageBitmap(file);

  // 检查是否有透明通道
  const hasAlpha = await checkAlpha(img);
  if (hasAlpha) {
    return 'transparent';
  }

  // 小尺寸判断为图标
  if (img.width <= 512 && img.height <= 512) {
    return 'icon';
  }

  // 大尺寸判断为照片
  if (img.width >= 1024 || img.height >= 1024) {
    return 'photo';
  }

  return 'other';
}

// 迭代压缩逼近目标大小
async function iterativeCompress(
  file: File,
  targetSizeKB: number,
  format: string
): Promise<File> {
  let low = 0.1;
  let high = 1.0;
  let quality = 0.8;
  let result = file;
  const maxIterations = 5;

  for (let i = 0; i < maxIterations; i++) {
    const compressed = await compressWithQuality(file, quality, format);
    const sizeKB = compressed.size / 1024;

    // 允许 5% 的误差
    if (Math.abs(sizeKB - targetSizeKB) / targetSizeKB < 0.05) {
      return compressed;
    }

    result = compressed;

    if (sizeKB > targetSizeKB) {
      high = quality;
      quality = (low + quality) / 2;
    } else {
      low = quality;
      quality = (quality + high) / 2;
    }
  }

  return result;
}

// 检查是否有透明通道
async function checkAlpha(img: ImageBitmap): Promise<boolean> {
  const canvas = document.createElement('canvas');
  canvas.width = Math.min(img.width, 100);
  canvas.height = Math.min(img.height, 100);
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // 检查是否有非 255 的 alpha 值
  for (let i = 3; i < imageData.data.length; i += 4) {
    if (imageData.data[i] < 255) {
      return true;
    }
  }

  return false;
}
```

**UI 设计：**
- 添加"智能压缩"开关
- 启用时自动分析图片类型并推荐参数
- 显示推荐的格式和质量

**预计工时：** 15 小时

---

### 4. IndexedDB 缓存处理记录 ⭐

**优先级：** P2

**功能描述：**
- 保存最近的处理记录
- 快速恢复上次的处理参数
- 处理历史查看
- 一键重复上次操作

**技术方案：**

```typescript
// IndexedDB 数据库名称
const DB_NAME = 'picbatch';
const DB_VERSION = 1;
const STORE_NAME = 'processing_history';

// 处理记录接口
export interface ProcessingRecord {
  id: string;
  timestamp: number;
  fileCount: number;
  outputFormat: OutputFormat;
  compressionMode: 'quality' | 'size';
  quality?: number;
  targetSize?: number;
  cropOptions?: CropOptions;
  renameOptions?: RenameOptions;
}

// IndexedDB 工具类
export class ProcessingHistoryDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveRecord(record: Omit<ProcessingRecord, 'id' | 'timestamp'>): Promise<void> {
    if (!this.db) await this.init();

    const fullRecord: ProcessingRecord = {
      ...record,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(fullRecord);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getRecentRecords(limit: number = 10): Promise<ProcessingRecord[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'prev');

      const records: ProcessingRecord[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor && records.length < limit) {
          records.push(cursor.value);
          cursor.continue();
        } else {
          resolve(records);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getLatestRecord(): Promise<ProcessingRecord | null> {
    const records = await this.getRecentRecords(1);
    return records[0] || null;
  }

  async clearHistory(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// 全局实例
export const historyDB = new ProcessingHistoryDB();
```

**UI 设计：**
- 添加"历史记录"按钮
- 弹出对话框显示最近 10 条记录
- 每条记录显示：时间、文件数、处理参数
- 点击可恢复参数
- "清空历史"按钮

**预计工时：** 20 小时

---

## 🗂️ 文件变更清单

### 新增文件

```
src/
├── lib/
│   ├── crop.ts              # 裁剪功能
│   ├── rename.ts            # 重命名功能
│   ├── smartCompress.ts     # 智能压缩
│   └── historyDB.ts         # IndexedDB 封装
├── components/
│   ├── CropPanel.tsx        # 裁剪面板
│   ├── RenamePanel.tsx      # 重命名面板
│   └── HistoryDialog.tsx    # 历史记录对话框
└── types/
    └── v1.1.ts              # Version 1.1 新增类型
```

### 修改文件

```
src/
├── types/index.ts           # 添加新类型定义
├── store/useStore.ts        # 添加新状态
├── components/
│   ├── ToolPanel.tsx        # 添加新选项卡
│   └── ProcessButton.tsx    # 更新处理逻辑
└── lib/
    └── imageUtils.ts        # 集成裁剪和重命名
```

---

## 📊 开发计划

### Week 1 (Day 1-7)
- [x] 规划技术方案 ✅
- [ ] 实现批量裁剪核心逻辑
- [ ] 创建 CropPanel 组件
- [ ] 集成到主流程
- [ ] 测试裁剪功能

### Week 2 (Day 8-14)
- [ ] 实现批量重命名逻辑
- [ ] 创建 RenamePanel 组件
- [ ] 集成到主流程
- [ ] 测试重命名功能

### Week 3 (Day 15-21)
- [ ] 实现智能压缩算法
- [ ] 图片类型分析
- [ ] 迭代压缩优化
- [ ] 测试压缩效果

### Week 4 (Day 22-28)
- [ ] IndexedDB 封装
- [ ] 历史记录 UI
- [ ] 整体测试
- [ ] 文档更新
- [ ] 部署上线

---

## 🎯 验收标准

### 功能验收
- [ ] 裁剪功能支持所有预设比例
- [ ] 自定义比例正常工作
- [ ] 裁剪位置可选
- [ ] 重命名按规则生成正确文件名
- [ ] 智能压缩能识别图片类型
- [ ] 迭代压缩能逼近目标大小
- [ ] 历史记录正常保存和读取

### 性能验收
- [ ] 裁剪单张图片 ≤1 秒
- [ ] 批量裁剪 50 张 ≤2 分钟
- [ ] IndexedDB 读写 ≤100ms

### 兼容性验收
- [ ] Chrome/Edge 正常
- [ ] 微信浏览器正常
- [ ] 移动端流畅

---

## 📝 风险评估

| 风险 | 概率 | 影响 | 对策 |
|------|------|------|------|
| 裁剪计算复杂 | 中 | 中 | 提前编写测试用例 |
| IndexedDB 兼容性 | 低 | 中 | 提供降级方案（localStorage） |
| 智能压缩算法不稳定 | 中 | 低 | 保留手动模式 |
| 开发时间超期 | 中 | 中 | 可砍掉 P2 功能 |

---

**文档创建日期：** 2025-10-07
**负责人：** Charpentier-725
