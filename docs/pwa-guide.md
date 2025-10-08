# 🌐 PWA 离线支持说明

## ✅ 已启用功能

### **离线缓存** 🚀
- ✅ Service Worker 自动注册
- ✅ 所有静态资源自动缓存
- ✅ 断网后仍可访问和使用
- ✅ 无需安装，打开即用

---

## 🎯 离线功能特点

### **轻量级设计**
- 📦 无需安装应用
- 🌐 纯网页体验
- ⚡ 首次访问后自动缓存
- 💾 缓存大小 < 3 MB

### **完整功能支持**
即使离线状态下，所有核心功能仍可正常使用：
- ✅ 上传本地图片
- ✅ 格式转换 (JPG/PNG/WebP/HEIC/SVG/GIF)
- ✅ 质量压缩
- ✅ 批量裁剪
- ✅ 批量重命名
- ✅ ZIP 打包下载

**原因**: 所有处理都在浏览器本地完成，无需网络连接！

---

## 🔧 技术实现

### **Service Worker 策略**
```javascript
缓存策略:
├─ HTML/CSS/JS: 预缓存 (构建时)
├─ 图标/字体: 预缓存
└─ Google Fonts: Cache First (1年)
```

### **缓存内容**
- 应用代码（HTML, CSS, JavaScript）
- UI 组件库
- 应用图标
- 字体文件

### **自动更新**
- 后台检测新版本
- 自动下载更新
- 下次访问时生效
- 或手动刷新页面 (Ctrl+R)

---

## 🧪 测试离线功能

### **方法一: 浏览器开发者工具**

1. 访问 https://pic-batch.vercel.app
2. 打开开发者工具 (F12)
3. Application > Service Workers
   - 确认状态为 "Activated and running"
4. Network 标签 > 选择 "Offline"
5. 刷新页面 (Ctrl+R)
6. 应用正常加载 ✅

### **方法二: 飞行模式**

1. 访问 https://pic-batch.vercel.app
2. 等待页面完全加载（首次访问）
3. 开启手机/电脑飞行模式
4. 刷新页面或重新打开标签页
5. 应用仍可正常使用 ✅

---

## 📊 缓存详情

### **预缓存文件 (23 个)**
```
总大小: ~2 MB (gzip 压缩后 ~550 KB)

├─ index.html (1.96 KB)
├─ CSS (28.81 KB)
├─ JavaScript chunks (1.99 MB)
├─ 图标 (30 KB)
└─ Web App Manifest (0.8 KB)
```

### **存储位置**
```
浏览器缓存:
- Chrome: Cache Storage API
- 路径: Application > Cache Storage
- 名称: workbox-precache-v2-*
```

---

## 🌐 浏览器支持

| 浏览器 | 离线支持 | 缓存功能 |
|--------|---------|---------|
| Chrome 90+ | ✅ 完美 | ✅ |
| Edge 90+ | ✅ 完美 | ✅ |
| Firefox 88+ | ✅ 完美 | ✅ |
| Safari 14+ | ✅ 完美 | ✅ |
| iOS Safari 14+ | ✅ 完美 | ✅ |
| 微信内置浏览器 | ✅ 支持 | ✅ |

---

## 💡 用户体验

### **首次访问**
1. 打开网站
2. Service Worker 在后台注册
3. 静态资源自动缓存（约3秒）
4. 完成！下次访问即可离线使用

### **后续访问**
- ⚡ 加载更快（从缓存读取）
- 🌐 离线可用
- 🔄 自动检查更新

---

## 🐛 故障排除

### **清除缓存**

如果遇到问题，可手动清除缓存：

1. **Chrome/Edge**
   - F12 > Application > Storage
   - 点击 "Clear site data"
   - 刷新页面重新缓存

2. **Firefox**
   - F12 > Storage
   - 右键 Cache Storage > 删除所有
   - 刷新页面

3. **Safari**
   - Develop > Empty Caches
   - 刷新页面

---

## 📋 FAQ

### **Q: 离线模式下能上传图片吗？**
A: ✅ 可以！选择本地文件即可，无需网络。

### **Q: 处理后的图片保存在哪？**
A: 下载到浏览器默认下载目录，与在线模式相同。

### **Q: 离线缓存会自动过期吗？**
A: 不会。缓存持久有效，除非手动清除或有新版本更新。

### **Q: 占用多少存储空间？**
A: 约 2-3 MB，非常轻量。

### **Q: 如何更新到最新版本？**
A: 刷新页面 (Ctrl+R)，Service Worker 会自动检测并更新。

---

## 🎊 总结

PicBatch 支持完整的离线功能：

✅ 轻量级（无需安装）  
✅ 离线可用（所有功能）  
✅ 自动缓存（首次访问后）  
✅ 自动更新（检测新版本）  
✅ 隐私安全（本地处理）  
✅ 跨平台（所有现代浏览器）  

**立即体验**: https://pic-batch.vercel.app

---

**技术支持**: [GitHub Issues](https://github.com/Charpentier-725/PicBatch/issues)
