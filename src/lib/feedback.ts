/**
 * 用户反馈优化
 * 提供更友好、更详细的提示信息
 */

export const feedbackMessages = {
  // 上传相关
  upload: {
    success: (count: number) => ({
      title: '上传成功',
      description: `已添加 ${count} 个文件`,
    }),
    tooManyFiles: (max: number) => ({
      title: '文件数量超限',
      description: `最多只能上传 ${max} 个文件`,
    }),
    fileTooLarge: (filename: string, maxSize: string) => ({
      title: '文件过大',
      description: `${filename} 超过 ${maxSize} 限制`,
    }),
    invalidType: (filename: string) => ({
      title: '不支持的格式',
      description: `${filename} 不是有效的图片文件`,
    }),
  },

  // 处理相关
  process: {
    starting: {
      title: '开始处理',
      description: '正在准备处理您的图片...',
    },
    completed: (count: number, time: number) => ({
      title: '处理完成',
      description: `成功处理 ${count} 个文件，用时 ${time.toFixed(1)} 秒`,
    }),
    noFiles: {
      title: '没有文件',
      description: '请先上传图片',
    },
    noPendingFiles: {
      title: '没有待处理的文件',
      description: '所有文件已处理完成',
    },
    failed: (filename: string, reason?: string) => ({
      title: '处理失败',
      description: reason ? `${filename}: ${reason}` : `${filename} 处理失败`,
    }),
  },

  // 下载相关
  download: {
    preparing: {
      title: '准备下载',
      description: '正在打包文件...',
    },
    single: (filename: string) => ({
      title: '下载成功',
      description: `${filename} 已保存`,
    }),
    batch: (count: number) => ({
      title: '下载成功',
      description: `${count} 个文件已打包下载`,
    }),
    noProcessedFiles: {
      title: '没有可下载的文件',
      description: '请先处理图片',
    },
    failed: {
      title: '下载失败',
      description: '无法生成下载文件，请重试',
    },
  },

  // 压缩相关
  compression: {
    heicLoading: {
      title: '加载 HEIC 转换器',
      description: '首次处理 HEIC 需要加载库（约 340KB）...',
    },
    heicConverting: (filename: string) => ({
      title: '转换 HEIC',
      description: `正在转换 ${filename}...`,
    }),
    optimizing: {
      title: '智能压缩',
      description: '正在优化图片大小...',
    },
    targetSizeReached: (originalSize: string, finalSize: string, ratio: number) => ({
      title: '压缩完成',
      description: `${originalSize} → ${finalSize} (节省 ${ratio}%)`,
    }),
  },

  // 历史记录
  history: {
    cleared: {
      title: '历史已清空',
      description: '所有历史记录已删除',
    },
    recordDeleted: {
      title: '记录已删除',
      description: '历史记录已移除',
    },
    loadFailed: {
      title: '加载失败',
      description: '无法加载历史记录',
    },
  },

  // 统计相关
  stats: {
    reset: {
      title: '统计已重置',
      description: '所有使用数据已清空',
    },
    exported: {
      title: '导出成功',
      description: '统计数据已下载',
    },
    exportFailed: {
      title: '导出失败',
      description: '无法导出统计数据',
    },
  },

  // 错误处理
  error: {
    unexpected: (action: string) => ({
      title: '操作失败',
      description: `${action}时发生未知错误，请重试`,
    }),
    networkError: {
      title: '网络错误',
      description: '请检查网络连接后重试',
    },
    browserNotSupported: (feature: string) => ({
      title: '浏览器不支持',
      description: `您的浏览器不支持 ${feature}`,
    }),
  },
}

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

// 格式化时间
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}秒`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}分${remainingSeconds}秒`
}

// 计算压缩比
export const calculateCompressionRatio = (
  originalSize: number,
  compressedSize: number
): number => {
  if (originalSize === 0) return 0
  return Math.round(((originalSize - compressedSize) / originalSize) * 100)
}
