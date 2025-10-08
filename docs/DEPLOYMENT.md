# PicBatch 部署与运维指南

---

## 一、Vercel 部署

### 1.1 部署方式

#### 方式一：通过 GitHub 集成 (推荐)

**步骤 1: 准备 Git 仓库**

```bash
# 初始化 Git (如果还没有)
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

**步骤 2: 在 Vercel 导入项目**

1. 访问 [vercel.com](https://vercel.com)
2. 点击 **"New Project"**
3. 选择 **"Import Git Repository"**
4. 选择你的 GitHub 仓库
5. 配置项目设置:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

**步骤 3: 部署**

点击 **"Deploy"** 按钮,Vercel 会自动:
- 安装依赖
- 运行构建
- 部署到全球 CDN

#### 方式二：通过 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 首次部署
vercel

# 4. 生产环境部署
vercel --prod
```

### 1.2 环境变量配置

在 Vercel Dashboard → Settings → Environment Variables 中配置:

```bash
# 可选配置
VITE_APP_NAME=轻图 PicBatch
VITE_APP_VERSION=1.0.0
VITE_MAX_FILE_SIZE=10485760  # 10MB
VITE_MAX_FILES=50
```

### 1.3 自定义域名

#### 添加域名

在 Vercel Dashboard → Settings → Domains 中添加自定义域名

#### 配置 DNS

在你的域名提供商处添加以下记录:

**A 记录 (推荐)**:
```
类型: A
名称: @
值: 76.76.21.21
```

**CNAME 记录 (备选)**:
```
类型: CNAME
名称: www
值: cname.vercel-dns.com
```

---

## 二、验证部署

### 2.1 功能测试

部署成功后,检查以下项:

- [ ] 上传图片功能正常
- [ ] 格式转换正常
- [ ] 压缩功能正常
- [ ] 下载功能正常
- [ ] 移动端显示正常

### 2.2 性能测试

运行 Lighthouse 测试:

```bash
# Chrome DevTools → Lighthouse
# 或使用 CLI
npm install -g lighthouse
lighthouse https://your-domain.vercel.app --view
```

**目标指标**:
- Performance: >90
- Accessibility: >95
- Best Practices: >95
- SEO: >95

### 2.3 浏览器兼容性

测试以下浏览器:
- [ ] Chrome (最新版)
- [ ] Edge (最新版)
- [ ] Safari (最新版)
- [ ] Firefox (最新版)
- [ ] 微信浏览器

---

## 三、监控和维护

### 3.1 Vercel Analytics

在 Vercel Dashboard 启用 Analytics 查看:
- 访问量统计
- 性能指标
- 用户地理分布

### 3.2 错误监控

查看 Vercel Dashboard → Logs 监控:
- 构建日志
- 运行时错误
- 请求日志

### 3.3 自动部署

GitHub 集成后,每次推送到 main 分支会自动触发部署:

```bash
git add .
git commit -m "Update features"
git push origin main
# Vercel 自动部署
```

### 3.4 回滚部署

如果需要回滚到之前的版本:

1. 访问 Vercel Dashboard → Deployments
2. 找到之前的成功部署
3. 点击 "..." → "Promote to Production"

---

## 四、性能优化

### 4.1 已启用的优化

**Brotli 压缩**: Vercel 默认启用,无需配置

**缓存策略**: 已在 `vercel.json` 配置
- 静态资源缓存 1 年
- HTML 文件不缓存

**CDN 加速**: Vercel 自动使用全球 CDN

### 4.2 构建优化

**代码分割**: 6 个优化 chunks

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['@radix-ui/react-...'],
          'vendor-image': ['browser-image-compression', 'heic2any'],
          'vendor-zip': ['jszip', 'file-saver'],
        }
      }
    }
  }
});
```

**构建结果**:
- 总大小: ~1.9MB
- Gzip 后: 535KB
- 最大 chunk: vendor-image (1.4MB)

---

## 五、搜索引擎优化 (SEO)

### 5.1 为什么要主动提交?

- ✅ 加快收录 (从 2-4 周缩短到 3-7 天)
- ✅ 监控数据 (查看搜索关键词、点击量)
- ✅ 优化建议 (搜索引擎提供的优化建议)
- ✅ 问题排查 (及时发现收录问题)

### 5.2 百度站长平台 (推荐国内用户)

#### 步骤 1: 注册并登录

1. 访问: https://ziyuan.baidu.com/
2. 使用百度账号登录

#### 步骤 2: 添加网站

1. 点击【用户中心】→【站点管理】
2. 点击【添加网站】
3. 输入: `https://pic-batch.vercel.app`
4. 选择网站类型: 【https】

#### 步骤 3: 验证网站所有权

**HTML 标签验证** (推荐):

1. 百度会给你一段代码:
   ```html
   <meta name="baidu-site-verification" content="codeva-XXXXXXXXXX" />
   ```

2. 添加到 `index.html` 的 `<head>` 中

