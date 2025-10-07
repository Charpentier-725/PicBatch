/**
 * 平台无关的压缩核心算法
 * 可在 Web 和小程序环境中使用
 */

export type ImageType = 'photo' | 'icon' | 'transparent' | 'graphic' | 'other';

export interface CompressionStrategy {
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
  description: string;
}

export interface ImageAnalysisData {
  width: number;
  height: number;
  fileSize: number;
  hasAlpha: boolean;
}

/**
 * 分析图片数据并判断类型
 * @param data 图片基本数据
 * @returns 图片类型
 */
export function analyzeImageData(data: ImageAnalysisData): ImageType {
  const { width, height, fileSize, hasAlpha } = data;

  // 透明图片
  if (hasAlpha) {
    return 'transparent';
  }

  // 小图标
  if (width <= 512 && height <= 512 && fileSize < 100 * 1024) {
    return 'icon';
  }

  const pixelCount = width * height;

  // 照片
  if (pixelCount > 1024 * 768) {
    const bytesPerPixel = fileSize / pixelCount;
    if (bytesPerPixel > 1.5) {
      return 'photo';
    }
  }

  // 图形/插画
  if (pixelCount > 256 * 256 && pixelCount < 1024 * 1024) {
    return 'graphic';
  }

  return 'other';
}

/**
 * 根据图片类型和大小获取压缩策略
 * @param imageType 图片类型
 * @param fileSize 文件大小(字节)
 * @returns 压缩策略
 */
export function getCompressionStrategy(
  imageType: ImageType,
  fileSize: number
): CompressionStrategy {
  const sizeMB = fileSize / (1024 * 1024);

  switch (imageType) {
    case 'photo':
      return {
        format: 'image/jpeg',
        quality: sizeMB > 2 ? 0.75 : 0.85,
        description: '照片 - JPEG 格式，平衡质量与体积',
      };

    case 'icon':
      return {
        format: 'image/png',
        quality: 0.9,
        description: '图标 - PNG 格式，保持清晰边缘',
      };

    case 'transparent':
      return {
        format: 'image/png',
        quality: 0.85,
        description: '透明图 - PNG 格式，保留透明度',
      };

    case 'graphic':
      return {
        format: 'image/webp',
        quality: 0.9,
        description: '图形 - WebP 格式，平面色彩优化',
      };

    default:
      return {
        format: 'image/jpeg',
        quality: 0.8,
        description: '通用 - JPEG 格式',
      };
  }
}

/**
 * 计算迭代压缩的下一个质量值
 * @param currentQuality 当前质量
 * @param currentSize 当前文件大小
 * @param targetSize 目标文件大小
 * @param low 质量下限
 * @param high 质量上限
 * @returns 新的质量值和上下限
 */
export function calculateNextQuality(
  currentQuality: number,
  currentSize: number,
  targetSize: number,
  low: number,
  high: number
): { quality: number; low: number; high: number } {
  if (currentSize > targetSize) {
    // 当前文件太大，降低质量
    return {
      quality: (low + currentQuality) / 2,
      low,
      high: currentQuality,
    };
  } else {
    // 当前文件太小，提高质量
    return {
      quality: (currentQuality + high) / 2,
      low: currentQuality,
      high,
    };
  }
}

/**
 * 检查是否达到目标大小(允许5%误差)
 * @param currentSize 当前文件大小
 * @param targetSize 目标文件大小
 * @param tolerance 容差百分比(默认5%)
 * @returns 是否达到目标
 */
export function isTargetSizeReached(
  currentSize: number,
  targetSize: number,
  tolerance: number = 0.05
): boolean {
  const error = Math.abs(currentSize - targetSize) / targetSize;
  return error < tolerance;
}

/**
 * 迭代压缩配置
 */
export interface IterativeCompressConfig {
  maxIterations: number;
  tolerance: number;
  minQualityDiff: number;
}

export const DEFAULT_COMPRESS_CONFIG: IterativeCompressConfig = {
  maxIterations: 8,
  tolerance: 0.05,
  minQualityDiff: 0.01,
};
