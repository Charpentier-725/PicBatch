import { useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { FileStatus } from '@/types';
import { convertFormat, getOutputFilename } from '@/lib/imageUtils';
import { compressBySize } from '@/lib/compression';
import { cropImage } from '@/lib/crop';
import { generateNewFilename } from '@/lib/rename';
import { historyDB } from '@/lib/historyDB';
import { useToast } from '@/hooks/use-toast';

export function useImageProcessor() {
  const {
    files,
    outputFormat,
    quality,
    compressionMode,
    targetSize,
    cropOptions,
    renameOptions,
    updateFileStatus,
    updateFileResult,
    setProcessing,
    setTotalProgress,
  } = useStore();
  const { toast } = useToast();

  const processFile = useCallback(
    async (fileId: string, index: number) => {
      const file = files.find((f) => f.id === fileId);
      if (!file) return;

      try {
        updateFileStatus(fileId, FileStatus.PROCESSING, 0);

        let currentFile = file.file;

        // 1. 裁剪（如果启用）
        if (cropOptions.enabled) {
          updateFileStatus(fileId, FileStatus.PROCESSING, 15);
          currentFile = await cropImage(currentFile, cropOptions);
        }

        // 2. 格式转换
        updateFileStatus(fileId, FileStatus.PROCESSING, 40);
        let blob = await convertFormat(currentFile, outputFormat, quality);

        // 3. 压缩（如果是大小模式）
        if (compressionMode === 'size' && targetSize) {
          updateFileStatus(fileId, FileStatus.PROCESSING, 70);
          const tempFile = new File([blob], file.name, { type: blob.type });
          blob = await compressBySize(tempFile, targetSize);
        }

        // 4. 生成新文件名
        updateFileStatus(fileId, FileStatus.PROCESSING, 90);
        const extension = getOutputFilename('', outputFormat).split('.').pop() || 'jpg';
        const newFilename = renameOptions.enabled
          ? generateNewFilename(file.name, index, renameOptions, extension)
          : getOutputFilename(file.name, outputFormat);

        // 5. 完成
        updateFileStatus(fileId, FileStatus.PROCESSING, 100);
        updateFileResult(fileId, blob, blob.size, newFilename);
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
    [
      files,
      outputFormat,
      quality,
      compressionMode,
      targetSize,
      cropOptions,
      renameOptions,
      updateFileStatus,
      updateFileResult,
      toast,
    ]
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

    if (total === 0) {
      toast({
        title: '没有待处理的文件',
        description: '所有文件已处理完成',
      });
      setProcessing(false);
      return;
    }

    const startTime = Date.now();

    for (let i = 0; i < total; i++) {
      await processFile(pendingFiles[i].id, i);
      setTotalProgress(Math.round(((i + 1) / total) * 100));
    }

    const processingTime = Date.now() - startTime;

    // 保存处理历史记录
    try {
      const successFiles = files.filter((f) => f.status === FileStatus.SUCCESS);
      const totalSize = successFiles.reduce((sum, f) => sum + f.originalSize, 0);
      const compressedSize = successFiles.reduce((sum, f) => sum + (f.compressedSize || 0), 0);

      await historyDB.saveRecord({
        fileCount: total,
        outputFormat,
        compressionMode,
        quality: compressionMode === 'quality' ? quality : undefined,
        targetSize: compressionMode === 'size' ? targetSize : undefined,
        cropOptions,
        renameOptions,
        totalSize,
        compressedSize,
        compressionRatio: Math.round((1 - compressedSize / totalSize) * 100),
        processingTime,
      });
    } catch (error) {
      console.error('Failed to save history:', error);
    }

    setProcessing(false);
    toast({
      title: '处理完成',
      description: `成功处理 ${total} 个文件`,
    });
  }, [
    files,
    processFile,
    setProcessing,
    setTotalProgress,
    outputFormat,
    compressionMode,
    quality,
    targetSize,
    cropOptions,
    renameOptions,
    toast,
  ]);

  return {
    processAllFiles,
    processFile,
  };
}
