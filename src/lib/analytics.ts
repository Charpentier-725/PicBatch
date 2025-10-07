/**
 * 用户行为分析和使用统计
 * 隐私优先：所有数据存储在本地，不上传到服务器
 */

export interface UsageStats {
  // 总体统计
  totalProcessedImages: number
  totalSavedBytes: number
  totalSessions: number
  firstUsedAt: string
  lastUsedAt: string

  // 功能使用统计
  formatConversions: {
    [key: string]: number // 'jpeg', 'png', 'webp', 'heic' 等
  }
  compressionUsage: {
    quality: number // 质量压缩次数
    size: number // 大小压缩次数
  }
  cropUsage: {
    [key: string]: number // '1:1', '16:9' 等
  }
  renameUsage: number

  // 性能统计
  averageProcessingTime: number // 平均处理时间（秒）
  totalProcessingTime: number // 总处理时间（秒）
}

const STORAGE_KEY = 'picbatch_usage_stats'

// 初始化统计数据
const getDefaultStats = (): UsageStats => ({
  totalProcessedImages: 0,
  totalSavedBytes: 0,
  totalSessions: 0,
  firstUsedAt: new Date().toISOString(),
  lastUsedAt: new Date().toISOString(),
  formatConversions: {},
  compressionUsage: {
    quality: 0,
    size: 0
  },
  cropUsage: {},
  renameUsage: 0,
  averageProcessingTime: 0,
  totalProcessingTime: 0
})

// 获取统计数据
export const getUsageStats = (): UsageStats => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
  return getDefaultStats()
}

// 保存统计数据
const saveUsageStats = (stats: UsageStats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch (error) {
    console.error('保存统计数据失败:', error)
  }
}

// 记录新会话
export const trackSession = () => {
  const stats = getUsageStats()
  stats.totalSessions += 1
  stats.lastUsedAt = new Date().toISOString()
  saveUsageStats(stats)
}

// 记录图片处理
export const trackImageProcessing = (params: {
  count: number
  savedBytes: number
  processingTime: number
  outputFormat: string
  compressionMode?: 'quality' | 'size'
  cropRatio?: string
  useRename?: boolean
}) => {
  const stats = getUsageStats()

  // 更新总体统计
  stats.totalProcessedImages += params.count
  stats.totalSavedBytes += params.savedBytes
  stats.lastUsedAt = new Date().toISOString()

  // 更新格式转换统计
  stats.formatConversions[params.outputFormat] =
    (stats.formatConversions[params.outputFormat] || 0) + params.count

  // 更新压缩统计
  if (params.compressionMode === 'quality') {
    stats.compressionUsage.quality += params.count
  } else if (params.compressionMode === 'size') {
    stats.compressionUsage.size += params.count
  }

  // 更新裁剪统计
  if (params.cropRatio && params.cropRatio !== 'none') {
    stats.cropUsage[params.cropRatio] =
      (stats.cropUsage[params.cropRatio] || 0) + params.count
  }

  // 更新重命名统计
  if (params.useRename) {
    stats.renameUsage += params.count
  }

  // 更新性能统计
  stats.totalProcessingTime += params.processingTime
  stats.averageProcessingTime =
    stats.totalProcessingTime / stats.totalProcessedImages

  saveUsageStats(stats)
}

// 获取格式化的统计信息
export const getFormattedStats = () => {
  const stats = getUsageStats()

  // 格式化文件大小
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  // 计算使用天数
  const firstUsed = new Date(stats.firstUsedAt)
  const lastUsed = new Date(stats.lastUsedAt)
  const daysUsed = Math.ceil(
    (lastUsed.getTime() - firstUsed.getTime()) / (1000 * 60 * 60 * 24)
  )

  // 获取最常用的格式
  const mostUsedFormat = Object.entries(stats.formatConversions)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || '暂无'

  // 获取最常用的裁剪比例
  const mostUsedCrop = Object.entries(stats.cropUsage)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || '未使用'

  return {
    // 基础统计
    totalProcessedImages: stats.totalProcessedImages,
    totalSavedBytes: formatBytes(stats.totalSavedBytes),
    totalSessions: stats.totalSessions,
    daysUsed,

    // 使用偏好
    mostUsedFormat,
    mostUsedCrop,

    // 压缩偏好
    compressionPreference:
      stats.compressionUsage.quality > stats.compressionUsage.size
        ? '质量压缩'
        : stats.compressionUsage.size > 0
        ? '大小压缩'
        : '未使用',

    // 功能使用率
    cropUsageRate: stats.totalProcessedImages > 0
      ? ((Object.values(stats.cropUsage).reduce((a, b) => a + b, 0) / stats.totalProcessedImages) * 100).toFixed(1)
      : '0',
    renameUsageRate: stats.totalProcessedImages > 0
      ? ((stats.renameUsage / stats.totalProcessedImages) * 100).toFixed(1)
      : '0',

    // 性能指标
    averageProcessingTime: stats.averageProcessingTime.toFixed(2),

    // 原始数据（用于详细展示）
    raw: stats
  }
}

// 重置统计数据
export const resetUsageStats = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('重置统计数据失败:', error)
    return false
  }
}

// 导出统计数据（用于分享或备份）
export const exportUsageStats = () => {
  const stats = getUsageStats()
  const formatted = getFormattedStats()

  return {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    stats,
    formatted
  }
}
