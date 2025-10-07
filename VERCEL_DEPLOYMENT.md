# 🚀 Vercel 部署指南

## 📋 前置准备

### 1. 确保 GitHub 仓库已更新
```bash
# 检查本地提交状态
git status

# 如有未提交的更改，先提交
git add .
git commit -m "chore: Prepare for Vercel deployment"

# 推送到 GitHub
git push origin main
```

### 2. 注册 Vercel 账号
访问 [https://vercel.com](https://vercel.com)，使用以下方式之一注册/登录：
- **GitHub 账号登录（推荐）** - 可自动导入仓库
- GitLab 账号
- Bitbucket 账号
- Email

---

## 🎯 方法一：通过 Vercel Dashboard 部署（推荐）

### 步骤 1: 导入项目
1. 登录 Vercel Dashboard
2. 点击 **"Add New..."** → **"Project"**
3. 选择 **"Import Git Repository"**
4. 找到 `PicBatch` 仓库，点击 **"Import"**

### 步骤 2: 配置项目
Vercel 会自动检测到 Vite 项目，无需手动配置。确认以下设置：

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 18.x (推荐)
```

### 步骤 3: 部署
1. 点击 **"Deploy"** 按钮
2. 等待构建完成（约 1-2 分钟）
3. 构建成功后，Vercel 会提供：
   - 生产环境 URL: `https://pic-batch.vercel.app`
   - 预览 URL: `https://pic-batch-xxx.vercel.app`

### 步骤 4: 验证部署
访问生产环境 URL，测试以下功能：
- [ ] 上传图片
- [ ] 格式转换
- [ ] 压缩功能
- [ ] 裁剪功能
- [ ] 重命名功能
- [ ] ZIP 下载

---

## 🎯 方法二：通过 Vercel CLI 部署

### 安装 Vercel CLI
```bash
npm install -g vercel
```

### 登录 Vercel
```bash
vercel login
```

### 部署到生产环境
```bash
# 首次部署
vercel

# 后续部署到生产环境
vercel --prod
```

---

## ⚙️ 环境变量配置（可选）

如果项目需要环境变量，在 Vercel Dashboard 配置：

1. 进入项目 **Settings** → **Environment Variables**
2. 添加变量：
   ```
   Name: VITE_API_URL
   Value: https://api.example.com
   Scope: Production, Preview, Development
   ```
3. 重新部署以生效

---

## 🌐 自定义域名（可选）

### 步骤 1: 添加域名
1. 进入项目 **Settings** → **Domains**
2. 输入域名（如 `picbatch.com`）
3. 点击 **"Add"**

### 步骤 2: 配置 DNS
在域名提供商处添加以下记录：

#### A 记录方式
```
Type: A
Name: @
Value: 76.76.21.21
```

#### CNAME 方式（推荐）
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 步骤 3: 验证
等待 DNS 传播（通常 5-30 分钟），Vercel 会自动签发 SSL 证书。

---

## 🔄 自动部署设置

Vercel 已自动配置 GitHub 集成，实现：

- ✅ **main 分支** → 自动部署到生产环境
- ✅ **其他分支/PR** → 自动生成预览环境
- ✅ **每次 push** → 触发自动构建

### 禁用自动部署（如需要）
1. 进入 **Settings** → **Git**
2. 取消勾选 **"Production Branch"** 或 **"Preview Deployments"**

---

## 📊 部署后性能优化

### 1. 检查 Lighthouse 分数
访问 [PageSpeed Insights](https://pagespeed.web.dev/)，输入网站 URL，目标：
- Performance: ≥90
- Accessibility: ≥95
- Best Practices: ≥95
- SEO: ≥95

### 2. 监控错误日志
1. Vercel Dashboard → **Deployments** → 选择部署
2. 查看 **Build Logs** 和 **Runtime Logs**

### 3. 分析流量
1. Vercel Dashboard → **Analytics**
2. 查看访问量、地理分布、设备类型

---

## 🐛 常见问题

### Q1: 构建失败 - "npm install failed"
**解决方案**:
```bash
# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 提交更新后的 package-lock.json
git add package-lock.json
git commit -m "chore: Update package-lock"
git push
```

### Q2: 页面 404 错误
**原因**: SPA 路由配置问题  
**解决方案**: 确保 `vercel.json` 包含以下配置：
```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

### Q3: 资源加载失败 (CORS 错误)
**解决方案**: 在 `vercel.json` 添加 CORS 头：
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### Q4: 构建时间过长
**优化方案**:
- 启用缓存: Vercel 默认已启用
- 减少依赖: 检查 `package.json`，移除不必要的依赖
- 使用 `pnpm`: 更快的包管理器

### Q5: "Out of Memory" 错误
**解决方案**: 在 `vercel.json` 增加内存限制：
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist",
        "maxLambdaSize": "50mb"
      }
    }
  ]
}
```

---

## 📈 部署后清单

- [ ] 生产环境访问正常
- [ ] 所有功能测试通过
- [ ] 移动端适配完美
- [ ] Lighthouse 分数 ≥90
- [ ] 错误监控已启用
- [ ] 自定义域名配置（如有）
- [ ] README.md 更新部署链接
- [ ] 社交媒体分享卡片正常显示

---

## 🔗 相关链接

- **Vercel 文档**: https://vercel.com/docs
- **Vite 部署指南**: https://vitejs.dev/guide/static-deploy.html#vercel
- **项目仓库**: https://github.com/Charpentier-725/PicBatch
- **生产环境**: https://pic-batch.vercel.app

---

## 🎉 恭喜！

您的 PicBatch 项目已成功部署到 Vercel！

**下一步建议**:
1. 分享链接给用户收集反馈
2. 监控部署日志和性能指标
3. 继续开发 Version 1.2 功能
4. 考虑添加 PWA 支持

---

**有任何问题？** 提交 [GitHub Issue](https://github.com/Charpentier-725/PicBatch/issues)
