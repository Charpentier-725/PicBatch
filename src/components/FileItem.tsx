import { ProcessedFile, FileStatus } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { formatFileSize } from '@/lib/fileUtils';
import { useStore } from '@/store/useStore';

interface FileItemProps {
  file: ProcessedFile;
}

export function FileItem({ file }: FileItemProps) {
  const { removeFile } = useStore();

  const getStatusIcon = () => {
    switch (file.status) {
      case FileStatus.SUCCESS:
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case FileStatus.ERROR:
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case FileStatus.PROCESSING:
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-3 sm:p-4">
      <div className="flex items-start gap-3 sm:items-center sm:gap-4">
        {/* 缩略图 */}
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded bg-muted sm:h-16 sm:w-16">
          <img
            src={file.preview}
            alt={file.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* 文件信息 */}
        <div className="min-w-0 flex-1 space-y-1 sm:space-y-2">
          <div className="flex items-start gap-2">
            <p className="flex-1 break-all text-sm font-medium sm:text-base sm:truncate">
              {file.name}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 sm:h-8 sm:w-8"
              onClick={() => removeFile(file.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatFileSize(file.originalSize)}</span>
            {file.compressedSize && (
              <>
                <span>→</span>
                <span>{formatFileSize(file.compressedSize)}</span>
                <Badge variant="secondary" className="text-xs">
                  -{file.compressionRatio}%
                </Badge>
              </>
            )}
          </div>

          {/* 进度条 */}
          {file.status === FileStatus.PROCESSING && (
            <Progress value={file.progress} className="h-1" />
          )}

          {/* 错误信息 */}
          {file.status === FileStatus.ERROR && file.error && (
            <p className="text-xs text-destructive">{file.error}</p>
          )}
        </div>

        {/* 状态图标 */}
        <div className="flex-shrink-0">{getStatusIcon()}</div>
      </div>
    </Card>
  );
}
