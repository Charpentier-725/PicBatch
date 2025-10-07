import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ProcessedFile, OutputFormat } from '@/types';
import { getOutputFilename } from './imageUtils';

export async function createAndDownloadZip(
  files: ProcessedFile[],
  outputFormat: OutputFormat,
  onProgress?: (percent: number) => void
): Promise<void> {
  const zip = new JSZip();
  const nameCounter = new Map<string, number>();

  // 添加文件到 ZIP
  files.forEach((file) => {
    if (!file.processedBlob) return;

    // 使用处理后的文件名，如果没有则生成默认文件名
    let filename = file.processedFilename || getOutputFilename(file.name, outputFormat);

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
