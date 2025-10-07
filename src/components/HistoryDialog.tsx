import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { historyDB, ProcessingRecord } from '@/lib/historyDB';
import { useToast } from '@/hooks/use-toast';
import { History, Clock, FileImage, Trash2, Download, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function HistoryDialog() {
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState<ProcessingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    setOutputFormat,
    setQuality,
    setCompressionMode,
    setTargetSize,
    setCropEnabled,
    setCropRatio,
    setCropPosition,
    setRenameEnabled,
    setRenamePrefix,
    setRenameSuffix,
    setRenameKeepOriginalName,
    setRenameUseSequence,
    setRenameSequenceStart,
    setRenameSequenceDigits,
  } = useStore();

  // 加载历史记录
  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await historyDB.getRecentRecords(10);
      setRecords(data);
    } catch (error) {
      console.error('Failed to load history:', error);
      toast({
        title: '加载失败',
        description: '无法加载历史记录',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // 打开对话框时加载记录
  useEffect(() => {
    if (open) {
      loadRecords();
    }
  }, [open]);

  // 恢复记录设置
  const restoreRecord = (record: ProcessingRecord) => {
    // 恢复基础设置
    setOutputFormat(record.outputFormat);
    setCompressionMode(record.compressionMode);
    if (record.quality !== undefined) {
      setQuality(record.quality);
    }
    if (record.targetSize !== undefined) {
      setTargetSize(record.targetSize);
    }

    // 恢复裁剪设置
    if (record.cropOptions) {
      setCropEnabled(record.cropOptions.enabled);
      setCropRatio(record.cropOptions.ratio);
      setCropPosition(record.cropOptions.position);
      if (record.cropOptions.customWidth && record.cropOptions.customHeight) {
        // 这里需要Store提供setCropCustomSize方法
      }
    }

    // 恢复重命名设置
    if (record.renameOptions) {
      setRenameEnabled(record.renameOptions.enabled);
      setRenamePrefix(record.renameOptions.prefix);
      setRenameSuffix(record.renameOptions.suffix);
      setRenameKeepOriginalName(record.renameOptions.keepOriginalName);
      setRenameUseSequence(record.renameOptions.useSequence);
      setRenameSequenceStart(record.renameOptions.sequenceStart);
      setRenameSequenceDigits(record.renameOptions.sequenceDigits);
    }

    setOpen(false);
    toast({
      title: '设置已恢复',
      description: '已应用历史记录的处理参数',
    });
  };

  // 删除记录
  const deleteRecord = async (id: string) => {
    try {
      await historyDB.deleteRecord(id);
      await loadRecords();
      toast({
        title: '删除成功',
        description: '历史记录已删除',
      });
    } catch (error) {
      console.error('Failed to delete record:', error);
      toast({
        title: '删除失败',
        description: '无法删除历史记录',
        variant: 'destructive',
      });
    }
  };

  // 清空历史
  const clearAllHistory = async () => {
    try {
      await historyDB.clearHistory();
      setRecords([]);
      toast({
        title: '已清空',
        description: '所有历史记录已删除',
      });
    } catch (error) {
      console.error('Failed to clear history:', error);
      toast({
        title: '清空失败',
        description: '无法清空历史记录',
        variant: 'destructive',
      });
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">历史记录</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            处理历史记录
          </DialogTitle>
          <DialogDescription>
            查看最近的处理记录，点击可快速恢复设置
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 操作按钮 */}
          {records.length > 0 && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllHistory}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                清空全部
              </Button>
            </div>
          )}

          {/* 记录列表 */}
          <ScrollArea className="h-[400px] pr-4">
            {loading ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                加载中...
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <History className="h-12 w-12 mb-2 opacity-20" />
                <p>暂无历史记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        {/* 时间和文件数 */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(record.timestamp, {
                              addSuffix: true,
                              locale: zhCN,
                            })}
                          </span>
                          <span>·</span>
                          <FileImage className="h-3 w-3" />
                          <span>{record.fileCount} 个文件</span>
                        </div>

                        {/* 参数标签 */}
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">
                            {record.outputFormat.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {record.compressionMode === 'quality'
                              ? `质量 ${record.quality}%`
                              : `目标 ${record.targetSize}KB`}
                          </Badge>
                          {record.cropOptions?.enabled && (
                            <Badge variant="outline">裁剪</Badge>
                          )}
                          {record.renameOptions?.enabled && (
                            <Badge variant="outline">重命名</Badge>
                          )}
                        </div>

                        {/* 压缩效果 */}
                        <div className="text-xs text-muted-foreground">
                          <Download className="inline h-3 w-3 mr-1" />
                          {formatFileSize(record.totalSize)} →{' '}
                          {formatFileSize(record.compressedSize)}
                          <span className="ml-2 text-green-600">
                            节省 {record.compressionRatio}%
                          </span>
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => restoreRecord(record)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteRecord(record.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
