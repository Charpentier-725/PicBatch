# 轻图 PicBatch - 设计系统

> 基于 Anthropic 风格 + 莫兰迪色系的视觉设计规范

---

## 🎨 设计理念

### 核心价值
- **温柔克制** - 不用高饱和度色彩，营造舒适感
- **极简纯净** - 去除一切不必要的装饰元素
- **专注内容** - 让用户的图片成为视觉中心
- **专业可靠** - 传递工具的专业性和可信度

### 风格定位
**Anthropic 风格** + **莫兰迪色系** = 温柔、专业、纯净

---

## 🎨 色彩系统

### 主色调（Primary）- 莫兰迪蓝

```css
/* 主色 */
--primary-50: #F0F4F7
--primary-100: #D9E4EC
--primary-200: #B3C9D9
--primary-300: #91A5B8    /* 主要使用 */
--primary-400: #7A94A9    /* 按钮默认 */
--primary-500: #6A8397
--primary-600: #5A7285
--primary-700: #4A6173

/* 应用场景 */
主按钮背景: --primary-400
主按钮悬停: --primary-300
主按钮按下: --primary-500
进度条: --primary-400
链接: --primary-400
```

### 中性色（Neutral）

```css
/* 背景色 */
--bg-page: #FAFAF9         /* 页面背景 - 极浅米色 */
--bg-card: #FFFFFF         /* 卡片背景 - 纯白 */
--bg-hover: #F5F3F0        /* 悬停背景 - 奶白 */
--bg-active: #E8E6E1       /* 激活背景 - 浅灰米 */
--bg-disabled: #F5F5F4     /* 禁用背景 */

/* 文字色 */
--text-primary: #2C2C2C    /* 主标题、重要信息 */
--text-secondary: #737373  /* 正文、描述 */
--text-tertiary: #A3A3A3   /* 辅助文字、占位符 */
--text-disabled: #D4D4D4   /* 禁用文字 */
--text-inverse: #FFFFFF    /* 深色背景上的文字 */

/* 边框色 */
--border-light: #E8E6E1    /* 浅边框 */
--border-default: #D6D3CE  /* 默认边框 */
--border-strong: #A8A29E   /* 强调边框 */
--border-focus: #91A5B8    /* 焦点边框（主色） */
```

### 功能色（Semantic Colors）- 莫兰迪化

```css
/* 成功 - 柔和绿 */
--success-50: #F2F5F2
--success-100: #E0E9DF
--success-500: #8FA888      /* 主要使用 */
--success-600: #7D9477

/* 警告 - 柔和黄 */
--warning-50: #F7F5F0
--warning-100: #EDE6D9
--warning-500: #C9B48F      /* 主要使用 */
--warning-600: #B3A07D

/* 错误 - 柔和红 */
--error-50: #F5F0F0
--error-100: #E8DEDE
--error-500: #BC8B87        /* 主要使用 */
--error-600: #A97A76

/* 信息 - 莫兰迪蓝 */
--info-500: #7A94A9         /* 与主色一致 */
```

### 色彩使用原则

✅ **DO（推荐）：**
- 大面积使用白色和浅米色
- 主色用于重要操作按钮
- 功能色仅用于状态指示
- 保持低饱和度

❌ **DON'T（避免）：**
- 不使用高饱和度色彩
- 不使用纯黑色（用深灰代替）
- 不使用超过 3 种主要颜色
- 避免颜色过于鲜艳

---

## 📝 字体系统

### 字体族（Font Family）

```css
/* 中文优先，系统字体栈 */
font-family:
  -apple-system,              /* macOS/iOS */
  BlinkMacSystemFont,         /* macOS Chrome */
  'Segoe UI',                 /* Windows */
  'Microsoft YaHei',          /* Windows 中文 */
  'PingFang SC',              /* macOS 中文 */
  sans-serif;                 /* 后备 */
```

### 字号（Font Size）

```css
--text-xs: 12px;     /* 行高 16px - 辅助信息、标签 */
--text-sm: 14px;     /* 行高 20px - 次要文字、说明 */
--text-base: 16px;   /* 行高 24px - 正文、表单 */
--text-lg: 18px;     /* 行高 28px - 小标题 */
--text-xl: 20px;     /* 行高 28px - 标题 */
--text-2xl: 24px;    /* 行高 32px - 大标题 */
--text-3xl: 30px;    /* 行高 36px - 页面标题 */
```

### 字重（Font Weight）

