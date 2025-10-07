import { useStore } from '@/store/useStore';
import { FileItem } from './FileItem';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export function FileList() {
  const { files, clearFiles } = useStore();

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold sm:text-lg">
          已选择 {files.length} 个文件
        </h3>
        <Button variant="outline" size="sm" onClick={clearFiles}>
          <Trash2 className="mr-2 h-4 w-4" />
          清空全部
        </Button>
      </div>

      <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-2">
        {files.map((file) => (
          <FileItem key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}
