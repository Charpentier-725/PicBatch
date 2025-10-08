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

## 二、Cloudflare Pages 部署（国内访问优化）

### 2.1 为什么选择 Cloudflare Pages?

**优势对比**:

| 特性 | Cloudflare Pages | Vercel | 阿里云 OSS |
|------|-----------------|--------|-----------|
| 价格 | ✅ 完全免费 | ✅ 免费额度 | 💰 按量付费 |
| 国内访问 | ⭐⭐⭐⭐ 较好 | ⭐⭐ 需翻墙 | ⭐⭐⭐⭐⭐ 最快 |
| ICP备案 | ❌ 不需要 | ❌ 不需要 | ✅ 必须 |
| 自动部署 | ✅ 支持 | ✅ 支持 | ❌ 不支持 |
| CDN | ✅ 全球+中国 | ✅ 全球 | ✅ 中国 |

**推荐场景**: 国内用户访问，不想备案，完全免费

---

### 2.2 部署步骤（详细图文）

#### 步骤 1: 注册 Cloudflare 账号

1. 访问: https://dash.cloudflare.com/sign-up
2. 填写邮箱和密码（完全免费，无需信用卡）
3. 验证邮箱（检查收件箱点击确认链接）

#### 步骤 2: 连接 GitHub 仓库

1. 登录 Cloudflare Dashboard
2. 左侧菜单选择 **Workers & Pages**
3. 点击右上角 **Create application** 按钮
4. 选择 **Pages** 标签
5. 点击 **Connect to Git** 按钮
6. 选择 **GitHub**，点击授权按钮
7. 在弹出窗口选择授权范围（建议选择特定仓库）
8. 选择仓库: `Charpentier-725/PicBatch`

#### 步骤 3: 配置构建设置（重要！）

**在哪里配置？**
连接 GitHub 仓库后，会自动跳转到"设置构建配置"页面。如果没跳转，在项目页面点击 **Settings** → **Build & deployments**。

---

**① 基本配置区域**（页面顶部）:

找到 **"Set up builds and deployments"** 区域，填写：

| 字段 | 在哪里 | 填什么 | 说明 |
|------|--------|--------|------|
| **Project name** | 第一个输入框 | `picbatch` | 网址会是 `picbatch.pages.dev`，可自定义 |
| **Production branch** | 下拉选择框 | `main` | 选择主分支（默认已选好） |

**截图位置示例**：
```
┌─────────────────────────────────────┐
│ Project name: [picbatch________]    │  ← 在这里输入项目名
│ Production branch: [main ▼]         │  ← 确认是 main 分支
└─────────────────────────────────────┘
```

---

**② 构建设置区域**（页面中部）:

找到 **"Build settings"** 区域，配置如下：

| 字段 | 在哪里 | 填什么 | 为什么 |
|------|--------|--------|--------|
| **Framework preset** | 下拉框 | 选择 `Vite` 或 `None` | Vite 会自动填充命令，None 需要手动填 |
| **Build command** | 输入框 | `npm run build` | 构建生产版本的命令 |
| **Build output directory** | 输入框 | `dist` | Vite 默认输出目录 |
| **Root directory (optional)** | 输入框 | 留空或 `/` | 项目根目录，默认就好 |

**⚠️ 重点：Build output directory 必须是 `dist`！**

**截图位置示例**：
```
┌─────────────────────────────────────────┐
│ Build settings                          │
│                                         │
│ Framework preset: [Vite ▼]             │  ← 选择 Vite（或 None）
│                                         │
│ Build command:                          │
│ [npm run build_________________]        │  ← 输入这个命令
│                                         │
│ Build output directory:                 │
│ [dist___________________________]        │  ← 必须是 dist！
│                                         │
│ Root directory (optional):              │
│ [/_____________________________]         │  ← 保持默认
└─────────────────────────────────────────┘
```

---

**③ 环境变量区域**（可选，在页面底部）:

找到 **"Environment variables"** 区域，点击 **"Add variable"** 按钮：

**如何添加环境变量：**

1. 点击 **"+ Add variable"** 按钮
2. 会出现两个输入框：

| 字段 | 填什么 |
|------|--------|
| **Variable name** | `NODE_VERSION` |
| **Value** | `18` |

3. 点击变量右侧的 **"Add"** 按钮保存

