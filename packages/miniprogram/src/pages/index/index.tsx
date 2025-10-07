import { useState } from 'react'
import { View, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface UploadedFile {
  path: string
  size: number
}

export default function Index() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [processing, setProcessing] = useState(false)

  // 选择图片
  const handleChooseImage = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 9 - files.length, // 最多9张
        sizeType: ['original'],
        sourceType: ['album', 'camera']
      })

      const newFiles = res.tempFiles.map(file => ({
        path: file.path,
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
  const handleRemoveImage = (index: number) => {
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

    try {
      Taro.showLoading({
        title: '处理中...',
        mask: true
      })

      // TODO: 实现图片处理逻辑
      // 这里暂时模拟处理过程
      await new Promise(resolve => setTimeout(resolve, 2000))

      Taro.hideLoading()

      Taro.showToast({
        title: '处理完成',
        icon: 'success'
      })

      // TODO: 跳转到结果页面
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({
        title: '处理失败',
        icon: 'error'
      })
    } finally {
      setProcessing(false)
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

      {/* Settings Section (TODO: 后续添加) */}
      <View className='settings-section'>
        <View className='section-title'>处理设置</View>
        <View className='settings-tip'>
          即将支持：格式转换、裁剪、重命名、压缩
        </View>
      </View>

      {/* Action Buttons */}
      <View className='action-section'>
        <Button
          className='process-btn'
          type='primary'
          disabled={files.length === 0 || processing}
          onClick={handleProcess}
        >
          {processing ? '处理中...' : '开始处理'}
        </Button>
      </View>
    </View>
  )
}
