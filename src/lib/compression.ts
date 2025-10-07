import imageCompression from 'browser-image-compression';

/**
 * 按质量压缩图片
 */
export async function compressByQuality(
  file: File,
  quality: number
): Promise<Blob> {
  const options = {
    maxWidthOrHeight: 4096,
    useWebWorker: true,
    initialQuality: quality / 100,
    alwaysKeepResolution: true,
  };

  return await imageCompression(file, options);
}

/**
 * 按目标大小压缩图片
 */
export async function compressBySize(
  file: File,
  targetSizeKB: number
): Promise<Blob> {
  const options = {
    maxSizeMB: targetSizeKB / 1024,
    maxWidthOrHeight: 4096,
    useWebWorker: true,
    initialQuality: 0.8,
    alwaysKeepResolution: false,
  };

  return await imageCompression(file, options);
}
