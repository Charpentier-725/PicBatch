import { useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { FileStatus } from '@/types';
import { convertFormat } from '@/lib/imageUtils';
import { compressBySize } from '@/lib/compression';
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
    [
      files,
      outputFormat,
      quality,
      compressionMode,
      targetSize,
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
