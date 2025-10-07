// Export all shared types
export * from './types';

// Export crop utilities (calculation only, no browser APIs)
export { calculateCropArea, calculateTargetRatio, calculateCropPosition } from './crop';

// Export rename utilities (pure functions)
export { generateNewFilename, previewFilenames, padNumber, validateRenameOptions } from './rename';

// Export compress core algorithms (platform-independent)
export {
  analyzeImageData,
  getCompressionStrategy,
  calculateNextQuality,
  isTargetSizeReached,
  DEFAULT_COMPRESS_CONFIG,
  type ImageType,
  type CompressionStrategy,
  type ImageAnalysisData,
  type IterativeCompressConfig
} from './compress-core';
