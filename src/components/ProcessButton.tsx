import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Play } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import { FileStatus } from '@/types';

export function ProcessButton() {
  const { files, processing, totalProgress } = useStore();
  const { processAllFiles } = useImageProcessor();

  const pendingCount = files.filter((f) => f.status === FileStatus.PENDING).length;
  const canProcess = pendingCount > 0 && !processing;

  return (
    <div className="space-y-4">
      <Button
        onClick={processAllFiles}
        disabled={!canProcess}
        size="lg"
        className="w-full"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            处理中...
          </>
        ) : (
          <>
            <Play className="mr-2 h-5 w-5" />
            开始处理 ({pendingCount} 个文件)
          </>
        )}
      </Button>

      {processing && (
        <div className="space-y-2">
          <Progress value={totalProgress} />
          <p className="text-center text-sm text-muted-foreground">
            总进度: {totalProgress}%
          </p>
        </div>
      )}
    </div>
  );
}
