# 📚 PicBatch 文档中心

欢迎来到 PicBatch 项目文档！本目录包含项目的完整技术文档和产品资料。

## 📖 核心文档

### [PRODUCT.md](PRODUCT.md)
**产品需求与设计系统**

包含内容：
- 产品需求文档 (PRD)
- Morandi 设计系统
- UI 界面设计规范
- 颜色、字体、间距等设计 token

**适合阅读人群**：产品经理、设计师、前端开发者

---

### [ARCHITECTURE.md](ARCHITECTURE.md)
**技术架构与实现方案**

包含内容：
- 技术栈选型（React 19 + Vite 7 + TypeScript 5.6）
- 系统架构设计
- 图片处理技术方案
- 核心代码示例
- 性能优化策略

**适合阅读人群**：技术负责人、架构师、开发工程师

---

### [DEVELOPMENT.md](DEVELOPMENT.md)
**开发指南与项目管理**

包含内容：
- 8 阶段开发路线图
- MVP 1.0 项目总结
- 最终交付清单
- 代码规范与 Git 提交规范
- 常见开发问题排查

**适合阅读人群**：开发工程师、项目经理

---

### [DEPLOYMENT.md](DEPLOYMENT.md)
**部署运维与 SEO 优化**

包含内容：
- Vercel 部署步骤（GitHub 集成 + CLI）
- 环境变量配置
- 自定义域名设置
- SEO 提交指南（Baidu、Google、Bing）
- 性能监控与错误日志

**适合阅读人群**：运维工程师、全栈开发者

---

### [USER_GUIDE.md](USER_GUIDE.md)
**用户使用指南**

包含内容：
- 3 步快速上手教程
- 支持的文件格式
- 常见使用场景
- FAQ 常见问题

**适合阅读人群**：终端用户、客服人员

---

## 📦 版本迭代文档

### [versions/v1.1/](versions/v1.1/)
**Version 1.1 批量裁剪与重命名**

- [plan.md](versions/v1.1/plan.md) - 功能规划
- [release.md](versions/v1.1/release.md) - 发布说明（英文）
- [testing.md](versions/v1.1/testing.md) - 测试清单

**新增功能**：
- 批量裁剪（1:1、16:9、4:3、3:2、自定义）
- 批量重命名（前缀/后缀 + 序号）
- 智能压缩
- IndexedDB 历史记录

---

### [versions/v1.2/](versions/v1.2/)
**Version 1.2 微信小程序版本**

- [plan.md](versions/v1.2/plan.md) - 功能规划
- [guide.md](versions/v1.2/guide.md) - 实施指南
- [progress.md](versions/v1.2/progress.md) - 开发进度

**计划功能**：
- 使用 Taro 框架开发微信小程序
- Monorepo 架构（packages/web、packages/miniprogram、packages/shared）
- 代码共享策略
- 平台特定适配

**当前进度**：25%

---

## 🗂️ 归档文档

以下文档记录了项目的重要里程碑和参考资料：

- [deployment-success.md](deployment-success.md) - Vercel 部署成功记录
- [project-summary.md](project-summary.md) - 项目总结报告
- [git-workflow.md](git-workflow.md) - Git 工作流程指南
- [pwa-guide.md](pwa-guide.md) - PWA 离线支持方案

---

## 🔍 如何使用本文档

### 📌 快速导航

| 你想了解... | 推荐阅读 |
|------------|----------|
| 产品功能和设计理念 | [PRODUCT.md](PRODUCT.md) |
| 技术架构和实现细节 | [ARCHITECTURE.md](ARCHITECTURE.md) |
| 如何开始开发 | [DEVELOPMENT.md](DEVELOPMENT.md) |
| 如何部署到生产环境 | [DEPLOYMENT.md](DEPLOYMENT.md) |
| 如何使用这个工具 | [USER_GUIDE.md](USER_GUIDE.md) |
| 版本更新内容 | [versions/](versions/) |

### 🎯 按角色阅读

**产品经理**：
1. [PRODUCT.md](PRODUCT.md) - 了解产品定位和功能
2. [USER_GUIDE.md](USER_GUIDE.md) - 理解用户体验
3. [versions/](versions/) - 查看版本迭代计划

**技术负责人**：
1. [ARCHITECTURE.md](ARCHITECTURE.md) - 评估技术方案
2. [DEVELOPMENT.md](DEVELOPMENT.md) - 查看开发进度
3. [DEPLOYMENT.md](DEPLOYMENT.md) - 了解部署架构

**前端开发者**：
1. [DEVELOPMENT.md](DEVELOPMENT.md) - 熟悉开发规范
2. [ARCHITECTURE.md](ARCHITECTURE.md) - 理解代码架构
3. [PRODUCT.md](PRODUCT.md) - 了解设计系统

**运维工程师**：
1. [DEPLOYMENT.md](DEPLOYMENT.md) - 部署和监控
2. [ARCHITECTURE.md](ARCHITECTURE.md) - 了解技术栈
3. [git-workflow.md](git-workflow.md) - Git 工作流

---

## 📝 文档维护

### 文档更新规范

- **所有文档使用 Markdown 格式**
- **文件名使用大写（核心文档）或小写（归档文档）**
- **每次更新功能时同步更新相关文档**
- **版本文档放在 `versions/vX.X/` 目录下**

### 贡献指南

如果你发现文档中的错误或希望补充内容：

1. Fork 本项目
2. 修改对应的 Markdown 文件
3. 提交 Pull Request
4. 在 PR 中说明修改原因

---

## 🔗 外部链接

- **项目主页**：[README.md](../README.md)
- **变更日志**：[CHANGELOG.md](../CHANGELOG.md)
- **GitHub 仓库**：https://github.com/Charpentier-725/PicBatch
- **在线演示**：https://pic-batch.vercel.app
- **问题反馈**：https://github.com/Charpentier-725/PicBatch/issues

---

## ❓ 常见问题

**Q: 如何快速了解项目？**
A: 按顺序阅读：[PRODUCT.md](PRODUCT.md) → [ARCHITECTURE.md](ARCHITECTURE.md) → [DEVELOPMENT.md](DEVELOPMENT.md)

**Q: 我只想部署项目，应该看哪个文档？**
A: 直接阅读 [DEPLOYMENT.md](DEPLOYMENT.md)

**Q: 如何参与项目开发？**
A: 阅读 [DEVELOPMENT.md](DEVELOPMENT.md)，了解开发规范和 Git 工作流

**Q: 版本 1.2 什么时候发布？**
A: 查看 [versions/v1.2/progress.md](versions/v1.2/progress.md) 了解最新进度

---

<p align="center">
  <strong>📖 文档持续更新中...</strong><br>
  最后更新时间：2025-10-08
</p>
