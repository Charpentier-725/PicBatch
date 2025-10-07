import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { FileStatus } from '@/types';
import { createAndDownloadZip } from '@/lib/zipUtils';
import { useToast } from '@/hooks/use-toast';

export function DownloadButton() {
  const { files, outputFormat } = useStore();
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const successCount = files.filter((f) => f.status === FileStatus.SUCCESS).length;

  const handleDownload = async () => {
    if (successCount === 0) {
      toast({
        title: '没有可下载的文件',
        description: '请先处理图片',
        variant: 'destructive',
      });
      return;
    }

    setDownloading(true);
    setDownloadProgress(0);

    try {
      const successFiles = files.filter((f) => f.status === FileStatus.SUCCESS);
      await createAndDownloadZip(successFiles, outputFormat, setDownloadProgress);

      toast({
        title: '下载成功',
        description: `已下载 ${successCount} 个文件`,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: '下载失败',
        description: '打包文件时出错',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleDownload}
        disabled={successCount === 0 || downloading}
        size="lg"
        className="w-full"
        variant="secondary"
      >
        {downloading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            打包中...
          </>
        ) : (
          <>
            <Download className="mr-2 h-5 w-5" />
            下载全部 ({successCount} 个文件)
          </>
        )}
      </Button>

      {downloading && (
        <div className="space-y-2">
          <Progress value={downloadProgress} />
          <p className="text-center text-sm text-muted-foreground">
            打包进度: {Math.round(downloadProgress)}%
          </p>
        </div>
      )}
    </div>
  );
}
