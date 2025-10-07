import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/store/useStore';
import { OutputFormat, CompressionMode } from '@/types';
import { CropPanel } from './CropPanel';
import { RenamePanel } from './RenamePanel';
import { Settings, Crop, FileText } from 'lucide-react';

export function ToolPanel() {
  const {
    outputFormat,
    quality,
    compressionMode,
    targetSize,
    setOutputFormat,
    setQuality,
    setCompressionMode,
    setTargetSize,
  } = useStore();

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="mb-4 text-base font-semibold sm:text-lg">处理设置</h3>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic" className="flex items-center gap-1 sm:gap-2">
            <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">基础</span>
          </TabsTrigger>
          <TabsTrigger value="crop" className="flex items-center gap-1 sm:gap-2">
            <Crop className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">裁剪</span>
          </TabsTrigger>
          <TabsTrigger value="rename" className="flex items-center gap-1 sm:gap-2">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">重命名</span>
          </TabsTrigger>
        </TabsList>

        {/* 基础设置选项卡 */}
        <TabsContent value="basic" className="space-y-4 sm:space-y-6 mt-4">
          {/* 输出格式 */}
          <div className="space-y-2">
            <Label>输出格式</Label>
            <Select
              value={outputFormat}
              onValueChange={(v) => setOutputFormat(v as OutputFormat)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>JPEG</SelectLabel>
                  <SelectItem value="JPEG">.JPG (大写)</SelectItem>
                  <SelectItem value="jpeg">.jpg (小写)</SelectItem>
                </SelectGroup>

                <SelectGroup>
                  <SelectLabel>PNG</SelectLabel>
                  <SelectItem value="PNG">.PNG (大写)</SelectItem>
                  <SelectItem value="png">.png (小写)</SelectItem>
                </SelectGroup>

                <SelectGroup>
                  <SelectLabel>WebP</SelectLabel>
                  <SelectItem value="WEBP">.WEBP (大写)</SelectItem>
                  <SelectItem value="webp">.webp (小写)</SelectItem>
                </SelectGroup>

                <SelectGroup>
                  <SelectLabel>GIF</SelectLabel>
                  <SelectItem value="GIF">.GIF (大写)</SelectItem>
                  <SelectItem value="gif">.gif (小写)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* 压缩模式 */}
          <div className="space-y-2">
            <Label>压缩模式</Label>
            <RadioGroup
              value={compressionMode}
              onValueChange={(v) => setCompressionMode(v as CompressionMode)}
            >
              <div className="flex items-center space-x-2 py-1">
                <RadioGroupItem value="quality" id="quality" />
                <Label htmlFor="quality" className="cursor-pointer font-normal">
                  质量优先
                </Label>
              </div>
              <div className="flex items-center space-x-2 py-1">
                <RadioGroupItem value="size" id="size" />
                <Label htmlFor="size" className="cursor-pointer font-normal">
                  大小优先
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 质量滑块 */}
          {compressionMode === 'quality' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>图片质量</Label>
                <span className="text-sm text-muted-foreground">{quality}%</span>
              </div>
              <Slider
                value={[quality]}
                onValueChange={([v]) => setQuality(v)}
                min={1}
                max={100}
                step={1}
              />
            </div>
          )}

          {/* 目标大小 */}
          {compressionMode === 'size' && (
            <div className="space-y-2">
              <Label>目标大小 (KB)</Label>
              <Input
                type="number"
                value={targetSize || ''}
                onChange={(e) =>
                  setTargetSize(Number(e.target.value) || undefined)
                }
                placeholder="例如: 500"
              />
            </div>
          )}
        </TabsContent>

        {/* 裁剪选项卡 */}
        <TabsContent value="crop" className="mt-4">
          <CropPanel />
        </TabsContent>

        {/* 重命名选项卡 */}
        <TabsContent value="rename" className="mt-4">
          <RenamePanel />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
