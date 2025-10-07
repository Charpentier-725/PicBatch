import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { validateFile } from '@/lib/fileUtils';
import { useToast } from '@/hooks/use-toast';

export function FileUploader() {
  const { addFiles } = useStore();
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles: File[] = [];
      const errors: string[] = [];

      acceptedFiles.forEach((file) => {
        const { valid, error } = validateFile(file);
        if (valid) {
          validFiles.push(file);
        } else {
          errors.push(`${file.name}: ${error}`);
        }
      });

      if (validFiles.length > 0) {
        addFiles(validFiles);
        toast({
          title: '上传成功',
          description: `已添加 ${validFiles.length} 个文件`,
        });
      }

      if (errors.length > 0) {
        toast({
          title: '部分文件上传失败',
          description: errors.join('\n'),
          variant: 'destructive',
        });
      }
    },
    [addFiles, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.svg', '.gif'],
    },
    multiple: true,
  });

  return (
    <Card
      {...getRootProps()}
      className={`cursor-pointer border-2 border-dashed p-8 text-center transition-colors sm:p-12 ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        {isDragActive ? (
          <>
            <Upload className="h-10 w-10 text-primary sm:h-12 sm:w-12" />
            <p className="text-base font-medium sm:text-lg">松开以上传文件</p>
          </>
        ) : (
          <>
            <Image className="h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" />
            <div>
              <p className="text-base font-medium sm:text-lg">拖拽图片到这里</p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                或点击选择文件（支持 JPG、PNG、WebP、HEIC、SVG、GIF）
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              支持批量上传，单个文件最大 50MB
            </p>
          </>
        )}
      </div>
    </Card>
  );
}
