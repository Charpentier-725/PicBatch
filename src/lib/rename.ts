import type { RenameOptions } from '../types';

/**
 * 生成新文件名
 * @param originalName 原始文件名
 * @param index 文件索引（从 0 开始）
 * @param options 重命名选项
 * @param extension 文件扩展名（不含点）
 * @returns 新文件名
 */
export function generateNewFilename(
  originalName: string,
  index: number,
  options: RenameOptions,
  extension: string
): string {
  // 如果未启用重命名，返回原文件名（仅替换扩展名）
  if (!options.enabled) {
    const basename = originalName.replace(/\.[^/.]+$/, '');
    return `${basename}.${extension}`;
  }

  const parts: string[] = [];

  // 1. 添加前缀
  if (options.prefix.trim()) {
    parts.push(options.prefix.trim());
  }

  // 2. 保留原文件名（去除扩展名）
  if (options.keepOriginalName) {
    const basename = originalName.replace(/\.[^/.]+$/, '');
    if (basename) {
      parts.push(basename);
    }
  }

  // 3. 添加序号
  if (options.useSequence) {
    const seqNumber = options.sequenceStart + index;
    const seqString = padNumber(seqNumber, options.sequenceDigits);
    parts.push(seqString);
  }

  // 4. 添加后缀
  if (options.suffix.trim()) {
    parts.push(options.suffix.trim());
  }

  // 如果所有部分都为空，使用默认名称
  if (parts.length === 0) {
    const seqNumber = index + 1;
    const seqString = padNumber(seqNumber, 3);
    parts.push(`image_${seqString}`);
  }

  // 用下划线连接所有部分
  const basename = parts.join('_');

  return `${basename}.${extension}`;
}

/**
 * 填充数字前导零
 * @param num 数字
 * @param digits 位数
 * @returns 填充后的字符串
 */
function padNumber(num: number, digits: number): string {
  return num.toString().padStart(digits, '0');
}

/**
 * 预览文件名示例
 * @param options 重命名选项
 * @param extension 扩展名
 * @param count 示例数量
 * @returns 文件名示例数组
 */
export function previewFilenames(
  options: RenameOptions,
  extension: string = 'jpg',
  count: number = 3
): string[] {
  const examples: string[] = [];

  for (let i = 0; i < count; i++) {
    const originalName = `IMG_${1000 + i}.jpg`; // 模拟原文件名
    const newName = generateNewFilename(originalName, i, options, extension);
    examples.push(newName);
  }

  return examples;
}

/**
 * 验证重命名选项
 * @param options 重命名选项
 * @returns 验证结果
 */
export function validateRenameOptions(options: RenameOptions): {
  valid: boolean;
  error?: string;
} {
  if (!options.enabled) {
    return { valid: true };
  }

  // 检查是否至少有一个命名元素
  const hasContent =
    options.prefix.trim() ||
    options.keepOriginalName ||
    options.useSequence ||
    options.suffix.trim();

  if (!hasContent) {
    return {
      valid: false,
      error: '请至少选择一种命名方式（前缀、原名、序号或后缀）',
    };
  }

  // 检查序号起始值
  if (options.useSequence && options.sequenceStart < 0) {
    return {
      valid: false,
      error: '起始序号不能为负数',
    };
  }

  // 检查文件名长度（Windows 文件名限制为 255 字符）
  const testName = generateNewFilename('test.jpg', 0, options, 'jpg');
  if (testName.length > 255) {
    return {
      valid: false,
      error: '文件名过长（超过 255 字符）',
    };
  }

  // 检查非法字符（Windows 文件名不允许的字符）
  const invalidChars = /[<>:"/\\|?*]/;
  if (
    invalidChars.test(options.prefix) ||
    invalidChars.test(options.suffix)
  ) {
    return {
      valid: false,
      error: '文件名不能包含以下字符：< > : " / \\ | ? *',
    };
  }

  return { valid: true };
}
