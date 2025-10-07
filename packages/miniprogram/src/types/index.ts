export type CropRatio = '1:1' | '16:9' | '4:3' | '3:2' | 'custom' | 'none'
export type CropPosition = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
export type OutputFormat = 'jpg' | 'png' | 'webp'

export interface CropOptions {
  enabled: boolean
  ratio: CropRatio
  position: CropPosition
  customWidth?: number
  customHeight?: number
}

export interface RenameOptions {
  enabled: boolean
  prefix: string
  suffix: string
  keepOriginalName: boolean
  useSequence: boolean
  sequenceStart: number
  sequenceDigits: 1 | 2 | 3
}

export interface ProcessSettings {
  outputFormat: OutputFormat
  quality: number
  cropOptions: CropOptions
  renameOptions: RenameOptions
}

export interface UploadedFile {
  path: string
  name: string
  size: number
}
