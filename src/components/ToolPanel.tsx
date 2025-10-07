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
import { useStore } from '@/store/useStore';
import { OutputFormat, CompressionMode } from '@/types';

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

      <div className="space-y-4 sm:space-y-6">
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
      </div>
    </Card>
  );
}
