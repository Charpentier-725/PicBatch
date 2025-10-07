import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { FileUploader } from '@/components/FileUploader';
import { FileList } from '@/components/FileList';
import { ToolPanel } from '@/components/ToolPanel';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadButton } from '@/components/DownloadButton';
import { Toaster } from '@/components/ui/toaster';
import { trackSession } from '@/lib/analytics';

function App() {
  // 记录会话
  useEffect(() => {
    trackSession();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* 标题区域 */}
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">开始处理您的图片</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              上传、转换、压缩、下载 - 全在浏览器本地完成
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr,350px]">
            <div className="space-y-4 sm:space-y-6">
              {/* 上传区域 */}
              <FileUploader />

              {/* 文件列表 */}
              <FileList />
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* 设置面板 */}
              <ToolPanel />

              {/* 处理按钮 */}
              <ProcessButton />

              {/* 下载按钮 */}
              <DownloadButton />
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
