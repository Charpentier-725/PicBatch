# PicBatch 部署指南

## Vercel 部署步骤

### 方式一：通过 Vercel CLI（推荐）

#### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 2. 登录 Vercel

```bash
vercel login
```

#### 3. 部署到生产环境

```bash
# 首次部署
vercel

# 生产环境部署
vercel --prod
```

### 方式二：通过 GitHub 集成

#### 1. 准备 Git 仓库

```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Ready for deployment"

# 推送到 GitHub
git remote add origin https://github.com/your-username/picbatch.git
git branch -M main
git push -u origin main
```

#### 2. 在 Vercel 导入项目

1. 访问 [vercel.com](https://vercel.com)
2. 点击 **"New Project"**
3. 选择 **"Import Git Repository"**
4. 选择你的 GitHub 仓库
5. 配置项目设置：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### 3. 部署

点击 **"Deploy"** 按钮，Vercel 会自动：
- 安装依赖
- 运行构建
- 部署到全球 CDN

## 环境变量配置

在 Vercel Dashboard → Settings → Environment Variables 中配置：

```bash
# 可选配置
VITE_APP_NAME=轻图 PicBatch
VITE_APP_VERSION=1.0.0
VITE_MAX_FILE_SIZE=52428800  # 50MB
VITE_MAX_FILES=50
```

## 自定义域名

### 1. 添加域名

在 Vercel Dashboard → Settings → Domains 中添加自定义域名

### 2. 配置 DNS

在你的域名提供商处添加以下记录：

**A 记录（推荐）**
```
类型: A
名称: @
值: 76.76.21.21
```

**CNAME 记录（备选）**
```
类型: CNAME
名称: www
值: cname.vercel-dns.com
```

## 验证部署

部署成功后，检查以下项：

### 1. 功能测试

- [ ] 上传图片功能正常
- [ ] 格式转换正常
- [ ] 压缩功能正常
- [ ] 下载功能正常
- [ ] 移动端显示正常

### 2. 性能测试

运行 Lighthouse 测试：

```bash
# Chrome DevTools → Lighthouse
# 或使用 CLI
npm install -g lighthouse
lighthouse https://your-domain.vercel.app --view
```

**目标指标：**
- Performance: >90
- Accessibility: >95
- Best Practices: >95
- SEO: >95

### 3. 浏览器兼容性

测试以下浏览器：
- [ ] Chrome（最新版）
- [ ] Edge（最新版）
- [ ] Safari（最新版）
- [ ] Firefox（最新版）
- [ ] 微信浏览器

## 监控和维护

### 1. Vercel Analytics

在 Vercel Dashboard 启用 Analytics 查看：
- 访问量统计
- 性能指标
- 用户地理分布

### 2. 错误监控

查看 Vercel Dashboard → Logs 监控：
- 构建日志
- 运行时错误
- 请求日志

### 3. 自动部署

GitHub 集成后，每次推送到 main 分支会自动触发部署：

```bash
git add .
git commit -m "Update features"
git push origin main
# Vercel 自动部署
```

## 回滚部署

如果需要回滚到之前的版本：

1. 访问 Vercel Dashboard → Deployments
2. 找到之前的成功部署
3. 点击 "..." → "Promote to Production"

## 性能优化建议

### 1. 启用 Brotli 压缩

Vercel 默认启用，无需配置

### 2. 缓存策略

已在 `vercel.json` 配置：
- 静态资源缓存 1 年
- HTML 文件不缓存

### 3. CDN 加速

Vercel 自动使用全球 CDN，无需额外配置

## 常见问题

### Q: 部署失败怎么办？

**A:** 检查以下项：
1. 查看 Vercel 构建日志
2. 确认 `package.json` 依赖完整
3. 本地运行 `npm run build` 验证
4. 检查 Node.js 版本（推荐 18+）

### Q: 图片处理失败？

**A:** 浏览器兼容性问题：
- 确保使用现代浏览器
- 检查 HEIC 格式是否需要 polyfill
- 查看浏览器控制台错误

### Q: 如何更新部署？

**A:** 两种方式：
1. Git 推送自动部署
2. `vercel --prod` 手动部署

## 成本估算

Vercel 免费套餐包含：
- ✅ 无限部署
- ✅ 100GB 带宽/月
- ✅ HTTPS 自动配置
- ✅ 全球 CDN
- ✅ 自动 CI/CD

**对于 PicBatch 项目完全够用！**

## 部署清单

部署前确认：

- [ ] 代码已提交到 Git
- [ ] `npm run build` 本地构建成功
- [ ] `vercel.json` 配置正确
- [ ] README.md 更新完整
- [ ] 环境变量已配置
- [ ] 测试所有核心功能
- [ ] 移动端测试通过

---

**下一步：** 部署成功后，更新 README.md 中的域名链接！
