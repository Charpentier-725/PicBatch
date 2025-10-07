import { ThemeToggle } from './ThemeToggle';
import { HistoryDialog } from './HistoryDialog';

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-xl font-bold text-primary-foreground">轻</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">轻图 PicBatch</h1>
            <p className="text-xs text-muted-foreground">免费在线图片批量处理</p>
          </div>
        </div>
        <nav className="flex items-center gap-2 sm:gap-4">
          <HistoryDialog />
          <a href="#features" className="hidden sm:inline text-sm hover:text-primary transition-colors">
            功能
          </a>
          <a href="#about" className="hidden sm:inline text-sm hover:text-primary transition-colors">
            关于
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