**截图位置示例**：
```
┌─────────────────────────────────────────┐
│ Environment variables (optional)        │
│                                         │
│ [+ Add variable]  ← 点击这个按钮         │
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ Variable name: [NODE_VERSION_____] ││  ← 输入变量名
│ │ Value:        [18_________________] ││  ← 输入值
│ │                           [Add]     ││  ← 点击保存
│ └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

**为什么要设置 NODE_VERSION=18？**
- 确保使用 Node.js 18 版本构建
- 避免版本不兼容导致构建失败

---

**完整配置示例（复制粘贴用）：**

```
【基本配置】
Project name: picbatch
Production branch: main

【构建设置】
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: /

【环境变量】
NODE_VERSION = 18
```

---

**配置完成后的操作：**

1. **检查所有配置**（特别是 `dist` 目录）
2. 滚动到页面底部
3. 点击 **"Save and Deploy"** 大按钮
4. 等待 2-3 分钟，构建完成！

#### 步骤 4: 开始部署

1. 检查所有配置无误
2. 点击底部 **Save and Deploy** 按钮
3. 等待构建完成（约 2-3 分钟）
4. 构建成功后会自动跳转到项目页面
5. 你的网站地址：`https://picbatch.pages.dev`

#### 步骤 5: 自定义域名（可选）

**如果你有自己的域名**:

1. 在项目页面点击 **Custom domains** 标签
2. 点击 **Set up a custom domain** 按钮
3. 输入域名（如 `www.picbatch.cn`）
4. 按照提示配置 DNS:

**域名在 Cloudflare 托管**:
- 自动添加 CNAME 记录，无需手动操作

**域名在其他服务商**:
- 添加 CNAME 记录:
  ```
  类型: CNAME
  名称: www
  目标: picbatch.pages.dev
  TTL: Auto
  ```

---

### 2.3 自动部署流程

**Git 集成后的自动化**:

每次推送代码到 `main` 分支，Cloudflare 会自动:
1. 拉取最新代码
2. 安装依赖 (`npm install`)
3. 运行构建 (`npm run build`)
4. 部署到全球 CDN
5. 发送部署通知

**示例流程**:
```bash
# 本地开发
git add .
git commit -m "Add new feature"
git push origin main

# Cloudflare Pages 自动构建部署
# 1-2分钟后新版本上线
```

**查看部署状态**:
- Dashboard → Workers & Pages → picbatch → Deployments
- 每次部署都有独立 URL，可以预览

---

### 2.4 环境变量管理

**添加环境变量**:

1. 进入项目 Settings → Environment variables
2. 选择环境类型（Production / Preview）
3. 添加变量:

**生产环境（Production）**:
```bash
VITE_APP_NAME=轻图 PicBatch
VITE_APP_VERSION=1.0.0
VITE_MAX_FILE_SIZE=10485760
VITE_MAX_FILES=50
```

4. 点击 **Save**
5. 触发重新部署以生效

---

### 2.5 性能优化配置

#### Cloudflare 自动优化（已启用）

**压缩**:
- ✅ Brotli 压缩（自动）
- ✅ Gzip 压缩（自动）
- ✅ Auto Minify（HTML/CSS/JS）

**加速**:
- ✅ HTTP/3 & QUIC（最新协议）
- ✅ 全球 CDN（300+ 节点）
- ✅ 智能路由（自动选择最快节点）

**安全**:
- ✅ 自动 HTTPS（Let's Encrypt）
- ✅ DDoS 防护
- ✅ Bot 防护

#### 缓存策略

Cloudflare 默认缓存策略:
```
HTML: 不缓存（始终获取最新）
CSS/JS: 缓存 1 年（文件名带 hash）
图片/字体: 缓存 1 年
```

**自定义缓存规则**（可选）:
- 进入项目 → Settings → Functions
- 添加 `_headers` 文件到 `public/` 目录:
  ```
  /assets/*
    Cache-Control: public, max-age=31536000, immutable

  /*.html
    Cache-Control: no-cache
  ```

---

### 2.6 部署管理

#### 版本回滚

**快速回滚到旧版本**:

1. Deployments 标签查看历史部署
2. 找到稳定版本
3. 点击 **⋯** → **Rollback to this deployment**
4. 确认后立即生效（不到 1 分钟）

#### 预览部署

**每个 Pull Request 自动创建预览**:

1. 在 GitHub 创建 PR
2. Cloudflare 自动构建预览版本
3. PR 中显示预览链接
4. 测试通过后合并到 main