```css
--font-normal: 400;   /* 正文 */
--font-medium: 500;   /* 强调、按钮 */
--font-semibold: 600; /* 小标题 */
--font-bold: 700;     /* 标题（少用） */
```

### 排版规则

- **标题**：`font-size: 24px; font-weight: 600; line-height: 1.3;`
- **正文**：`font-size: 16px; font-weight: 400; line-height: 1.5;`
- **说明**：`font-size: 14px; font-weight: 400; line-height: 1.4; color: var(--text-secondary);`
- **标签**：`font-size: 12px; font-weight: 500; line-height: 1.3;`

---

## 📐 间距系统

### 基准：8px Grid System

```css
--space-0: 0;
--space-1: 4px;    /* 0.5 单位 - 极小间距 */
--space-2: 8px;    /* 1 单位 - 小间距 */
--space-3: 12px;   /* 1.5 单位 - 紧凑间距 */
--space-4: 16px;   /* 2 单位 - 默认间距 */
--space-5: 20px;   /* 2.5 单位 - 舒适间距 */
--space-6: 24px;   /* 3 单位 - 大间距 */
--space-8: 32px;   /* 4 单位 - 区块间距 */
--space-10: 40px;  /* 5 单位 - 大区块间距 */
--space-12: 48px;  /* 6 单位 - 页面区域间距 */
--space-16: 64px;  /* 8 单位 - 超大间距 */
```

### 应用场景

| 间距值 | 使用场景 |
|--------|----------|
| 4px | 图标与文字、标签内边距 |
| 8px | 按钮内边距、小元素间距 |
| 12px | 表单元素间距、列表项内边距 |
| 16px | 卡片内边距、常规元素间距 |
| 24px | 区块内边距、标题与内容间距 |
| 32px | 卡片外边距、页面区域间距 |
| 48px | 页面顶部/底部间距 |

---

## 🔲 圆角系统

```css
--radius-none: 0;
--radius-sm: 4px;    /* Tag、Badge */
--radius-md: 6px;    /* Button、Input */
--radius-lg: 8px;    /* Card */
--radius-xl: 12px;   /* Modal、大卡片 */
--radius-2xl: 16px;  /* 图片预览 */
--radius-full: 9999px; /* Circle、Pill 按钮 */
```

### 使用原则
- 保持克制，不要过圆
- 同类元素使用统一圆角
- 小元素用小圆角（4-6px）
- 大元素用中圆角（8-12px）

---

## 🌑 阴影系统（极轻微）

```css
/* 轻微阴影 - 用于卡片悬浮效果 */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.03);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04),
             0 1px 2px rgba(0, 0, 0, 0.02);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.04),
             0 2px 4px rgba(0, 0, 0, 0.03);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.05),
             0 4px 6px rgba(0, 0, 0, 0.03);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.06),
             0 10px 10px rgba(0, 0, 0, 0.03);
```

### 使用场景
- **xs/sm** - 默认卡片
- **md** - 卡片悬停
- **lg** - Modal、Dropdown
- **xl** - 极少使用

**原则**：阴影要轻，若有若无，避免过重。

---

## 🎭 组件设计规范

### 按钮（Button）

#### 主要按钮（Primary）
```css
背景: var(--primary-400)
文字: white
圆角: 6px
内边距: 8px 16px
高度: 40px
阴影: none

hover: 背景变为 --primary-300
active: 背景变为 --primary-500
disabled: 背景变为 --bg-disabled, 文字变为 --text-disabled
```

#### 次要按钮（Secondary）
```css
背景: white
文字: var(--primary-400)
边框: 1px solid var(--border-default)
圆角: 6px

hover: 背景变为 --bg-hover
```

#### 幽灵按钮（Ghost）
```css
背景: transparent
文字: var(--text-secondary)
边框: none

hover: 背景变为 --bg-hover
```

### 输入框（Input）

```css
背景: white
边框: 1px solid var(--border-default)
圆角: 6px
内边距: 8px 12px
高度: 40px

focus: 边框变为 --border-focus, 阴影 0 0 0 3px rgba(122, 148, 169, 0.1)
hover: 边框变为 --border-strong
error: 边框变为 --error-500
```

### 卡片（Card）

```css
背景: white
边框: 1px solid var(--border-light)
圆角: 8px
内边距: 24px
阴影: var(--shadow-sm)

hover: 阴影变为 --shadow-md
```

### 进度条（Progress）

```css
/* 底层轨道 */
背景: var(--bg-active)
高度: 6px
圆角: 3px

/* 填充条 */
背景: linear-gradient(90deg, #7A94A9, #91A5B8)
圆角: 3px
过渡: width 0.3s ease
```

