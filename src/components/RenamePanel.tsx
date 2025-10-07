import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useStore } from '@/store/useStore';
import { previewFilenames } from '@/lib/rename';
import { FileText, Hash } from 'lucide-react';

export function RenamePanel() {
  const {
    renameOptions,
    outputFormat,
    setRenameEnabled,
    setRenamePrefix,
    setRenameSuffix,
    setRenameKeepOriginalName,
    setRenameUseSequence,
    setRenameSequenceStart,
    setRenameSequenceDigits,
  } = useStore();

  // 获取扩展名（不含点）
  const extension = outputFormat.toLowerCase().replace('jpeg', 'jpg');

  // 预览文件名
  const examples = renameOptions.enabled
    ? previewFilenames(renameOptions, extension, 3)
    : [];

  return (
    <div className="space-y-4">
      {/* 启用重命名开关 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <Label>批量重命名</Label>
        </div>
        <Switch
          checked={renameOptions.enabled}
          onCheckedChange={setRenameEnabled}
        />
      </div>

      {renameOptions.enabled && (
        <>
          {/* 前缀输入 */}
          <div className="space-y-2">
            <Label htmlFor="prefix">前缀</Label>
            <Input
              id="prefix"
              value={renameOptions.prefix}
              onChange={(e) => setRenamePrefix(e.target.value)}
              placeholder="例如：product"
            />
          </div>

          {/* 保留原文件名 */}
          <div className="flex items-center justify-between">
            <Label>保留原文件名</Label>
            <Switch
              checked={renameOptions.keepOriginalName}
              onCheckedChange={setRenameKeepOriginalName}
            />
          </div>

          {/* 使用序号 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <Label>添加序号</Label>
            </div>
            <Switch
              checked={renameOptions.useSequence}
              onCheckedChange={setRenameUseSequence}
            />
          </div>

          {/* 序号设置 */}
          {renameOptions.useSequence && (
            <>
              {/* 起始序号 */}
              <div className="space-y-2">
                <Label htmlFor="sequence-start">起始序号</Label>
                <Input
                  id="sequence-start"
                  type="number"
                  min="0"
                  value={renameOptions.sequenceStart}
                  onChange={(e) =>
                    setRenameSequenceStart(Number(e.target.value))
                  }
                />
              </div>

              {/* 序号位数 */}
              <div className="space-y-2">
                <Label>序号位数</Label>
                <RadioGroup
                  value={String(renameOptions.sequenceDigits)}
                  onValueChange={(value) =>
                    setRenameSequenceDigits(Number(value) as 1 | 2 | 3)
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="digits-1" />
                    <Label htmlFor="digits-1" className="cursor-pointer font-normal">
                      1 位 (1, 2, 3)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="digits-2" />
                    <Label htmlFor="digits-2" className="cursor-pointer font-normal">
                      2 位 (01, 02, 03)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="digits-3" />
                    <Label htmlFor="digits-3" className="cursor-pointer font-normal">
                      3 位 (001, 002, 003)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          {/* 后缀输入 */}
          <div className="space-y-2">
            <Label htmlFor="suffix">后缀</Label>
            <Input
              id="suffix"
              value={renameOptions.suffix}
              onChange={(e) => setRenameSuffix(e.target.value)}
              placeholder="例如：compressed"
            />
          </div>

          {/* 文件名预览 */}
          <div className="space-y-2">
            <Label>文件名预览</Label>
            <div className="rounded-md border bg-muted/50 p-3 space-y-1">
              {examples.map((name, index) => (
                <div key={index} className="text-sm font-mono text-foreground">
                  {name}
                </div>
              ))}
              {examples.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  请设置至少一项命名选项
                </div>
              )}
            </div>
          </div>

          {/* 重命名说明 */}
          <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
            <p>
              文件名各部分将用下划线(_)连接。请避免使用特殊字符：
              <code className="mx-1">&lt; &gt; : " / \ | ? *</code>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
