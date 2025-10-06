import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex flex-col gap-8">
          {/* 标题区域 */}
          <div className="text-center">
            <h2 className="text-3xl font-bold">开始处理您的图片</h2>
            <p className="mt-2 text-muted-foreground">
              上传、转换、压缩、下载 - 全在浏览器本地完成
            </p>
          </div>

          {/* 功能区域占位 */}
          <div className="grid gap-6">
            {/* 这里将放置上传、设置、文件列表等组件 */}
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center">
              <p className="text-muted-foreground">功能组件将在后续阶段添加</p>
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