3. 重新部署网站

4. 回到百度站长,点击【完成验证】

#### 步骤 4: 提交 Sitemap

1. 左侧菜单选择【数据引入】→【链接提交】
2. 选择【sitemap】
3. 输入: `https://pic-batch.vercel.app/sitemap.xml`
4. 点击【提交】

**预计收录时间**: 7-14 天

---

### 5.3 Google Search Console

#### 步骤 1: 注册并登录

1. 访问: https://search.google.com/search-console
2. 使用 Google 账号登录

#### 步骤 2: 添加资源

1. 点击左上角【添加资源】
2. 选择【网址前缀】
3. 输入: `https://pic-batch.vercel.app`

#### 步骤 3: 验证所有权

**HTML 标记验证** (推荐):

1. Google 会给你一段代码:
   ```html
   <meta name="google-site-verification" content="xxx-YYYYYYYYYY" />
   ```

2. 添加到 `index.html` 的 `<head>` 中

3. 重新部署

4. 回到 Google,点击【验证】

#### 步骤 4: 提交 Sitemap

1. 左侧菜单选择【站点地图】
2. 输入: `sitemap.xml` (只需要文件名)
3. 点击【提交】

#### 步骤 5: 请求编入索引

1. 左侧菜单选择【网址检查】
2. 输入: `https://pic-batch.vercel.app`
3. 点击【请求编入索引】

**预计收录时间**: 3-7 天

---

### 5.4 必应站长工具 (Bing Webmaster)

#### 步骤 1: 注册并登录

1. 访问: https://www.bing.com/webmasters
2. 使用 Microsoft 账号登录

#### 步骤 2: 添加网站

1. 点击【添加网站】
2. 输入: `https://pic-batch.vercel.app`
3. 填写网站信息:
   - 网站名称: 轻图 PicBatch
   - 主要语言: 中文

#### 步骤 3: 验证所有权

**HTML 标记验证**:

1. Bing 会给你一段代码:
   ```html
   <meta name="msvalidate.01" content="XXXXXXXXXX" />
   ```

2. 添加到 `index.html`

3. 重新部署

4. 点击【验证】

#### 步骤 4: 提交 Sitemap

1. 左侧菜单选择【站点地图】
2. 输入: `https://pic-batch.vercel.app/sitemap.xml`
3. 点击【提交】

**预计收录时间**: 3-7 天

---

### 5.5 SEO 优先级

| 搜索引擎 | 国内用户 | 国外用户 | 预计时间 |
|---------|---------|---------|---------|
| 百度     | ⭐⭐⭐⭐⭐ 必须 | 可选 | 7-14天 |
| Google   | ⭐⭐⭐⭐ 建议 | ⭐⭐⭐⭐⭐ 必须 | 3-7天 |
| Bing     | ⭐⭐⭐ 可选 | ⭐⭐⭐⭐ 建议 | 3-7天 |

---

## 六、常见问题

### Q: 部署失败怎么办?

**A**: 检查以下项
1. 查看 Vercel 构建日志
2. 确认 `package.json` 依赖完整
3. 本地运行 `npm run build` 验证
4. 检查 Node.js 版本 (推荐 18+)

### Q: 图片处理失败?

**A**: 浏览器兼容性问题
- 确保使用现代浏览器
- 检查 HEIC 格式是否需要 polyfill
- 查看浏览器控制台错误

### Q: 如何更新部署?

**A**: 两种方式
1. Git 推送自动部署
2. `vercel --prod` 手动部署

### Q: 搜索引擎多久能收录?

**A**: 收录时间
- 百度: 通常 1-2 周
- Google: 通常 3-7 天
- 首页通常比内页更快收录

---

## 七、成本估算

### Vercel 免费套餐包含:

- ✅ 无限部署
- ✅ 100GB 带宽/月
- ✅ HTTPS 自动配置
- ✅ 全球 CDN
- ✅ 自动 CI/CD

**对于 PicBatch 项目完全够用!**

---

## 八、部署清单

部署前确认:

- [ ] 代码已提交到 Git
- [ ] `npm run build` 本地构建成功
- [ ] `vercel.json` 配置正确
- [ ] README.md 更新完整
- [ ] 环境变量已配置
- [ ] 测试所有核心功能
- [ ] 移动端测试通过
- [ ] SEO 元数据已配置

---

## 九、应急预案

### 9.1 生产环境故障

**检查清单**:
1. 访问 Vercel Status: https://www.vercel-status.com
2. 查看 Deployment Logs
3. 回滚到上一个稳定版本
4. 联系 Vercel 支持

### 9.2 性能降级

**处理步骤**:
1. 检查 Vercel Analytics
2. 查看带宽使用情况
3. 优化静态资源
4. 考虑升级套餐

---

**最后更新**: 2025-10-08
**部署状态**: ✅ 已成功部署
**生产地址**: https://pic-batch.vercel.app