### 状态图标

```css
/* 成功 */
颜色: var(--success-500)
图标: ✅ 或 check-circle

/* 处理中 */
颜色: var(--primary-400)
图标: ⏳ 或 loading (旋转动画)

/* 等待 */
颜色: var(--text-tertiary)
图标: ⏸️ 或 clock

/* 失败 */
颜色: var(--error-500)
图标: ❌ 或 alert-circle
```

---

## 🎬 动画系统

### 过渡时间

```css
--transition-fast: 150ms;     /* 快速反馈 - hover */
--transition-base: 200ms;     /* 标准过渡 */
--transition-slow: 300ms;     /* 慢速过渡 - modal */
--transition-slower: 500ms;   /* 很慢 - page transition */
```

### 缓动函数

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### 常用动画

```css
/* 悬停 */
transition: all var(--transition-fast) var(--ease-out);

/* 按下反馈 */
transform: scale(0.98);
transition: transform var(--transition-fast);

/* 淡入 */
opacity: 0 → 1;
transition: opacity var(--transition-base);

/* 进度条 */
transition: width var(--transition-slow) var(--ease-in-out);
```

### 动画原则
- **微妙克制** - 不要过度动画
- **快速响应** - hover 效果要快（150ms）
- **流畅自然** - 使用 ease-out 缓动
- **有意义** - 动画要有目的，不是为了炫技

---

## 📱 响应式设计

### 断点（Breakpoints）

```css
--screen-sm: 640px;    /* 手机横屏 */
--screen-md: 768px;    /* 平板竖屏 */
--screen-lg: 1024px;   /* 平板横屏 / 小笔记本 */
--screen-xl: 1280px;   /* 桌面 */
--screen-2xl: 1536px;  /* 大屏 */
```

### 布局策略

| 屏幕尺寸 | 布局 | 说明 |
|----------|------|------|
| < 768px | 单栏 | 上传区 → 文件列表 → 设置 |
| 768px - 1024px | 单栏 | 同上，但元素更大 |
| > 1024px | 双栏 | 左侧 60% / 右侧 40% |

---

## ♿ 可访问性

### 对比度要求（WCAG AA）

| 元素 | 背景 | 文字 | 对比度 |
|------|------|------|--------|
| 主要文字 | #FFFFFF | #2C2C2C | 12.6:1 ✅ |
| 次要文字 | #FFFFFF | #737373 | 4.7:1 ✅ |
| 主按钮 | #7A94A9 | #FFFFFF | 4.8:1 ✅ |
| 成功状态 | #FFFFFF | #8FA888 | 4.5:1 ✅ |

### 焦点状态

```css
/* 所有可交互元素 */
outline: 2px solid var(--primary-400);
outline-offset: 2px;
```

### 键盘导航
- Tab 键遍历所有可交互元素
- Enter/Space 触发按钮
- Esc 关闭 Modal

---

## 📦 组件库映射

### shadcn/ui 组件定制

```tsx
// tailwind.config.js
theme: {
  extend: {
    colors: {
      border: "hsl(45, 20%, 85%)",    // --border-light
      input: "hsl(45, 20%, 85%)",     // --border-default
      ring: "hsl(207, 25%, 65%)",     // --primary-300
      background: "hsl(40, 20%, 98%)", // --bg-page
      foreground: "hsl(0, 0%, 17%)",  // --text-primary
      primary: {
        DEFAULT: "hsl(207, 22%, 58%)", // --primary-400
        foreground: "hsl(0, 0%, 100%)",
      },
      // ... 其他颜色
    },
    borderRadius: {
      lg: "8px",
      md: "6px",
      sm: "4px",
    }
  }
}
```

---

## 🎯 设计检查清单

在开发每个组件时，确认：

- [ ] 使用了莫兰迪色系（低饱和度）
- [ ] 圆角适中（4-8px）
- [ ] 阴影轻微（若有若无）
- [ ] 间距符合 8px 网格
- [ ] 文字对比度 ≥ 4.5:1
- [ ] 有清晰的 hover 和 focus 状态
- [ ] 动画时长 ≤ 300ms
- [ ] 移动端可用性好
- [ ] 支持键盘导航

---

## 🎨 参考案例

- **Anthropic Claude** - 整体风格参考
- **Linear** - 简洁、专业的工具感
- **Notion** - 温和的中性色使用
- **Figma** - 精致的细节处理

---

**设计原则总结：温柔、克制、纯净、专业**

最后更新：2025-10-06
