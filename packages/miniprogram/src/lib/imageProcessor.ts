import Taro from '@tarojs/taro'
import {
  calculateCropArea,
  generateNewFilename,
  getCompressionStrategy,
  analyzeImageData,
  type CropOptions,
  type RenameOptions
} from '@picbatch/shared'

export interface ProcessOptions {
  outputFormat: 'jpg' | 'png' | 'webp'
  quality: number
  cropOptions?: CropOptions
  renameOptions?: RenameOptions
}

export interface ProcessResult {
  tempFilePath: string
  originalFilename: string
  processedFilename: string
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

/**
 * 处理单张图片
 * @param filePath 临时文件路径
 * @param originalFilename 原始文件名
 * @param index 文件索引（用于重命名）
 * @param options 处理选项
 * @returns 处理结果
 */
export async function processImage(
  filePath: string,
  originalFilename: string,
  index: number,
  options: ProcessOptions
): Promise<ProcessResult> {
  try {
    // 1. 获取图片信息
    const imageInfo = await Taro.getImageInfo({ src: filePath })

    let { width, height } = imageInfo

    // 2. 计算裁剪区域（如果启用）
    let cropArea = { x: 0, y: 0, width, height }
    if (options.cropOptions?.enabled && options.cropOptions.ratio !== 'none') {
      cropArea = calculateCropArea(width, height, options.cropOptions)
    }

    // 3. 创建 Canvas 绘制裁剪后的图片
    const canvasId = `canvas-${Date.now()}-${Math.random()}`

    // 创建离屏 Canvas
    const canvas = Taro.createOffscreenCanvas({
      type: '2d',
      width: cropArea.width,
      height: cropArea.height
    })

    const ctx = canvas.getContext('2d')

    // 创建图片对象
    const img = canvas.createImage()

    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = filePath
    })

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
    )

    // 4. 导出为临时文件
    const formatMap = {
      jpg: 'jpg',
      png: 'png',
      webp: 'webp'
    }

    const tempFilePath = await Taro.canvasToTempFilePath({
      canvas,
      fileType: formatMap[options.outputFormat],
      quality: options.quality / 100
    })

    // 5. 生成新文件名（如果启用重命名）
    let processedFilename = originalFilename
    if (options.renameOptions?.enabled) {
      const extension = options.outputFormat === 'jpg' ? 'jpg' : options.outputFormat
      processedFilename = generateNewFilename(
        originalFilename,
        index,
        options.renameOptions,
        extension
      )
    } else {
      // 只更改扩展名
      const basename = originalFilename.replace(/\.[^/.]+$/, '')
      const extension = options.outputFormat === 'jpg' ? 'jpg' : options.outputFormat
      processedFilename = `${basename}.${extension}`
    }

    // 6. 获取处理后文件大小
    const fileInfo = await Taro.getFileInfo({ filePath: tempFilePath.tempFilePath })
    const originalSize = (await Taro.getFileInfo({ filePath })).size
    const compressedSize = fileInfo.size
    const compressionRatio = Math.round((1 - compressedSize / originalSize) * 100)

    return {
      tempFilePath: tempFilePath.tempFilePath,
      originalFilename,
      processedFilename,
      originalSize,
      compressedSize,
      compressionRatio
    }
  } catch (error) {
    console.error('图片处理失败:', error)
    throw error
  }
}

/**
 * 批量处理图片
 * @param files 文件列表
 * @param options 处理选项
 * @param onProgress 进度回调
 * @returns 处理结果列表
 */
export async function processImages(
  files: Array<{ path: string; name: string }>,
  options: ProcessOptions,
  onProgress?: (current: number, total: number) => void
): Promise<ProcessResult[]> {
  const results: ProcessResult[] = []

  for (let i = 0; i < files.length; i++) {
    try {
      const result = await processImage(
        files[i].path,
        files[i].name,
        i,
        options
      )
      results.push(result)

      if (onProgress) {
        onProgress(i + 1, files.length)
      }
    } catch (error) {
      console.error(`处理第 ${i + 1} 张图片失败:`, error)
      throw error
    }
  }

  return results
}

/**
 * 保存图片到相册
 * @param filePath 临时文件路径
 * @returns 是否成功
 */
export async function saveToAlbum(filePath: string): Promise<boolean> {
  try {
    // 请求权限
    const authResult = await Taro.getSetting()

    if (!authResult.authSetting['scope.writePhotosAlbum']) {
      // 未授权，请求授权
      try {
        await Taro.authorize({ scope: 'scope.writePhotosAlbum' })
      } catch (error) {
        // 用户拒绝授权，引导用户打开设置
        const modalResult = await Taro.showModal({
          title: '需要相册权限',
          content: '保存图片需要您的相册权限，是否前往设置？',
          confirmText: '去设置',
          cancelText: '取消'
        })

        if (modalResult.confirm) {
          await Taro.openSetting()
        }
        return false
      }
    }

    // 保存到相册
    await Taro.saveImageToPhotosAlbum({ filePath })
    return true
  } catch (error) {
    console.error('保存到相册失败:', error)
    return false
  }
}

/**
 * 批量保存图片到相册
 * @param filePaths 文件路径列表
 * @param onProgress 进度回调
 * @returns 成功数量
 */
export async function saveImagesToAlbum(
  filePaths: string[],
  onProgress?: (current: number, total: number) => void
): Promise<number> {
  let successCount = 0

  for (let i = 0; i < filePaths.length; i++) {
    const success = await saveToAlbum(filePaths[i])
    if (success) {
      successCount++
    }

    if (onProgress) {
      onProgress(i + 1, filePaths.length)
    }

    // 添加延迟，避免频繁操作
    if (i < filePaths.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  return successCount
}
