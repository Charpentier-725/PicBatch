import type { CropOptions, CropRatio, CropPosition } from '../types';

/**
 * 裁剪图片
 * @param file 原始文件
 * @param options 裁剪选项
 * @returns 裁剪后的文件
 */
export async function cropImage(
  file: File,
  options: CropOptions
): Promise<File> {
  // 如果未启用裁剪，直接返回原文件
  if (!options.enabled || options.ratio === 'none') {
    return file;
  }

  const img = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // 计算裁剪区域
  const cropArea = calculateCropArea(img.width, img.height, options);

  // 设置画布尺寸为裁剪后的尺寸
  canvas.width = cropArea.width;
  canvas.height = cropArea.height;

  // 绘制裁剪后的图片
  ctx.drawImage(
    img,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height
  );

  // 转换为 Blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      file.type || 'image/png',
      0.95
    );
  });

  // 创建新文件
  return new File([blob], file.name, {
    type: file.type || 'image/png',
    lastModified: Date.now(),
  });
}

/**
 * 计算裁剪区域
 * @param imgWidth 图片宽度
 * @param imgHeight 图片高度
 * @param options 裁剪选项
 * @returns 裁剪区域坐标和尺寸
 */
function calculateCropArea(
  imgWidth: number,
  imgHeight: number,
  options: CropOptions
): { x: number; y: number; width: number; height: number } {
  // 计算目标比例
  const targetRatio = calculateTargetRatio(options);

  if (targetRatio === null) {
    // 不裁剪，返回原尺寸
    return { x: 0, y: 0, width: imgWidth, height: imgHeight };
  }

  const imgRatio = imgWidth / imgHeight;
  let cropWidth: number;
  let cropHeight: number;

  if (imgRatio > targetRatio) {
    // 图片更宽，以高度为准裁剪
    cropHeight = imgHeight;
    cropWidth = Math.round(cropHeight * targetRatio);
  } else {
    // 图片更高或比例相同，以宽度为准裁剪
    cropWidth = imgWidth;
    cropHeight = Math.round(cropWidth / targetRatio);
  }

  // 确保裁剪尺寸不超过原图尺寸
  cropWidth = Math.min(cropWidth, imgWidth);
  cropHeight = Math.min(cropHeight, imgHeight);

  // 根据位置计算起始坐标
  const { x, y } = calculateCropPosition(
    imgWidth,
    imgHeight,
    cropWidth,
    cropHeight,
    options.position
  );

  return { x, y, width: cropWidth, height: cropHeight };
}

/**
 * 计算目标宽高比
 */
function calculateTargetRatio(options: CropOptions): number | null {
  switch (options.ratio) {
    case '1:1':
      return 1;
    case '16:9':
      return 16 / 9;
    case '4:3':
      return 4 / 3;
    case '3:2':
      return 3 / 2;
    case 'custom':
      if (options.customWidth && options.customHeight) {
        return options.customWidth / options.customHeight;
      }
      return null;
    case 'none':
    default:
      return null;
  }
}

/**
 * 计算裁剪起始位置
 */
function calculateCropPosition(
  imgWidth: number,
  imgHeight: number,
  cropWidth: number,
  cropHeight: number,
  position: CropPosition
): { x: number; y: number } {
  let x: number;
  let y: number;

  switch (position) {
    case 'top-left':
      x = 0;
      y = 0;
      break;
    case 'top-right':
      x = imgWidth - cropWidth;
      y = 0;
      break;
    case 'bottom-left':
      x = 0;
      y = imgHeight - cropHeight;
      break;
    case 'bottom-right':
      x = imgWidth - cropWidth;
      y = imgHeight - cropHeight;
      break;
    case 'center':
    default:
      x = Math.round((imgWidth - cropWidth) / 2);
      y = Math.round((imgHeight - cropHeight) / 2);
      break;
  }

  // 确保坐标不为负数
  x = Math.max(0, x);
  y = Math.max(0, y);

  return { x, y };
}

/**
 * 获取裁剪比例的显示名称
 */
export function getCropRatioLabel(ratio: CropRatio): string {
  switch (ratio) {
    case '1:1':
      return '1:1 (正方形)';
    case '16:9':
      return '16:9 (宽屏)';
    case '4:3':
      return '4:3 (标准)';
    case '3:2':
      return '3:2 (照片)';
    case 'custom':
      return '自定义';
    case 'none':
    default:
      return '不裁剪';
  }
}

/**
 * 获取裁剪位置的显示名称
 */
export function getCropPositionLabel(position: CropPosition): string {
  switch (position) {
    case 'center':
      return '居中';
    case 'top-left':
      return '左上';
    case 'top-right':
      return '右上';
    case 'bottom-left':
      return '左下';
    case 'bottom-right':
      return '右下';
    default:
      return '居中';
  }
}
