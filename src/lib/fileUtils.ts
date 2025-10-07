const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/svg+xml', // SVG 矢量图
  'image/gif',     // GIF 动画
];

export function validateFile(file: File): { valid: boolean; error?: string } {
  const extension = file.name.toLowerCase().split('.').pop();
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'svg', 'gif'];

  if (!ALLOWED_TYPES.includes(file.type) && !validExtensions.includes(extension || '')) {
    return { valid: false, error: '不支持的文件格式' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: '文件大小超过 50MB' };
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}
