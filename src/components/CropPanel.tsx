import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/store/useStore';
import { getCropRatioLabel, getCropPositionLabel } from '@/lib/crop';
import type { CropRatio, CropPosition } from '@/types';
import { Grid3x3, Maximize2 } from 'lucide-react';

export function CropPanel() {
  const {
    cropOptions,
    setCropEnabled,
    setCropRatio,
    setCropCustomSize,
    setCropPosition,
  } = useStore();

  const cropRatios: CropRatio[] = ['none', '1:1', '16:9', '4:3', '3:2', 'custom'];
  const cropPositions: CropPosition[] = [
    'top-left',
    'center',
    'top-right',
    'bottom-left',
    'bottom-right',
  ];

  return (
    <div className="space-y-4">
      {/* 启用裁剪开关 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Grid3x3 className="h-4 w-4 text-muted-foreground" />
          <Label>批量裁剪</Label>
        </div>
        <Switch checked={cropOptions.enabled} onCheckedChange={setCropEnabled} />
      </div>

      {cropOptions.enabled && (
        <>
          {/* 裁剪比例选择 */}
          <div className="space-y-2">
            <Label>裁剪比例</Label>
            <RadioGroup
              value={cropOptions.ratio}
              onValueChange={(value) => setCropRatio(value as CropRatio)}
              className="gap-2"
            >
              {cropRatios.map((ratio) => (
                <div key={ratio} className="flex items-center space-x-2">
                  <RadioGroupItem value={ratio} id={`ratio-${ratio}`} />
                  <Label
                    htmlFor={`ratio-${ratio}`}
                    className="cursor-pointer font-normal"
                  >
                    {getCropRatioLabel(ratio)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 自定义比例输入 */}
          {cropOptions.ratio === 'custom' && (
            <div className="space-y-2">
              <Label>自定义比例</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  value={cropOptions.customWidth || 16}
                  onChange={(e) =>
                    setCropCustomSize(
                      Number(e.target.value),
                      cropOptions.customHeight || 9
                    )
                  }
                  className="w-20"
                  placeholder="宽"
                />
                <span className="text-muted-foreground">:</span>
                <Input
                  type="number"
                  min="1"
                  value={cropOptions.customHeight || 9}
                  onChange={(e) =>
                    setCropCustomSize(
                      cropOptions.customWidth || 16,
                      Number(e.target.value)
                    )
                  }
                  className="w-20"
                  placeholder="高"
                />
              </div>
            </div>
          )}

          {/* 裁剪位置选择 */}
          {cropOptions.ratio !== 'none' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Maximize2 className="h-4 w-4 text-muted-foreground" />
                <Label>裁剪位置</Label>
              </div>
              <RadioGroup
                value={cropOptions.position}
                onValueChange={(value) => setCropPosition(value as CropPosition)}
                className="gap-2"
              >
                {cropPositions.map((position) => (
                  <div key={position} className="flex items-center space-x-2">
                    <RadioGroupItem value={position} id={`position-${position}`} />
                    <Label
                      htmlFor={`position-${position}`}
                      className="cursor-pointer font-normal"
                    >
                      {getCropPositionLabel(position)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* 裁剪说明 */}
          <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
            <p>
              裁剪将保持图片质量，仅改变图片尺寸。如果图片比例与目标比例不匹配，将裁剪掉多余部分。
            </p>
          </div>
        </>
      )}
    </div>
  );
}
