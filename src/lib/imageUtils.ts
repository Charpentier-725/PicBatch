import { OutputFormat } from '@/types';

/**
 * 将 SVG 转换为栅格图片（PNG）
 */
export async function convertSVG(file: File): Promise<File> {
  const img = new Image();
  const url = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1024;
      canvas.height = img.naturalHeight || 1024;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            resolve(
              new File([blob], file.name.replace(/\.svg$/i, '.png'), {
                type: 'image/png',
              })
            );
          } else {
            reject(new Error('SVG conversion failed'));
          }
        },
        'image/png'
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG'));
    };

    img.src = url;
  });
}

/**
 * 将 GIF 转换为静态图片（提取第一帧）
 */
export async function convertGIF(file: File): Promise<File> {
  const img = new Image();
  const url = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            resolve(
              new File([blob], file.name.replace(/\.gif$/i, '.png'), {
                type: 'image/png',
              })
            );
          } else {
            reject(new Error('GIF conversion failed'));
          }
        },
        'image/png'
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load GIF'));
    };

    img.src = url;
  });
}

/**
 * 将图片转换为指定格式
 */
export async function convertFormat(
  file: File,
  outputFormat: OutputFormat,
  quality: number = 90
): Promise<Blob> {
  // 如果是 SVG，先转换为 PNG
  let sourceFile = file;
  if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
    sourceFile = await convertSVG(file);
  }

  // 如果是 GIF，先提取第一帧
  if (file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif')) {
    sourceFile = await convertGIF(file);
  }

  // 如果是 HEIC，先转换为 JPEG
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

  // 转换为目标格式（将大小写格式统一为小写 MIME 类型）
  const formatLower = outputFormat.toLowerCase();
  const mimeType = `image/${formatLower === 'jpeg' ? 'jpeg' : formatLower}`;
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
 * 获取输出文件名（支持大小写扩展名）
 */
export function getOutputFilename(
  originalName: string,
  outputFormat: OutputFormat
): string {
  const basename = originalName.replace(/\.[^/.]+$/, '');

  // 扩展名映射表 - 保持用户选择的大小写
  const extensionMap: Record<OutputFormat, string> = {
    jpeg: 'jpg', // 小写
    JPEG: 'JPG', // 大写
    png: 'png',
    PNG: 'PNG',
    webp: 'webp',
    WEBP: 'WEBP',
    gif: 'gif',
    GIF: 'GIF',
  };

  const ext = extensionMap[outputFormat];
  return `${basename}.${ext}`;
}
