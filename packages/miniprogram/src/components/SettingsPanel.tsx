import { View, Picker, Slider, Switch } from '@tarojs/components'
import { useState } from 'react'
import './SettingsPanel.scss'

type CropRatio = '1:1' | '16:9' | '4:3' | '3:2' | 'custom' | 'none'
type CropPosition = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

interface CropOptions {
  enabled: boolean
  ratio: CropRatio
  position: CropPosition
  customWidth?: number
  customHeight?: number
}

interface RenameOptions {
  enabled: boolean
  prefix: string
  suffix: string
  keepOriginalName: boolean
  useSequence: boolean
  sequenceStart: number
  sequenceDigits: 1 | 2 | 3
}

interface SettingsPanelProps {
  onSettingsChange: (settings: {
    outputFormat: 'jpg' | 'png' | 'webp'
    quality: number
    cropOptions: CropOptions
    renameOptions: RenameOptions
  }) => void
}

export default function SettingsPanel({ onSettingsChange }: SettingsPanelProps) {
  // 格式设置
  const [outputFormat, setOutputFormat] = useState<'jpg' | 'png' | 'webp'>('jpg')
  const formats = [
    { label: 'JPG (通用)', value: 'jpg' },
    { label: 'PNG (透明)', value: 'png' },
    { label: 'WebP (高压缩)', value: 'webp' }
  ]

  // 质量设置
  const [quality, setQuality] = useState(85)

  // 裁剪设置
  const [cropEnabled, setCropEnabled] = useState(false)
  const [cropRatio, setCropRatio] = useState<CropRatio>('none')
  const cropRatios = [
    { label: '不裁剪', value: 'none' },
    { label: '1:1 (正方形)', value: '1:1' },
    { label: '16:9 (宽屏)', value: '16:9' },
    { label: '4:3 (标准)', value: '4:3' },
    { label: '3:2 (照片)', value: '3:2' }
  ]

  // 重命名设置
  const [renameEnabled, setRenameEnabled] = useState(false)
  const [renamePrefix, setRenamePrefix] = useState('')

  // 更新设置
  const updateSettings = () => {
    const cropOptions: CropOptions = {
      enabled: cropEnabled,
      ratio: cropRatio,
      position: 'center'
    }

    const renameOptions: RenameOptions = {
      enabled: renameEnabled,
      prefix: renamePrefix,
      suffix: '',
      keepOriginalName: false,
      useSequence: true,
      sequenceStart: 1,
      sequenceDigits: 3
    }

    onSettingsChange({
      outputFormat,
      quality,
      cropOptions,
      renameOptions
    })
  }

  // 格式变化
  const handleFormatChange = (e) => {
    const index = e.detail.value
    const newFormat = formats[index].value as 'jpg' | 'png' | 'webp'
    setOutputFormat(newFormat)
    setTimeout(updateSettings, 0)
  }

  // 质量变化
  const handleQualityChange = (e) => {
    setQuality(e.detail.value)
    setTimeout(updateSettings, 0)
  }

  // 裁剪开关
  const handleCropToggle = (e) => {
    setCropEnabled(e.detail.value)
    setTimeout(updateSettings, 0)
  }

  // 裁剪比例变化
  const handleCropRatioChange = (e) => {
    const index = e.detail.value
    const newRatio = cropRatios[index].value as CropRatio
    setCropRatio(newRatio)
    setTimeout(updateSettings, 0)
  }

  // 重命名开关
  const handleRenameToggle = (e) => {
    setRenameEnabled(e.detail.value)
    setTimeout(updateSettings, 0)
  }

  return (
    <View className='settings-panel'>
      {/* 格式设置 */}
      <View className='setting-section'>
        <View className='section-title'>输出格式</View>
        <Picker
          mode='selector'
          range={formats}
          rangeKey='label'
          onChange={handleFormatChange}
        >
          <View className='picker-item'>
            <View className='label'>格式</View>
            <View className='value'>{formats.find(f => f.value === outputFormat)?.label}</View>
          </View>
        </Picker>
      </View>

      {/* 质量设置 */}
      <View className='setting-section'>
        <View className='section-title'>图片质量 ({quality}%)</View>
        <View className='slider-container'>
          <Slider
            value={quality}
            min={10}
            max={100}
            step={5}
            activeColor='#667eea'
            backgroundColor='#e0e0e0'
            blockSize={24}
            onChange={handleQualityChange}
          />
        </View>
      </View>

      {/* 裁剪设置 */}
      <View className='setting-section'>
        <View className='section-header'>
          <View className='section-title'>批量裁剪</View>
          <Switch
            checked={cropEnabled}
            color='#667eea'
            onChange={handleCropToggle}
          />
        </View>

        {cropEnabled && (
          <Picker
            mode='selector'
            range={cropRatios}
            rangeKey='label'
            onChange={handleCropRatioChange}
          >
            <View className='picker-item'>
              <View className='label'>裁剪比例</View>
              <View className='value'>{cropRatios.find(r => r.value === cropRatio)?.label}</View>
            </View>
          </Picker>
        )}
      </View>

      {/* 重命名设置 */}
      <View className='setting-section'>
        <View className='section-header'>
          <View className='section-title'>批量重命名</View>
          <Switch
            checked={renameEnabled}
            color='#667eea'
            onChange={handleRenameToggle}
          />
        </View>

        {renameEnabled && (
          <View className='rename-tip'>
            文件名格式: {renamePrefix || '前缀'}_001.{outputFormat}
          </View>
        )}
      </View>
    </View>
  )
}
