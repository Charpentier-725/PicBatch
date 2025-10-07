import { useState } from 'react'
import { View, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import SettingsPanel from '../../components/SettingsPanel'
import { processImages, saveImagesToAlbum } from '../../lib/imageProcessor'
import { CropOptions, RenameOptions, ProcessSettings, UploadedFile } from '../../types'
import './index.scss'

export default function Index() {
  const [files, setFiles] = useState([])
  const [processing, setProcessing] = useState(false)
  const [processProgress, setProcessProgress] = useState(0)
  const [settings, setSettings] = useState({
    outputFormat: 'jpg',
    quality: 85,
    cropOptions: {
      enabled: false,
      ratio: 'none',
      position: 'center'
    },
    renameOptions: {
      enabled: false,
      prefix: '',
      suffix: '',
      keepOriginalName: false,
      useSequence: true,
      sequenceStart: 1,
      sequenceDigits: 3
    }
  })

  // 选择图片
  const handleChooseImage = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 9 - files.length,
        sizeType: ['original'],
        sourceType: ['album', 'camera']
      })

      const newFiles = res.tempFiles.map((file, index) => ({
        path: file.path,
        name: `image_${files.length + index + 1}.jpg`,
        size: file.size
      }))

      setFiles([...files, ...newFiles])

      Taro.showToast({
        title: `已选择 ${newFiles.length} 张图片`,
        icon: 'success',
        duration: 2000
      })
    } catch (error) {
      console.error('选择图片失败:', error)
    }
  }

  // 删除图片
  const handleRemoveImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
  }

  // 清空所有图片
  const handleClearAll = () => {
    Taro.showModal({
      title: '确认清空',
      content: '确定要清空所有图片吗?',
      success: (res) => {
        if (res.confirm) {
          setFiles([])
        }
      }
    })
  }

  // 设置变化
  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings)
  }

  // 开始处理
  const handleProcess = async () => {
    if (files.length === 0) {
      Taro.showToast({
        title: '请先选择图片',
        icon: 'none'
      })
      return
    }

    setProcessing(true)
    setProcessProgress(0)

    try {
      Taro.showLoading({
        title: '处理中 0%',
        mask: true
      })

      // 批量处理图片
      const results = await processImages(
        files,
        settings,
        (current, total) => {
          const progress = Math.round((current / total) * 100)
          setProcessProgress(progress)
          Taro.showLoading({
            title: `处理中 ${progress}%`,
            mask: true
          })
        }
      )

      Taro.hideLoading()

      // 显示处理结果
      const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0)
      const totalCompressedSize = results.reduce((sum, r) => sum + r.compressedSize, 0)
      const avgRatio = Math.round((1 - totalCompressedSize / totalOriginalSize) * 100)

      const { confirm } = await Taro.showModal({
        title: '处理完成',
        content: `成功处理 ${results.length} 张图片\n平均压缩率: ${avgRatio}%\n是否保存到相册?`,
        confirmText: '保存',
        cancelText: '取消'
      })

      if (confirm) {
        // 保存到相册
        Taro.showLoading({
          title: '保存中 0%',
          mask: true
        })

        const filePaths = results.map(r => r.tempFilePath)
        const successCount = await saveImagesToAlbum(
          filePaths,
          (current, total) => {
            const progress = Math.round((current / total) * 100)
            Taro.showLoading({
              title: `保存中 ${progress}%`,
              mask: true
            })
          }
        )

        Taro.hideLoading()

        if (successCount === results.length) {
          Taro.showToast({
            title: '全部保存成功',
            icon: 'success'
          })

          // 清空文件列表
          setFiles([])
        } else {
          Taro.showToast({
            title: `保存了 ${successCount}/${results.length} 张`,
            icon: 'none'
          })
        }
      }
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({
        title: '处理失败',
        icon: 'error'
      })
      console.error('处理失败:', error)
    } finally {
      setProcessing(false)
      setProcessProgress(0)
    }
  }

  return (
    <View className='index-page'>
      {/* Header */}
      <View className='header'>
        <View className='title'>PicBatch</View>
        <View className='subtitle'>轻图 - 图片批处理工具</View>
        <View className='description'>免费 · 本地处理 · 保护隐私</View>
      </View>

      {/* Upload Section */}
      <View className='upload-section'>
        <View className='section-title'>
          选择图片 ({files.length}/9)
        </View>

        <View className='image-grid'>
          {files.map((file, index) => (
            <View key={index} className='image-item'>
              <Image
                src={file.path}
                className='preview-image'
                mode='aspectFill'
              />
              <View
                className='remove-btn'
                onClick={() => handleRemoveImage(index)}
              >
                ×
              </View>
            </View>
          ))}

          {files.length < 9 && (
            <View className='add-image-btn' onClick={handleChooseImage}>
              <View className='add-icon'>+</View>
              <View className='add-text'>添加图片</View>
            </View>
          )}
        </View>

        {files.length > 0 && (
          <View className='action-row'>
            <Button className='clear-btn' onClick={handleClearAll}>
              清空
            </Button>
          </View>
        )}
      </View>

      {/* Settings Section */}
      <View className='settings-section'>
        <View className='section-title'>处理设置</View>
        <SettingsPanel onSettingsChange={handleSettingsChange} />
      </View>

      {/* Action Buttons */}
      <View className='action-section'>
        <Button
          className='process-btn'
          type='primary'
          disabled={files.length === 0 || processing}
          onClick={handleProcess}
        >
          {processing ? `处理中 ${processProgress}%` : '开始处理'}
        </Button>
      </View>
    </View>
  )
}
