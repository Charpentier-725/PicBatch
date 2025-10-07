/**
 * 智能压缩模块
 * 根据图片特征自动选择最佳压缩策略
 */

type ImageType = 'photo' | 'icon' | 'transparent' | 'graphic' | 'other';

interface SmartCompressOptions {
  targetSizeKB?: number;
  maxQuality?: number;
  minQuality?: number;
}

interface CompressResult {
  blob: Blob;
  quality: number;
  format: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

/**
 * 智能压缩主函数
 * @param file 原始文件
 * @param options 压缩选项
 * @returns 压缩结果
 */
export async function smartCompress(
  file: File,
  options: SmartCompressOptions = {}
): Promise<CompressResult> {
  const { targetSizeKB, maxQuality = 0.95, minQuality = 0.1 } = options;

  // 1. 分析图片类型
  const imageType = await analyzeImageType(file);

  // 2. 根据类型选择策略
  const strategy = getCompressionStrategy(imageType, file.size);

  // 3. 执行压缩
  let result: CompressResult;

  if (targetSizeKB) {
    // 目标大小模式：迭代压缩
    result = await iterativeCompress(file, targetSizeKB, strategy, {
      maxQuality,
      minQuality,
    });
  } else {
    // 智能模式：使用推荐质量
    result = await compressWithStrategy(file, strategy);
  }

  return result;
}

/**
 * 分析图片类型
 */
async function analyzeImageType(file: File): Promise<ImageType> {
  const img = await createImageBitmap(file);
  const width = img.width;
  const height = img.height;
  const pixelCount = width * height;

  // 检查是否有透明通道
  const hasAlpha = await checkAlphaChannel(img);
  if (hasAlpha) {
    return 'transparent';
  }

  // 小尺寸 + 小文件 = 图标
  if (width <= 512 && height <= 512 && file.size < 100 * 1024) {
    return 'icon';
  }

  // 大尺寸 + 高像素密度 = 照片
  if (pixelCount > 1024 * 768) {
    // 检查是否是照片（通过文件大小/像素比判断）
    const bytesPerPixel = file.size / pixelCount;
    if (bytesPerPixel > 1.5) {
      return 'photo';
    }
  }

  // 中等尺寸，颜色丰富 = 图形
  if (pixelCount > 256 * 256 && pixelCount < 1024 * 1024) {
    return 'graphic';
  }

  return 'other';
}

/**
 * 检查是否有透明通道
 */
async function checkAlphaChannel(img: ImageBitmap): Promise<boolean> {
  const canvas = document.createElement('canvas');
  const sampleSize = Math.min(100, img.width, img.height);
  canvas.width = sampleSize;
  canvas.height = sampleSize;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return false;

  ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
  const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);

  // 检查是否有非255的alpha值
  for (let i = 3; i < imageData.data.length; i += 4) {
    if (imageData.data[i] < 255) {
      return true;
    }
  }

  return false;
}

/**
 * 获取压缩策略
 */
interface CompressionStrategy {
  recommendedQuality: number;
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  description: string;
}

function getCompressionStrategy(
  imageType: ImageType,
  fileSize: number
): CompressionStrategy {
  switch (imageType) {
    case 'photo':
      return {
        recommendedQuality: 0.85,
        format: 'image/jpeg',
        description: '照片类图片，使用JPEG高质量压缩',
      };

    case 'icon':
      return {
        recommendedQuality: 1.0,
        format: 'image/png',
        description: '图标类图片，保持PNG无损',
      };

    case 'transparent':
      return {
        recommendedQuality: 0.9,
        format: 'image/png',
        description: '透明图片，使用PNG保留透明度',
      };

    case 'graphic':
      return {
        recommendedQuality: 0.8,
        format: 'image/webp',
        description: '图形类图片，使用WebP平衡压缩',
      };

    default:
      // 根据文件大小决定
      if (fileSize > 1024 * 1024) {
        return {
          recommendedQuality: 0.75,
          format: 'image/jpeg',
          description: '大文件，使用JPEG中等压缩',
        };
      } else {
        return {
          recommendedQuality: 0.85,
          format: 'image/webp',
          description: '普通图片，使用WebP压缩',
        };
      }
  }
}

/**
 * 使用策略压缩
 */
async function compressWithStrategy(
  file: File,
  strategy: CompressionStrategy
): Promise<CompressResult> {
  const img = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(img, 0, 0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Compression failed'));
        }
      },
      strategy.format,
      strategy.recommendedQuality
    );
  });

  return {
    blob,
    quality: strategy.recommendedQuality,
    format: strategy.format,
    originalSize: file.size,
    compressedSize: blob.size,
    compressionRatio: Math.round((1 - blob.size / file.size) * 100),
  };
}

/**
 * 迭代压缩逼近目标大小
 */
async function iterativeCompress(
  file: File,
  targetSizeKB: number,
  strategy: CompressionStrategy,
  qualityRange: { maxQuality: number; minQuality: number }
): Promise<CompressResult> {
  const targetBytes = targetSizeKB * 1024;
  const { maxQuality, minQuality } = qualityRange;

  let low = minQuality;
  let high = maxQuality;
  let bestResult: CompressResult | null = null;
  const maxIterations = 8;
  const tolerance = 0.05; // 5% 误差范围

  for (let i = 0; i < maxIterations; i++) {
    const quality = (low + high) / 2;

    // 压缩
    const result = await compressWithQuality(file, quality, strategy.format);

    // 保存最接近的结果
    if (
      !bestResult ||
      Math.abs(result.compressedSize - targetBytes) <
        Math.abs(bestResult.compressedSize - targetBytes)
    ) {
      bestResult = result;
    }

    // 检查是否在误差范围内
    const error = Math.abs(result.compressedSize - targetBytes) / targetBytes;
    if (error < tolerance) {
      return result;
    }

    // 调整范围
    if (result.compressedSize > targetBytes) {
      high = quality;
    } else {
      low = quality;
    }

    // 如果范围太小，提前结束
    if (high - low < 0.01) {
      break;
    }
  }

  return bestResult || (await compressWithQuality(file, 0.8, strategy.format));
}

/**
 * 使用指定质量压缩
 */
async function compressWithQuality(
  file: File,
  quality: number,
  format: string
): Promise<CompressResult> {
  const img = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(img, 0, 0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Compression failed'));
        }
      },
      format,
      quality
    );
  });

  return {
    blob,
    quality,
    format,
    originalSize: file.size,
    compressedSize: blob.size,
    compressionRatio: Math.round((1 - blob.size / file.size) * 100),
  };
}

/**
 * 获取图片类型的友好名称
 */
export function getImageTypeLabel(type: ImageType): string {
  switch (type) {
    case 'photo':
      return '照片';
    case 'icon':
      return '图标';
    case 'transparent':
      return '透明图';
    case 'graphic':
      return '图形';
    default:
      return '普通图片';
  }
}
