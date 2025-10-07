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
  processedFilename?: string; // Version 1.1: 处理后的文件名
  error?: string;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
  processingTime?: number;
}

export type OutputFormat =
  | 'jpeg'   // 输出 .jpg (小写)
  | 'JPEG'   // 输出 .JPG (大写)
  | 'png'    // 输出 .png (小写)
  | 'PNG'    // 输出 .PNG (大写)
  | 'webp'   // 输出 .webp (小写)
  | 'WEBP'   // 输出 .WEBP (大写)
  | 'gif'    // 输出 .gif (小写)
  | 'GIF';   // 输出 .GIF (大写)

export type CompressionMode = 'quality' | 'size';

// Version 1.1: 裁剪相关类型
export type CropRatio = '1:1' | '16:9' | '4:3' | '3:2' | 'custom' | 'none';
export type CropPosition = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface CropOptions {
  enabled: boolean;
  ratio: CropRatio;
  customWidth?: number;
  customHeight?: number;
  position: CropPosition;
}

// Version 1.1: 重命名相关类型
export interface RenameOptions {
  enabled: boolean;
  prefix: string;
  suffix: string;
  keepOriginalName: boolean;
  useSequence: boolean;
  sequenceStart: number;
  sequenceDigits: 1 | 2 | 3;
}

export interface ConversionOptions {
  outputFormat: OutputFormat;
  quality: number;
  compressionMode: CompressionMode;
  targetSize?: number;
  maxWidthOrHeight?: number;
  // Version 1.1: 新增选项
  cropOptions?: CropOptions;
  renameOptions?: RenameOptions;
}
