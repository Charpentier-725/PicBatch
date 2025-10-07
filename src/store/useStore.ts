import { create } from 'zustand';
import {
  ProcessedFile,
  FileStatus,
  OutputFormat,
  CompressionMode,
  CropOptions,
  RenameOptions,
  CropRatio,
  CropPosition,
} from '@/types';

interface AppState {
  // 文件相关
  files: ProcessedFile[];
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateFileStatus: (id: string, status: FileStatus, progress?: number) => void;
  updateFileResult: (id: string, blob: Blob, size: number, filename?: string) => void;

  // 设置相关
  outputFormat: OutputFormat;
  quality: number;
  compressionMode: CompressionMode;
  targetSize?: number;
  setOutputFormat: (format: OutputFormat) => void;
  setQuality: (quality: number) => void;
  setCompressionMode: (mode: CompressionMode) => void;
  setTargetSize: (size?: number) => void;

  // Version 1.1: 裁剪相关
  cropOptions: CropOptions;
  setCropEnabled: (enabled: boolean) => void;
  setCropRatio: (ratio: CropRatio) => void;
  setCropCustomSize: (width: number, height: number) => void;
  setCropPosition: (position: CropPosition) => void;

  // Version 1.1: 重命名相关
  renameOptions: RenameOptions;
  setRenameEnabled: (enabled: boolean) => void;
  setRenamePrefix: (prefix: string) => void;
  setRenameSuffix: (suffix: string) => void;
  setRenameKeepOriginalName: (keep: boolean) => void;
  setRenameUseSequence: (use: boolean) => void;
  setRenameSequenceStart: (start: number) => void;
  setRenameSequenceDigits: (digits: 1 | 2 | 3) => void;

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

  // Version 1.1: 裁剪初始状态
  cropOptions: {
    enabled: false,
    ratio: 'none',
    customWidth: 16,
    customHeight: 9,
    position: 'center',
  },

  // Version 1.1: 重命名初始状态
  renameOptions: {
    enabled: false,
    prefix: '',
    suffix: '',
    keepOriginalName: true,
    useSequence: false,
    sequenceStart: 1,
    sequenceDigits: 3,
  },

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

  updateFileResult: (id, blob, size, filename) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id
          ? {
              ...f,
              processedBlob: blob,
              processedFilename: filename,
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

  // Version 1.1: 裁剪 Actions
  setCropEnabled: (enabled) =>
    set((state) => ({
      cropOptions: { ...state.cropOptions, enabled },
    })),
  setCropRatio: (ratio) =>
    set((state) => ({
      cropOptions: { ...state.cropOptions, ratio },
    })),
  setCropCustomSize: (width, height) =>
    set((state) => ({
      cropOptions: { ...state.cropOptions, customWidth: width, customHeight: height },
    })),
  setCropPosition: (position) =>
    set((state) => ({
      cropOptions: { ...state.cropOptions, position },
    })),

  // Version 1.1: 重命名 Actions
  setRenameEnabled: (enabled) =>
    set((state) => ({
      renameOptions: { ...state.renameOptions, enabled },
    })),
  setRenamePrefix: (prefix) =>
    set((state) => ({
      renameOptions: { ...state.renameOptions, prefix },
    })),
  setRenameSuffix: (suffix) =>
    set((state) => ({
      renameOptions: { ...state.renameOptions, suffix },
    })),
  setRenameKeepOriginalName: (keep) =>
    set((state) => ({
      renameOptions: { ...state.renameOptions, keepOriginalName: keep },
    })),
  setRenameUseSequence: (use) =>
    set((state) => ({
      renameOptions: { ...state.renameOptions, useSequence: use },
    })),
  setRenameSequenceStart: (start) =>
    set((state) => ({
      renameOptions: { ...state.renameOptions, sequenceStart: start },
    })),
  setRenameSequenceDigits: (digits) =>
    set((state) => ({
      renameOptions: { ...state.renameOptions, sequenceDigits: digits },
    })),
}));
