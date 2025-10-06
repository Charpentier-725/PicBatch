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