---

### 2.7 国内访问优化

#### Cloudflare 中国网络

**免费版已包含部分中国节点**:
- 自动使用最近的 CDN 节点
- 国内访问速度通常 < 500ms

**测试国内访问速度**:
```bash
# Windows
ping picbatch.pages.dev

# 或使用 curl 测试响应时间
curl -o NUL -s -w "Time: %{time_total}s\n" https://picbatch.pages.dev
```

#### 进一步优化（可选）

**方案 1: Argo Smart Routing**（付费）
- 费用: $5/月
- 智能路由，速度提升 30%

**方案 2: 自定义域名 + ICP 备案**
- 使用 `.cn` 域名
- 完成 ICP 备案
- 访问速度最优

---

### 2.8 双平台部署策略

**部署完成后你将拥有两个生产环境**:

| 平台 | 域名 | 国内访问 | 推荐用途 |
|------|------|---------|---------|
| Vercel | https://pic-batch.vercel.app | ❌ 需翻墙 | 国外用户、开发预览 |
| Cloudflare | https://picbatch.pages.dev | ✅ 可访问 | 国内用户、主要流量 |

**SEO 建议**:
- 选择 Cloudflare Pages 作为主域名
- 在 Google/Bing 提交 Cloudflare 域名
- Vercel 域名作为备用

**流量分配**:
- 国内用户 → Cloudflare Pages
- 国外用户 → Cloudflare Pages（全球 CDN）
- 或统一使用 Cloudflare Pages

---

### 2.9 故障排查

#### 问题 1: 构建失败

**症状**: 部署页面显示 "Build failed"

**排查步骤**:
1. 点击查看构建日志（Deployment details）
2. 检查错误信息（通常是依赖或命令问题）
3. 本地测试: `npm install && npm run build`
4. 确认 Node.js 版本: 添加环境变量 `NODE_VERSION=18`

**常见错误**:
```bash
# 错误: 依赖安装失败
解决: 删除 package-lock.json，重新 push

# 错误: 构建超时
解决: 优化构建配置，移除不必要的依赖
```

#### 问题 2: 部署成功但访问 404

**症状**: 页面显示 404 Not Found

**解决方案**:
1. 确认 **Build output directory** 是 `dist`（不是 `build` 或其他）
2. 检查构建日志，确认 `dist` 目录有文件
3. 添加 SPA 路由支持（如使用 React Router）:
   - 在 `public/` 目录创建 `_redirects` 文件:
     ```
     /*    /index.html   200
     ```

#### 问题 3: 国内访问仍然慢

**优化方案**:
1. 使用 Cloudflare DNS（自动优化路由）
2. 开启 **Argo Smart Routing**（$5/月，速度提升 30%）
3. 使用自定义域名（避免 `.pages.dev` 可能的限制）
4. 极致性能需求：部署到阿里云 OSS + CDN（需备案）

#### 问题 4: 图片处理失败

**症状**: 上传图片后无法处理

**检查清单**:
- ✅ 浏览器控制台是否有错误
- ✅ 确认使用现代浏览器（Chrome 90+）
- ✅ HEIC 格式需要 polyfill（已包含在项目中）
- ✅ 检查文件大小限制（默认 10MB）

---

### 2.10 成本估算

**Cloudflare Pages 免费套餐包含**:

✅ **无限制功能**:
- 静态资源请求: 无限
- 带宽流量: 无限
- 自定义域名: 100 个
- SSL 证书: 自动续期

✅ **限制额度**（对 PicBatch 足够）:
- 构建次数: 500 次/月
- 构建时长: 20 分钟/次
- 并发构建: 1 个

✅ **免费附赠**:
- 全球 CDN（300+ 节点）
- DDoS 防护
- Web 应用防火墙（WAF）
- 分析统计

**总成本: ¥0/年** 💰

**对比 Vercel 免费套餐**:
- Vercel: 100GB 带宽/月
- Cloudflare: 无限带宽
- **Cloudflare 更划算！**

---

### 2.11 部署清单

#### 部署前检查

- [ ] GitHub 仓库准备完毕
- [ ] 代码已推送到 `main` 分支
- [ ] 本地构建测试通过: `npm run build`
- [ ] Cloudflare 账号已注册并验证邮箱
- [ ] 确认构建配置:
  - ✅ Build command: `npm run build`
  - ✅ Output directory: `dist`
  - ✅ Node version: 18

