import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BarChart3, Download, RotateCcw, TrendingUp } from 'lucide-react'
import { getFormattedStats, resetUsageStats, exportUsageStats } from '@/lib/analytics'
import { useToast } from '@/hooks/use-toast'

export function StatsDialog() {
  const [open, setOpen] = useState(false)
  const [stats, setStats] = useState<ReturnType<typeof getFormattedStats> | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      setStats(getFormattedStats())
    }
  }, [open])

  const handleReset = () => {
    if (confirm('确定要重置所有使用统计吗？此操作无法撤销。')) {
      const success = resetUsageStats()
      if (success) {
        setStats(getFormattedStats())
        toast({
          title: '统计已重置',
          description: '所有使用数据已清空',
        })
      } else {
        toast({
          title: '重置失败',
          description: '无法清空统计数据',
          variant: 'destructive',
        })
      }
    }
  }

  const handleExport = () => {
    try {
      const data = exportUsageStats()
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `picbatch-stats-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)

      toast({
        title: '导出成功',
        description: '统计数据已下载',
      })
    } catch (error) {
      toast({
        title: '导出失败',
        description: '无法导出统计数据',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="使用统计">
          <BarChart3 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            使用统计
          </DialogTitle>
          <DialogDescription>
            您的图片处理数据汇总（所有数据仅存储在本地）
          </DialogDescription>
        </DialogHeader>

        {!stats ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">加载统计数据中...</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
            {/* 总体统计 */}
            <div>
              <h3 className="text-sm font-semibold mb-3">📊 总体数据</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <div className="text-2xl font-bold text-primary">
                    {stats.totalProcessedImages}
                  </div>
                  <div className="text-sm text-muted-foreground">处理图片数</div>
                </div>
              <div className="rounded-lg border p-4">
                <div className="text-2xl font-bold text-primary">
                  {stats.totalSavedBytes}
                </div>
                <div className="text-sm text-muted-foreground">节省空间</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-2xl font-bold text-primary">
                  {stats.totalSessions}
                </div>
                <div className="text-sm text-muted-foreground">使用次数</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-2xl font-bold text-primary">
                  {stats.daysUsed}
                </div>
                <div className="text-sm text-muted-foreground">使用天数</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 使用偏好 */}
          <div>
            <h3 className="text-sm font-semibold mb-3">⚙️ 使用偏好</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">最常用格式</span>
                <Badge variant="secondary">{stats.mostUsedFormat.toUpperCase()}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">压缩偏好</span>
                <Badge variant="secondary">{stats.compressionPreference}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">最常用裁剪</span>
                <Badge variant="secondary">{stats.mostUsedCrop}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* 功能使用率 */}
          <div>
            <h3 className="text-sm font-semibold mb-3">📈 功能使用率</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">裁剪功能</span>
                  <span className="font-medium">{stats.cropUsageRate}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${stats.cropUsageRate}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">重命名功能</span>
                  <span className="font-medium">{stats.renameUsageRate}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${stats.renameUsageRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 性能指标 */}
          <div>
            <h3 className="text-sm font-semibold mb-3">⚡ 性能指标</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">平均处理时间</span>
              <Badge variant="outline">{stats.averageProcessingTime}秒/张</Badge>
            </div>
          </div>

          {/* 格式统计详情 */}
          {Object.keys(stats.raw.formatConversions).length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold mb-3">🎨 格式转换详情</h3>
                <div className="space-y-2">
                  {Object.entries(stats.raw.formatConversions)
                    .sort(([, a], [, b]) => b - a)
                    .map(([format, count]) => (
                      <div key={format} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{format.toUpperCase()}</span>
                        <span className="font-medium">{count} 张</span>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleExport} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                导出数据
              </Button>
              <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
                <RotateCcw className="mr-2 h-4 w-4" />
                重置统计
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
