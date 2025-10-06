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