#### 部署后验证

- [ ] 访问 `https://picbatch.pages.dev` 成功
- [ ] **国内不翻墙测试访问**（重要！）
- [ ] 核心功能测试:
  - [ ] 图片上传
  - [ ] 格式转换
  - [ ] 图片压缩
  - [ ] 批量下载
- [ ] 移动端测试（Chrome 手机模式）
- [ ] 性能测试（Lighthouse > 90）
- [ ] 自动部署流程测试:
  - [ ] 推送代码 → 自动构建 → 自动上线

#### SEO 配置（部署后）

- [ ] 提交新域名到 Google Search Console
- [ ] 提交新域名到 Bing Webmaster
- [ ] 更新 sitemap.xml（如有多个域名）
- [ ] 配置主域名（Canonical URL）

---

## 三、验证部署

### 3.1 功能测试

部署成功后,检查以下项:

- [ ] 上传图片功能正常
- [ ] 格式转换正常
- [ ] 压缩功能正常
- [ ] 下载功能正常
- [ ] 移动端显示正常

### 3.2 性能测试

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

### 3.3 浏览器兼容性

测试以下浏览器:
- [ ] Chrome (最新版)
- [ ] Edge (最新版)
- [ ] Safari (最新版)
- [ ] Firefox (最新版)
- [ ] 微信浏览器

---

## 四、监控和维护

### 4.1 Vercel Analytics

在 Vercel Dashboard 启用 Analytics 查看:
- 访问量统计
- 性能指标
- 用户地理分布

### 4.2 错误监控

查看 Vercel Dashboard → Logs 监控:
- 构建日志
- 运行时错误
- 请求日志

### 4.3 自动部署

GitHub 集成后,每次推送到 main 分支会自动触发部署:

```bash
git add .
git commit -m "Update features"
git push origin main
# Vercel 自动部署
```

### 4.4 回滚部署

如果需要回滚到之前的版本:

1. 访问 Vercel Dashboard → Deployments
2. 找到之前的成功部署
3. 点击 "..." → "Promote to Production"

---

## 五、性能优化

### 5.1 已启用的优化

**Brotli 压缩**: Vercel 默认启用,无需配置

**缓存策略**: 已在 `vercel.json` 配置
- 静态资源缓存 1 年
- HTML 文件不缓存

**CDN 加速**: Vercel 自动使用全球 CDN

### 5.2 构建优化

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

## 六、搜索引擎优化 (SEO)

### 6.1 为什么要主动提交?

- ✅ 加快收录 (从 2-4 周缩短到 3-7 天)
- ✅ 监控数据 (查看搜索关键词、点击量)
- ✅ 优化建议 (搜索引擎提供的优化建议)
- ✅ 问题排查 (及时发现收录问题)

### 6.2 百度站长平台 (推荐国内用户)

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

### 6.3 Google Search Console

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

### 6.4 必应站长工具 (Bing Webmaster)

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

### 6.5 SEO 优先级

| 搜索引擎 | 国内用户 | 国外用户 | 预计时间 |
|---------|---------|---------|---------|
| 百度     | ⭐⭐⭐⭐⭐ 必须 | 可选 | 7-14天 |
| Google   | ⭐⭐⭐⭐ 建议 | ⭐⭐⭐⭐⭐ 必须 | 3-7天 |
| Bing     | ⭐⭐⭐ 可选 | ⭐⭐⭐⭐ 建议 | 3-7天 |

---

## 七、常见问题

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

## 八、成本估算

### Vercel 免费套餐包含:

- ✅ 无限部署
- ✅ 100GB 带宽/月
- ✅ HTTPS 自动配置
- ✅ 全球 CDN
- ✅ 自动 CI/CD

**对于 PicBatch 项目完全够用!**

---

## 九、部署清单

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

## 十、应急预案

### 10.1 生产环境故障

**检查清单**:
1. 访问 Vercel Status: https://www.vercel-status.com
2. 查看 Deployment Logs
3. 回滚到上一个稳定版本
4. 联系 Vercel 支持

### 10.2 性能降级

**处理步骤**:
1. 检查 Vercel Analytics
2. 查看带宽使用情况
3. 优化静态资源
4. 考虑升级套餐

---

**最后更新**: 2025-10-08
**部署状态**: ✅ 已成功部署
**生产地址**: https://pic-batch.vercel.app
