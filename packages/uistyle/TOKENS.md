# DSH Web UI Design Token 清单

> 自动生成，请勿手改。重新生成：`node tools/extract-tokens.mjs && node tools/build-reference.mjs`

## 这是什么

DSH Web 界面的设计 token —— 带名字的颜色/尺寸常量，CSS 自定义属性（CSS custom property）。
官方组件（`@deepseek-ai/dsh-client-ui-primitives`）内部全部通过这些变量取色取尺寸，
所以**只要用对 token，自定义 UI 就能和官方界面保持一致的视觉与明暗主题**。

## 它们从哪来

不是静态 CSS 文件，而是**运行时由 JS 注入**。官方主题包：

```
@deepseek-ai/dsh-client-ui-theme/lib/client.js
```

该 bundle 里 8 个 CSS 字符串块携带 token 定义，共 **634 条声明**、**427 个唯一 token**：

- `base_css_default`
- `corner_shape_css_default`
- `design_platform_css_default`
- `focus_css_default`
- `onboarding_css_default`
- `scrollbar_css_default`
- `gradient_shadow_text_css_default`
- `shiki_css_default`

明暗切换靠属性选择器 —— 浅色是 `body`，深色是 `body[data-ds-dark-theme]`：

```css
body                        { --dsw-alias-bg-layer-1: var(--dsw-static-neutral-bluish-00);  }
body[data-ds-dark-theme]    { --dsw-alias-bg-layer-1: var(--dsw-static-neutral-bluish-875); }
```

## 总量

| 指标 | 数量 |
|---|---|
| **全部 token** | **427** |
| `--dsw-*` 官方命名空间 | 403 |
| `--ds-*` | 5 |
| `--dsh-*` | 8 |
| `--shiki-*` 代码高亮 | 11 |

### 按命名层 (layer)

| 层 | 数量 | 说明 |
|---|---|---|
| `--dsw-font-*` | 182 | 排版尺度（复合简写 + 5 个子属性） |
| `--dsw-alias-*` | 107 | 语义别名层 —— 指向 static 色板，**日常应该用这一层** |
| `--dsw-static-*` | 77 | 原始色板层 —— 具体色值，不带语义 |
| `--dsw-specific-*` | 11 | 场景专用覆盖（如 mac 桌面端菜单背景） |
| `--shiki-*` | 11 | 代码高亮配色 |
| `--dsh-*` | 8 | 内容区/滚动条专用（注意不是 dsw 前缀） |
| `--dsw-radius-*` | 6 | 圆角 |
| `--ds-*` | 5 | 全局常量：缓动、过渡时长、等宽字体（注意不是 dsw 前缀） |
| `--dsw-elevation-*` | 5 | 层级阴影 |
| `--dsw-shadow-*` | 4 | 阴影 |
| `--dsw-gradient-*` | 3 | 渐变 |
| `--dsw-focus-*` | 2 | 焦点环 |
| `--dsw-linear-*` | 2 | 线性渐变 |
| `--dsw-menu-*` | 2 | 菜单模糊 |
| `--dsw-corner-*` | 1 | 超椭圆圆角 |
| `--dsw-mask-*` | 1 | 遮罩 |

### 按明暗行为 (theme)

| 行为 | 数量 | 含义 |
|---|---|---|
| `invariant` | 231 | 明暗相同 |
| `light+dark` | 196 | **明暗各有一套定义，自动切换** |

### 定义所在的选择器作用域 (scope)

| 作用域 | token 数 |
|---|---|
| `body[light]` | 400 |
| `body[dark]` | 205 |
| `:root` | 26 |
| `other` | 2 |

## 实际使用情况

在 dsh 0.2.0-rc.2 实际发布的 75 个前端产物文件中统计：

| 指标 | 数量 |
|---|---|
| 被引用过（定义之外） | 215 |
| 零引用 | 212 |

> ⚠️ **口径说明**：零引用只代表"在已发布的构建产物里没被引用"。
> 官方源码未公开，可能存在运行时才用到、或功能未启用的 token。
> 这个数字**不能**理解为"官方废弃了这些 token"。

### 引用最多的 25 个（值得优先掌握）

| 引用次数 | token | 用途 |
|---|---|---|
| 323 | `--dsw-alias-label-tertiary` | 文字 / 标签色 (text) |
| 315 | `--dsw-alias-label-primary` | 文字 / 标签色 (text) |
| 237 | `--dsw-alias-label-secondary` | 文字 / 标签色 (text) |
| 168 | `--dsw-alias-state-business-primary` | 品牌 / 状态色 (brand-state) |
| 147 | `--dsw-alias-interactive-bg-hover` | 背景 / 填充 (background) |
| 120 | `--dsw-alias-state-error-primary` | 品牌 / 状态色 (brand-state) |
| 109 | `--dsh-content-font-delta` | 字体与排版 (typography) |
| 103 | `--dsw-radius-sm` | 圆角 (radius) |
| 98 | `--dsw-focus-ring-color` | 焦点环 (focus) |
| 92 | `--dsw-alias-label-caption` | 文字 / 标签色 (text) |
| 85 | `--dsw-alias-border-l2` | 描边 / 分隔线 (border) |
| 78 | `--dsw-radius-md` | 圆角 (radius) |
| 72 | `--dsw-font-family` | 字体与排版 (typography) |
| 60 | `--dsw-radius-lg` | 圆角 (radius) |
| 55 | `--dsh-content-font-size-secondary` | 字体与排版 (typography) |
| 55 | `--dsw-alias-border-l1` | 描边 / 分隔线 (border) |
| 55 | `--dsw-alias-border-l3` | 描边 / 分隔线 (border) |
| 52 | `--dsw-alias-bg-layer-1` | 背景 / 填充 (background) |
| 49 | `--ds-font-family-code` | 字体与排版 (typography) |
| 45 | `--dsw-alias-border-l4` | 描边 / 分隔线 (border) |
| 43 | `--dsw-alias-bg-base` | 背景 / 填充 (background) |
| 42 | `--ds-ease-in-out` | 动效时长与缓动 (motion) |
| 42 | `--dsw-focus-ring-width` | 焦点环 (focus) |
| 38 | `--dsh-scrollbar-thumb` | 滚动条 (scrollbar) |
| 37 | `--dsh-scrollbar-thumb-hover` | 滚动条 (scrollbar) |

---

# 按用途分类的完整清单

每个 token 列出浅色 / 深色两套取值。`—` 表示该侧没有定义（明暗相同）。

## 文字 / 标签色 (text) — 16 个

| token | 浅色 | 深色 | 引用次数 | 层 |
|---|---|---|---|---|
| `--dsw-alias-brand-text` | `var(--dsw-static-neutral-bluish-1000)` | `var(--dsw-static-neutral-bluish-50)` |  | alias |
| `--dsw-alias-label-caption` | `var(--dsw-static-neutral-bluish-400)` | `var(--dsw-static-neutral-bluish-600)` | 92 | alias |
| `--dsw-alias-label-deep-diving` | `color-mix(in srgb, var(--dsw-static-deepseek-500) 70%, var(--dsw-…` | `color-mix(in srgb, var(--dsw-static-deepseek-450) 55%, var(--dsw-…` | 1 | alias |
| `--dsw-alias-label-deep-diving-shimmer` | `color-mix(in srgb, var(--dsw-static-deepseek-500) 30%, var(--dsw-…` | `color-mix(in srgb, var(--dsw-static-blue-300) 65%, var(--dsw-stat…` | 1 | alias |
| `--dsw-alias-label-dimmed` | `var(--dsw-static-neutral-bluish-200)` | `var(--dsw-static-neutral-bluish-750)` | 9 | alias |
| `--dsw-alias-label-document-preview` | `var(--dsw-static-neutral-bluish-700)` | `var(--dsw-static-neutral-bluish-300)` |  | alias |
| `--dsw-alias-label-primary` | `var(--dsw-static-neutral-bluish-1000)` | `var(--dsw-static-neutral-bluish-50)` | 315 | alias |
| `--dsw-alias-label-primary-bluish` | `var(--dsw-static-blue-900)` | `var(--dsw-static-neutral-bluish-50)` | 1 | alias |
| `--dsw-alias-label-primary-dimmed` | `var(--dsw-static-neutral-bluish-950)` | `var(--dsw-static-neutral-bluish-100)` | 4 | alias |
| `--dsw-alias-label-primary-foreground` | `var(--dsw-static-neutral-bluish-00)` | `var(--dsw-static-neutral-bluish-1000)` | 8 | alias |
| `--dsw-alias-label-primary-inverted` | `var(--dsw-static-neutral-bluish-00)` | `var(--dsw-static-neutral-bluish-800)` | 11 | alias |
| `--dsw-alias-label-secondary` | `var(--dsw-static-neutral-bluish-700)` | `var(--dsw-static-neutral-bluish-300)` | 237 | alias |
| `--dsw-alias-label-shimmer` | `color-mix(in srgb, var(--dsw-static-neutral-1000) 30%, transparent)` | `color-mix(in srgb, var(--dsw-static-neutral-00) 45%, transparent)` | 2 | alias |
| `--dsw-alias-label-tertiary` | `var(--dsw-static-neutral-bluish-600)` | `var(--dsw-static-neutral-bluish-400)` | 323 | alias |
| `--dsw-alias-state-warn-label` | `var(--dsw-static-amber-600)` | `var(--dsw-static-amber-600)` | 15 | alias |
| `--dsw-alias-toast-label` | `var(--dsw-static-neutral-bluish-00)` | `var(--dsw-static-neutral-bluish-00)` | 1 | alias |

## 背景 / 填充 (background) — 35 个

| token | 浅色 | 深色 | 引用次数 | 层 |
|---|---|---|---|---|
| `--dsw-alias-bg-base` | `var(--dsw-static-neutral-bluish-00)` | `var(--dsw-static-neutral-bluish-950)` | 43 | alias |
| `--dsw-alias-bg-document-preview` | `var(--dsw-static-neutral-bluish-100)` | `var(--dsw-static-neutral-bluish-950)` | 1 | alias |
| `--dsw-alias-bg-document-selection` | `color-mix(in srgb, var(--dsw-static-blue-500) 40%, transparent)` | `color-mix(in srgb, var(--dsw-static-blue-500) 40%, transparent)` |  | alias |
| `--dsw-alias-bg-layer-1` | `var(--dsw-static-neutral-bluish-00)` | `var(--dsw-static-neutral-bluish-875)` | 52 | alias |
| `--dsw-alias-bg-layer-2` | `var(--dsw-static-neutral-bluish-00)` | `var(--dsw-static-neutral-bluish-850)` | 27 | alias |
| `--dsw-alias-bg-layer-3` | `var(--dsw-static-neutral-bluish-00)` | `var(--dsw-static-neutral-bluish-800)` | 15 | alias |
| `--dsw-alias-bg-mask-1` | `#0000003d` | `#00000080` | 3 | alias |
| `--dsw-alias-bg-mask-2` | `#0000001f` | `#0003` |  | alias |
| `--dsw-alias-bg-mask-3` | `#0000007a` | `#0000007a` |  | alias |
| `--dsw-alias-bg-mask-drop` | `#ffffffb3` | `#272730b3` | 1 | alias |
| `--dsw-alias-bg-mask-photo` | `#000000e0` | `#000000e0` |  | alias |
| `--dsw-alias-bg-module-platform` | `var(--dsw-static-neutral-bluish-60)` | `var(--dsw-static-neutral-bluish-800)` | 27 | alias |
| `--dsw-alias-bg-multi-select` | `var(--dsw-static-neutral-bluish-60)` | `var(--dsw-static-neutral-850)` |  | alias |
| `--dsw-alias-bg-overlay` | `var(--dsw-static-neutral-bluish-150)` | `var(--dsw-static-neutral-bluish-700)` | 3 | alias |
| `--dsw-alias-bg-skeleton` | `#0000000a` | `#ffffff14` | 6 | alias |
| `--dsw-alias-button-contrast-fill` | `var(--dsw-static-neutral-bluish-700)` | `var(--dsw-static-neutral-bluish-50)` | 3 | alias |
| `--dsw-alias-button-elevated-fill` | `var(--dsw-static-neutral-bluish-00)` | `var(--dsw-static-neutral-bluish-750)` | 2 | alias |
| `--dsw-alias-button-floating-fill` | `var(--dsw-static-neutral-bluish-00)` | `var(--dsw-static-neutral-bluish-850)` | 3 | alias |
| `--dsw-alias-button-ghost-active-fill` | `var(--dsw-static-neutral-bluish-100)` | `var(--dsw-static-neutral-bluish-750)` | 4 | alias |
| `--dsw-alias-button-info-fill` | `var(--dsw-static-deepseek-500)` | `var(--dsw-static-deepseek-400)` | 3 | alias |
| `--dsw-alias-button-primary-fill` | `var(--dsw-alias-brand-primary)` | `var(--dsw-alias-brand-primary)` | 7 | alias |
| `--dsw-alias-button-tool-bar-fill` | `#54555780` | `#54555780` | 1 | alias |
| `--dsw-alias-button-tool-bar-fill-invisible` | `#1f1f1f5c` | `#1f1f1f5c` |  | alias |
| `--dsw-alias-interactive-bg-active` | `#2631481a` | `#ffffff24` | 4 | alias |
| `--dsw-alias-interactive-bg-hover` | `#2631480f` | `#ffffff14` | 147 | alias |
| `--dsw-alias-interactive-bg-hover-accent` | `#26314824` | `#ffffff3d` |  | alias |
| `--dsw-alias-interactive-bg-hover-danger` | `#ec13130d` | `#f25a5a26` | 11 | alias |
| `--dsw-alias-interactive-bg-hover-solid` | `var(--dsw-static-neutral-bluish-75)` | `var(--dsw-static-neutral-bluish-800)` | 10 | alias |
| `--dsw-alias-menu-group-header-fill` | `#f8f9faf0` | `#303136f0` | 1 | alias |
| `--dsw-alias-onboarding-card-fill` | `color-mix(in srgb, var(--dsw-static-neutral-bluish-00) 80%, trans…` | `color-mix(in srgb, var(--dsw-static-neutral-bluish-850) 80%, tran…` | 1 | alias |
| `--dsw-alias-onboarding-secondary-fill` | `var(--dsw-static-neutral-bluish-00)` | `#48494c` | 2 | alias |
| `--dsw-alias-settings-card-fill` | `var(--dsw-alias-bg-layer-2)` | `—` | 5 | alias |
| `--dsw-alias-turn-trigger-bg-hover` | `var(--dsw-alias-interactive-bg-hover)` | `var(--dsw-alias-interactive-bg-active)` | 1 | alias |
| `--dsw-menu-surface-fill` | `#f8f9fa94` | `#43454a73` | 3 | menu |
| `--dsw-specific-sidebar-fill` | `var(--dsw-static-neutral-bluish-50)` | `var(--dsw-static-neutral-bluish-900)` | 12 | specific |

## 描边 / 分隔线 (border) — 10 个

| token | 浅色 | 深色 | 引用次数 | 层 |
|---|---|---|---|---|
| `--dsw-alias-border-inverted` | `#0000` | `#ffffff0f` | 2 | alias |
| `--dsw-alias-border-inverted2` | `#0000` | `#ffffff14` |  | alias |
| `--dsw-alias-border-l1` | `#0000000a` | `#ffffff0f` | 55 | alias |
| `--dsw-alias-border-l2` | `#0000001a` | `#ffffff1f` | 85 | alias |
| `--dsw-alias-border-l2-darkmode-thin` | `#0000001a` | `#ffffff0f` | 10 | alias |
| `--dsw-alias-border-l3` | `#0000001f` | `#ffffff29` | 55 | alias |
| `--dsw-alias-border-l4` | `#00000029` | `#fff3` | 45 | alias |
| `--dsw-alias-button-ghost-active-border` | `var(--dsw-static-neutral-bluish-500)` | `var(--dsw-static-neutral-bluish-600)` | 3 | alias |
| `--dsw-alias-onboarding-checkbox-border` | `color-mix(in srgb, var(--dsw-static-neutral-bluish-1000) 20%, tra…` | `var(--dsw-alias-border-l2)` | 1 | alias |
| `--dsw-alias-settings-card-stroke` | `var(--dsw-alias-border-l4)` | `—` | 5 | alias |

## 品牌 / 状态色 (brand-state) — 16 个

| token | 浅色 | 深色 | 引用次数 | 层 |
|---|---|---|---|---|
| `--dsw-alias-brand-primary` | `var(--dsw-static-neutral-bluish-1000)` | `var(--dsw-static-neutral-bluish-50)` | 12 | alias |
| `--dsw-alias-brand-primary-invert` | `var(--dsw-static-neutral-bluish-1000)` | `var(--dsw-static-neutral-bluish-50)` |  | alias |
| `--dsw-alias-brand-primary-new-colorprimary-new-color` | `#4176e6` | `var(--dsw-static-deepseek-450)` | 14 | alias |
| `--dsw-alias-onboarding-accent` | `#3964fe` | `—` | 2 | alias |
| `--dsw-alias-state-business-primary` | `var(--dsw-static-deepseek-500)` | `var(--dsw-static-deepseek-400)` | 168 | alias |
| `--dsw-alias-state-business-tertiary` | `var(--dsw-static-deepseek-100)` | `var(--dsw-static-deepseek-800)` | 5 | alias |
| `--dsw-alias-state-error-primary` | `var(--dsw-static-red-600)` | `var(--dsw-static-red-400)` | 120 | alias |
| `--dsw-alias-state-error-secondary` | `var(--dsw-static-red-400)` | `var(--dsw-static-red-400)` | 4 | alias |
| `--dsw-alias-state-idle-primary` | `var(--dsw-static-neutral-300)` | `var(--dsw-static-neutral-600)` | 3 | alias |
| `--dsw-alias-state-success-primary` | `var(--dsw-static-green-500)` | `var(--dsw-static-green-500)` | 25 | alias |
| `--dsw-alias-state-success-secondary` | `var(--dsw-static-green-400)` | `var(--dsw-static-green-400)` | 3 | alias |
| `--dsw-alias-state-success-tertiary` | `var(--dsw-static-green-100)` | `var(--dsw-static-green-900)` | 3 | alias |
| `--dsw-alias-state-warn-primary` | `var(--dsw-static-amber-500)` | `var(--dsw-static-amber-500)` | 15 | alias |
| `--dsw-alias-state-warn-secondary` | `var(--dsw-static-amber-400)` | `var(--dsw-static-amber-400)` | 3 | alias |
| `--dsw-alias-state-warn-tertiary` | `var(--dsw-static-amber-100)` | `var(--dsw-static-amber-900)` | 13 | alias |
| `--dsw-specific-sidebar-nav-item-active-accent` | `var(--dsw-static-deepseek-100)` | `var(--dsw-static-neutral-bluish-800)` | 1 | specific |

## 字体与排版 (typography) — 186 个

排版 token 是复合结构：一个总简写 + `-font-family` / `-font-size` / `-font-style` / `-font-weight` / `-line-height` 五个子属性。

| token | 浅色 | 深色 | 引用次数 | 层 |
|---|---|---|---|---|
| `--ds-font-family-code` | `"SF Mono", "JetBrains Mono", "Fira Code", …` | `—` | 49 | ds |
| `--dsh-content-font-delta` | `calc(var(--dsh-content-font-size,14px) - 14px)` | `—` | 109 | dsh |
| `--dsh-content-font-delta-secondary` | `calc(var(--dsh-content-font-size-secondary) - 13px)` | `—` | 22 | dsh |
| `--dsh-content-font-size-secondary` | `min(calc(var(--dsh-content-font-size, 14px) - 1px), max(13px, …` | `—` | 55 | dsh |
| `--dsw-font-base-16` | `16px/24px var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-base-16-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-base-16-font-size` | `16px` | `—` |  | font |
| `--dsw-font-base-16-font-style` | `normal` | `—` |  | font |
| `--dsw-font-base-16-font-weight` | `400` | `—` |  | font |
| `--dsw-font-base-16-line-height` | `24px` | `—` |  | font |
| `--dsw-font-base-strong-16` | `500 16px/24px var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-base-strong-16-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-base-strong-16-font-size` | `16px` | `—` |  | font |
| `--dsw-font-base-strong-16-font-style` | `normal` | `—` |  | font |
| `--dsw-font-base-strong-16-font-weight` | `500` | `—` |  | font |
| `--dsw-font-base-strong-16-line-height` | `24px` | `—` |  | font |
| `--dsw-font-family` | `-apple-system, BlinkMacSystemFont, "Segoe UI", …` | `—` | 72 | font |
| `--dsw-font-family-brand` | `"Montserrat", var(--dsw-font-family)` | `—` | 4 | font |
| `--dsw-font-l-20` | `500 20px/28px var(--dsw-font-family)` | `—` | 1 | font |
| `--dsw-font-l-20-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-l-20-font-size` | `20px` | `—` |  | font |
| `--dsw-font-l-20-font-style` | `normal` | `—` |  | font |
| `--dsw-font-l-20-font-weight` | `500` | `—` |  | font |
| `--dsw-font-l-20-line-height` | `28px` | `—` |  | font |
| `--dsw-font-m-18` | `500 16px/28px var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-m-18-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-m-18-font-size` | `16px` | `—` |  | font |
| `--dsw-font-m-18-font-style` | `normal` | `—` |  | font |
| `--dsw-font-m-18-font-weight` | `500` | `—` |  | font |
| `--dsw-font-m-18-line-height` | `28px` | `—` |  | font |
| `--dsw-font-markdown-base` | `var(--dsh-content-font-size,14px) / calc(24px + var(--dsh-content…` | `—` | 1 | font |
| `--dsw-font-markdown-base-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-base-font-size` | `var(--dsh-content-font-size,14px)` | `—` |  | font |
| `--dsw-font-markdown-base-font-style` | `normal` | `—` |  | font |
| `--dsw-font-markdown-base-font-weight` | `400` | `—` |  | font |
| `--dsw-font-markdown-base-italic` | `italic var(--dsh-content-font-size,14px) / calc(24px + var(--dsh-…` | `—` |  | font |
| `--dsw-font-markdown-base-italic-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-base-italic-font-size` | `var(--dsh-content-font-size,14px)` | `—` |  | font |
| `--dsw-font-markdown-base-italic-font-style` | `italic` | `—` |  | font |
| `--dsw-font-markdown-base-italic-font-weight` | `400` | `—` |  | font |
| `--dsw-font-markdown-base-italic-line-height` | `calc(24px + var(--dsh-content-font-delta))` | `—` |  | font |
| `--dsw-font-markdown-base-line-height` | `calc(24px + var(--dsh-content-font-delta))` | `—` |  | font |
| `--dsw-font-markdown-base-strong` | `600 var(--dsh-content-font-size,14px) / calc(24px + var(--dsh-con…` | `—` | 1 | font |
| `--dsw-font-markdown-base-strong-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-base-strong-font-size` | `var(--dsh-content-font-size,14px)` | `—` |  | font |
| `--dsw-font-markdown-base-strong-font-style` | `normal` | `—` |  | font |
| `--dsw-font-markdown-base-strong-font-weight` | `600` | `—` |  | font |
| `--dsw-font-markdown-base-strong-italic` | `italic 600 var(--dsh-content-font-size,14px) / calc(24px + var(--…` | `—` |  | font |
| `--dsw-font-markdown-base-strong-italic-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-base-strong-italic-font-size` | `var(--dsh-content-font-size,14px)` | `—` |  | font |
| `--dsw-font-markdown-base-strong-italic-font-style` | `italic` | `—` |  | font |
| `--dsw-font-markdown-base-strong-italic-font-weight` | `600` | `—` |  | font |
| `--dsw-font-markdown-base-strong-italic-line-height` | `calc(24px + var(--dsh-content-font-delta))` | `—` |  | font |
| `--dsw-font-markdown-base-strong-line-height` | `calc(24px + var(--dsh-content-font-delta))` | `—` |  | font |
| `--dsw-font-markdown-code` | `12px/19px var(--ds-font-family-code)` | `—` | 1 | font |
| `--dsw-font-markdown-code-block` | `11px/19px var(--ds-font-family-code)` | `—` | 9 | font |
| `--dsw-font-markdown-code-block-font-family` | `var(--ds-font-family-code)` | `—` |  | font |
| `--dsw-font-markdown-code-block-font-size` | `11px` | `—` |  | font |
| `--dsw-font-markdown-code-block-font-style` | `normal` | `—` |  | font |
| `--dsw-font-markdown-code-block-font-weight` | `400` | `—` |  | font |
| `--dsw-font-markdown-code-block-line-height` | `19px` | `—` |  | font |
| `--dsw-font-markdown-code-block-small` | `11px/16px var(--ds-font-family-code)` | `—` | 10 | font |
| `--dsw-font-markdown-code-block-small-font-family` | `var(--ds-font-family-code)` | `—` |  | font |
| `--dsw-font-markdown-code-block-small-font-size` | `11px` | `—` |  | font |
| `--dsw-font-markdown-code-block-small-font-style` | `normal` | `—` |  | font |
| `--dsw-font-markdown-code-block-small-font-weight` | `400` | `—` |  | font |
| `--dsw-font-markdown-code-block-small-line-height` | `16px` | `—` |  | font |
| `--dsw-font-markdown-code-font-family` | `var(--ds-font-family-code)` | `—` | 1 | font |
| `--dsw-font-markdown-code-font-size` | `12px` | `—` |  | font |
| `--dsw-font-markdown-code-font-style` | `normal` | `—` |  | font |
| `--dsw-font-markdown-code-font-weight` | `400` | `—` |  | font |
| `--dsw-font-markdown-code-line-height` | `19px` | `—` |  | font |
| `--dsw-font-markdown-h1` | `700 calc(21px + var(--dsh-content-font-delta)) / calc(30px + var(…` | `—` | 1 | font |
| `--dsw-font-markdown-h1-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-h1-font-size` | `calc(21px + var(--dsh-content-font-delta))` | `—` |  | font |
| `--dsw-font-markdown-h1-font-style` | `normal` | `—` |  | font |
| `--dsw-font-markdown-h1-font-weight` | `700` | `—` |  | font |
| `--dsw-font-markdown-h1-line-height` | `calc(30px + var(--dsh-content-font-delta))` | `—` |  | font |
| `--dsw-font-markdown-h2` | `700 calc(19px + var(--dsh-content-font-delta)) / calc(28px + var(…` | `—` | 1 | font |
| `--dsw-font-markdown-h2-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-h2-font-size` | `calc(19px + var(--dsh-content-font-delta))` | `—` |  | font |
| `--dsw-font-markdown-h2-font-style` | `normal` | `—` |  | font |
| `--dsw-font-markdown-h2-font-weight` | `700` | `—` |  | font |
| `--dsw-font-markdown-h2-line-height` | `calc(28px + var(--dsh-content-font-delta))` | `—` |  | font |
| `--dsw-font-markdown-h3` | `700 calc(18px + var(--dsh-content-font-delta)) / calc(26px + var(…` | `—` | 1 | font |
| `--dsw-font-markdown-h3-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-h3-font-size` | `calc(18px + var(--dsh-content-font-delta))` | `—` |  | font |
| `--dsw-font-markdown-h3-font-style` | `normal` | `—` |  | font |
| `--dsw-font-markdown-h3-font-weight` | `700` | `—` |  | font |
| `--dsw-font-markdown-h3-line-height` | `calc(26px + var(--dsh-content-font-delta))` | `—` |  | font |
| `--dsw-font-markdown-h4` | `600 var(--dsh-content-font-size,14px) / calc(24px + var(--dsh-con…` | `—` | 1 | font |
| `--dsw-font-markdown-h4-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-h4-font-size` | `var(--dsh-content-font-size,14px)` | `—` |  | font |
| `--dsw-font-markdown-h4-font-style` | `normal` | `—` |  | font |
| `--dsw-font-markdown-h4-font-weight` | `600` | `—` |  | font |
| `--dsw-font-markdown-h4-line-height` | `calc(24px + var(--dsh-content-font-delta))` | `—` |  | font |
| `--dsw-font-markdown-small` | `12px/20px var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-small-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-small-font-size` | `12px` | `—` |  | font |
| `--dsw-font-markdown-small-font-style` | `normal` | `—` |  | font |
| `--dsw-font-markdown-small-font-weight` | `400` | `—` |  | font |
| `--dsw-font-markdown-small-italic` | `italic 12px/20px var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-small-italic-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-small-italic-font-size` | `12px` | `—` |  | font |
| `--dsw-font-markdown-small-italic-font-style` | `italic` | `—` |  | font |
| `--dsw-font-markdown-small-italic-font-weight` | `400` | `—` |  | font |
| `--dsw-font-markdown-small-italic-line-height` | `20px` | `—` |  | font |
| `--dsw-font-markdown-small-line-height` | `20px` | `—` |  | font |
| `--dsw-font-markdown-small-strong` | `600 12px/20px var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-small-strong-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-small-strong-font-size` | `12px` | `—` |  | font |
| `--dsw-font-markdown-small-strong-font-style` | `normal` | `—` |  | font |
| `--dsw-font-markdown-small-strong-font-weight` | `600` | `—` |  | font |
| `--dsw-font-markdown-small-strong-italic` | `italic 600 12px/20px var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-small-strong-italic-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-small-strong-italic-font-size` | `12px` | `—` |  | font |
| `--dsw-font-markdown-small-strong-italic-font-style` | `italic` | `—` |  | font |
| `--dsw-font-markdown-small-strong-italic-font-weight` | `600` | `—` |  | font |
| `--dsw-font-markdown-small-strong-italic-line-height` | `20px` | `—` |  | font |
| `--dsw-font-markdown-small-strong-line-height` | `20px` | `—` |  | font |
| `--dsw-font-markdown-table` | `var(--dsh-content-font-size-secondary,13px)/calc(22px + var(--dsh…` | `—` | 1 | font |
| `--dsw-font-markdown-table-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-table-font-size` | `var(--dsh-content-font-size-secondary,13px)` | `—` |  | font |
| `--dsw-font-markdown-table-font-style` | `normal` | `—` |  | font |
| `--dsw-font-markdown-table-font-weight` | `400` | `—` |  | font |
| `--dsw-font-markdown-table-head` | `500 var(--dsh-content-font-size-secondary,13px)/calc(22px + var(-…` | `—` | 1 | font |
| `--dsw-font-markdown-table-head-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-markdown-table-head-font-size` | `var(--dsh-content-font-size-secondary,13px)` | `—` |  | font |
| `--dsw-font-markdown-table-head-font-style` | `normal` | `—` |  | font |
| `--dsw-font-markdown-table-head-font-weight` | `500` | `—` |  | font |
| `--dsw-font-markdown-table-head-line-height` | `calc(22px + var(--dsh-content-font-delta-secondary,0px))` | `—` |  | font |
| `--dsw-font-markdown-table-line-height` | `calc(22px + var(--dsh-content-font-delta-secondary,0px))` | `—` |  | font |
| `--dsw-font-s-14` | `14px/22px var(--dsw-font-family)` | `—` | 1 | font |
| `--dsw-font-s-14-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-s-14-font-size` | `14px` | `—` |  | font |
| `--dsw-font-s-14-font-style` | `normal` | `—` |  | font |
| `--dsw-font-s-14-font-weight` | `400` | `—` |  | font |
| `--dsw-font-s-14-line-height` | `22px` | `—` |  | font |
| `--dsw-font-s-strong-14` | `500 14px/22px var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-s-strong-14-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-s-strong-14-font-size` | `14px` | `—` |  | font |
| `--dsw-font-s-strong-14-font-style` | `normal` | `—` |  | font |
| `--dsw-font-s-strong-14-font-weight` | `500` | `—` |  | font |
| `--dsw-font-s-strong-14-line-height` | `22px` | `—` |  | font |
| `--dsw-font-xl-24` | `600 24px/32px var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-xl-24-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-xl-24-font-size` | `24px` | `—` |  | font |
| `--dsw-font-xl-24-font-style` | `normal` | `—` |  | font |
| `--dsw-font-xl-24-font-weight` | `600` | `—` |  | font |
| `--dsw-font-xl-24-line-height` | `32px` | `—` |  | font |
| `--dsw-font-xs-13` | `13px/20px var(--dsw-font-family)` | `—` | 30 | font |
| `--dsw-font-xs-13-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-xs-13-font-size` | `13px` | `—` |  | font |
| `--dsw-font-xs-13-font-style` | `normal` | `—` |  | font |
| `--dsw-font-xs-13-font-weight` | `400` | `—` |  | font |
| `--dsw-font-xs-13-line-height` | `20px` | `—` |  | font |
| `--dsw-font-xs-strong-13` | `500 13px/20px var(--dsw-font-family)` | `—` | 4 | font |
| `--dsw-font-xs-strong-13-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-xs-strong-13-font-size` | `13px` | `—` |  | font |
| `--dsw-font-xs-strong-13-font-style` | `normal` | `—` |  | font |
| `--dsw-font-xs-strong-13-font-weight` | `500` | `—` |  | font |
| `--dsw-font-xs-strong-13-line-height` | `20px` | `—` |  | font |
| `--dsw-font-xxs-12` | `12px/18px var(--dsw-font-family)` | `—` | 15 | font |
| `--dsw-font-xxs-12-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-xxs-12-font-size` | `12px` | `—` |  | font |
| `--dsw-font-xxs-12-font-style` | `normal` | `—` |  | font |
| `--dsw-font-xxs-12-font-weight` | `400` | `—` |  | font |
| `--dsw-font-xxs-12-line-height` | `18px` | `—` |  | font |
| `--dsw-font-xxs-strong-12` | `500 12px/18px var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-xxs-strong-12-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-xxs-strong-12-font-size` | `12px` | `—` |  | font |
| `--dsw-font-xxs-strong-12-font-style` | `normal` | `—` |  | font |
| `--dsw-font-xxs-strong-12-font-weight` | `500` | `—` |  | font |
| `--dsw-font-xxs-strong-12-line-height` | `18px` | `—` |  | font |
| `--dsw-font-xxxs-11` | `11px/14px var(--dsw-font-family)` | `—` | 5 | font |
| `--dsw-font-xxxs-11-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-xxxs-11-font-size` | `11px` | `—` |  | font |
| `--dsw-font-xxxs-11-font-style` | `normal` | `—` |  | font |
| `--dsw-font-xxxs-11-font-weight` | `400` | `—` |  | font |
| `--dsw-font-xxxs-11-line-height` | `14px` | `—` |  | font |
| `--dsw-font-xxxs-strong-11` | `500 11px/14px var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-xxxs-strong-11-font-family` | `var(--dsw-font-family)` | `—` |  | font |
| `--dsw-font-xxxs-strong-11-font-size` | `11px` | `—` |  | font |
| `--dsw-font-xxxs-strong-11-font-style` | `normal` | `—` |  | font |
| `--dsw-font-xxxs-strong-11-font-weight` | `500` | `—` |  | font |
| `--dsw-font-xxxs-strong-11-line-height` | `14px` | `—` |  | font |

## 圆角 (radius) — 6 个

| token | 浅色 | 深色 | 引用次数 | 层 |
|---|---|---|---|---|
| `--dsw-radius-lg` | `16px` | `—` | 60 | radius |
| `--dsw-radius-md` | `12px` | `—` | 78 | radius |
| `--dsw-radius-panel` | `28px` | `—` | 9 | radius |
| `--dsw-radius-sm` | `8px` | `—` | 103 | radius |
| `--dsw-radius-xl` | `20px` | `—` | 26 | radius |
| `--dsw-radius-xs` | `4px` | `—` | 21 | radius |

## 阴影 / 层级 (shadow-elevation) — 9 个

| token | 浅色 | 深色 | 引用次数 | 层 |
|---|---|---|---|---|
| `--dsw-elevation-panel` | `var(--dsw-elevation-stroke), 0 3px 8px 0 #00000008, 0 0 16px 0 #0…` | `—` | 11 | elevation |
| `--dsw-elevation-prominent` | `var(--dsw-elevation-stroke), 0 3px 8px 0 #0000000a, 0 0 20px 0 #0…` | `—` | 19 | elevation |
| `--dsw-elevation-soft` | `var(--dsw-elevation-stroke), 0 4px 16px 0 #00000008, 0 0 24px 0 #…` | `—` | 2 | elevation |
| `--dsw-elevation-stroke` | `0 0 0 .5px var(--dsw-elevation-stroke-color)` | `—` | 5 | elevation |
| `--dsw-elevation-stroke-color` | `var(--dsw-alias-border-l4)` | `var(--dsw-alias-border-l3)` | 27 | elevation |
| `--dsw-shadow-lv1` | `0 2px 4px 0 #0000000d` | `—` |  | shadow |
| `--dsw-shadow-lv1-blur` | `0 4px 12px 0 #00000005` | `—` |  | shadow |
| `--dsw-shadow-lv2` | `0 4px 12px 0 #00000005, 0 2px 8px 0 #0000000a` | `—` | 1 | shadow |
| `--dsw-shadow-lv3` | `0 0 1px 0 #0003, 0 0 4px 0 #00000005, 0 12px 32px 0 #00000014` | `—` | 2 | shadow |

## 动效时长与缓动 (motion) — 4 个

| token | 浅色 | 深色 | 引用次数 | 层 |
|---|---|---|---|---|
| `--ds-ease-in-out` | `cubic-bezier(.4, 0, .2, 1)` | `—` | 42 | ds |
| `--ds-transition-duration` | `.2s` | `—` | 4 | ds |
| `--ds-transition-duration-fast` | `.1s` | `—` |  | ds |
| `--ds-transition-duration-slow` | `.3s` | `—` | 6 | ds |

## 焦点环 (focus) — 2 个

| token | 浅色 | 深色 | 引用次数 | 层 |
|---|---|---|---|---|
| `--dsw-focus-ring-color` | `transparent` | `—` | 98 | focus |
| `--dsw-focus-ring-width` | `2px` | `—` | 42 | focus |

## 渐变 (gradient) — 5 个

| token | 浅色 | 深色 | 引用次数 | 层 |
|---|---|---|---|---|
| `--dsw-gradient-onboarding-blue-stops` | `#3964fe 18.75%, #398efe 51.78%, #6dccff 86.252%, #3964fe` | `—` | 1 | gradient |
| `--dsw-gradient-onboarding-cyan-stops` | `#0293b4 21.154%, #2dc8eb 50.954%, #aff0ff 85.326%, #0293b4` | `—` | 1 | gradient |
| `--dsw-gradient-onboarding-violet-stops` | `#2a2fb6 33.102%, #8b76f6 50.954%, #c5c0ff 85.326%, #2a2fb6` | `—` | 1 | gradient |
| `--dsw-linear-gradient-think` | `linear-gradient(180deg, #fff 20.19%, #fff0 100%)` | `linear-gradient(180deg, #151517 20.19%, #15151700 100%)` |  | linear |
| `--dsw-linear-think-select` | `linear-gradient(180deg, #f5f6f7 20.19%, #f5f6f700 100%)` | `linear-gradient(180deg, #232325 20.19%, #23232500 100%)` |  | linear |

## 模糊 / 滤镜 (effect) — 2 个

| token | 浅色 | 深色 | 引用次数 | 层 |
|---|---|---|---|---|
| `--dsw-mask-blur` | `none` | `—` | 4 | mask |
| `--dsw-menu-backdrop-filter` | `blur(40px) saturate(150%)` | `—` | 14 | menu |

## 滚动条 (scrollbar) — 9 个

| token | 浅色 | 深色 | 引用次数 | 层 |
|---|---|---|---|---|
| `--dsh-scrollbar-thumb` | `var(--dsw-alias-scrollbar-bg-l1)` | `—` | 38 | dsh |
| `--dsh-scrollbar-thumb-border` | `0px` | `—` | 5 | dsh |
| `--dsh-scrollbar-thumb-hover` | `var(--dsw-alias-scrollbar-hover-l1)` | `—` | 37 | dsh |
| `--dsh-scrollbar-track-margin` | `0px` | `—` | 4 | dsh |
| `--dsh-scrollbar-width` | `5px` | `—` | 8 | dsh |
| `--dsw-alias-scrollbar-bg-l1` | `var(--dsw-static-neutral-200)` | `var(--dsw-static-neutral-700)` | 3 | alias |
| `--dsw-alias-scrollbar-bg-l2` | `var(--dsw-static-neutral-200)` | `var(--dsw-static-neutral-600)` | 34 | alias |
| `--dsw-alias-scrollbar-hover-l1` | `var(--dsw-static-neutral-300)` | `var(--dsw-static-neutral-600)` | 1 | alias |
| `--dsw-alias-scrollbar-hover-l2` | `var(--dsw-static-neutral-300)` | `var(--dsw-static-neutral-550)` | 34 | alias |

## 原始色板 (palette, static) — 77 个

原始色板。**一般不要直接用**，应该用 `--dsw-alias-*` 语义层。
列在这里是为了查证 alias 到底指向什么色值。

| token | 浅色 | 深色 | 引用次数 | 层 |
|---|---|---|---|---|
| `--dsw-static-amber-100` | `#fef5e7` | `#fef5e7` | 1 | static |
| `--dsw-static-amber-400` | `#f7ad31` | `#f7ad31` | 3 | static |
| `--dsw-static-amber-500` | `#f59e0b` | `#f59e0b` | 3 | static |
| `--dsw-static-amber-600` | `#dd8629` | `#dd8629` | 2 | static |
| `--dsw-static-amber-900` | `#27241f` | `#27241f` | 1 | static |
| `--dsw-static-blue-100` | `#dbeafe` | `#dbeafe` |  | static |
| `--dsw-static-blue-300` | `#93c5fd` | `#93c5fd` | 1 | static |
| `--dsw-static-blue-400` | `#60a5fa` | `#60a5fa` | 1 | static |
| `--dsw-static-blue-450` | `#4d93f8` | `#4d93f8` | 1 | static |
| `--dsw-static-blue-50` | `#eff6ff` | `#eff6ff` |  | static |
| `--dsw-static-blue-500` | `#3b82f6` | `#3b82f6` | 5 | static |
| `--dsw-static-blue-50p` | `#eaf3ff` | `#eaf3ff` |  | static |
| `--dsw-static-blue-600` | `#2563eb` | `#2563eb` | 1 | static |
| `--dsw-static-blue-75` | `#e5f0ff` | `#e5f0ff` |  | static |
| `--dsw-static-blue-800` | `#1e40af` | `#1e40af` |  | static |
| `--dsw-static-blue-900` | `#0e3074` | `#0e3074` | 1 | static |
| `--dsw-static-blue-950` | `#172554` | `#172554` | 2 | static |
| `--dsw-static-deepseek-100` | `#e4edfd` | `#e4edfd` | 2 | static |
| `--dsw-static-deepseek-200` | `#d3e2ff` | `#d3e2ff` | 1 | static |
| `--dsw-static-deepseek-300` | `#b7c8fe` | `#b7c8fe` |  | static |
| `--dsw-static-deepseek-400` | `#7aaaff` | `#7aaaff` | 6 | static |
| `--dsw-static-deepseek-450` | `#5686fe` | `#5686fe` | 3 | static |
| `--dsw-static-deepseek-50` | `#edf3fe` | `#edf3fe` | 1 | static |
| `--dsw-static-deepseek-500` | `#4176e6` | `#4176e6` | 9 | static |
| `--dsw-static-deepseek-600` | `#4868b2` | `#4868b2` |  | static |
| `--dsw-static-deepseek-700-delete` | `#2f4c8f` | `#2f4c8f` |  | static |
| `--dsw-static-deepseek-800` | `#34415b` | `#34415b` | 1 | static |
| `--dsw-static-deepseek-900` | `#283142` | `#283142` |  | static |
| `--dsw-static-green-100` | `#e6faed` | `#e6faed` | 1 | static |
| `--dsw-static-green-400` | `#4ed17e` | `#4ed17e` | 2 | static |
| `--dsw-static-green-500` | `#22c55e` | `#22c55e` | 3 | static |
| `--dsw-static-green-500-a08` | `#22c55e14` | `#22c55e14` | 1 | static |
| `--dsw-static-green-500-a12` | `#22c55e1f` | `#22c55e1f` | 1 | static |
| `--dsw-static-green-900` | `#233c2c` | `#233c2c` | 1 | static |
| `--dsw-static-neutral-00` | `#fff` | `#fff` | 8 | static |
| `--dsw-static-neutral-100` | `#f5f5f5` | `#f5f5f5` | 4 | static |
| `--dsw-static-neutral-1000` | `#000` | `#000` | 1 | static |
| `--dsw-static-neutral-150` | `#ededed` | `#ededed` |  | static |
| `--dsw-static-neutral-200` | `#e5e5e5` | `#e5e5e5` | 3 | static |
| `--dsw-static-neutral-250` | `#dcdcdc` | `#dcdcdc` |  | static |
| `--dsw-static-neutral-300` | `#d4d4d4` | `#d4d4d4` | 3 | static |
| `--dsw-static-neutral-400` | `#a2a4a6` | `#a2a4a6` | 1 | static |
| `--dsw-static-neutral-50` | `#fafafa` | `#fafafa` | 5 | static |
| `--dsw-static-neutral-500` | `#7f8287` | `#7f8287` |  | static |
| `--dsw-static-neutral-550` | `#65676b` | `#65676b` | 1 | static |
| `--dsw-static-neutral-600` | `#545557` | `#545557` | 3 | static |
| `--dsw-static-neutral-700` | `#3c3c3d` | `#3c3c3d` | 2 | static |
| `--dsw-static-neutral-800` | `#292929` | `#292929` | 5 | static |
| `--dsw-static-neutral-850` | `#212123` | `#212123` | 5 | static |
| `--dsw-static-neutral-900` | `#0f0f0f` | `#0f0f0f` |  | static |
| `--dsw-static-neutral-bluish-00` | `#fff` | `#fff` | 16 | static |
| `--dsw-static-neutral-bluish-100` | `#ebeef2` | `#ebeef2` | 7 | static |
| `--dsw-static-neutral-bluish-1000` | `#0f1115` | `#0f1115` | 6 | static |
| `--dsw-static-neutral-bluish-150` | `#e9ecf2` | `#e9ecf2` | 2 | static |
| `--dsw-static-neutral-bluish-200` | `#e1e5ee` | `#e1e5ee` | 1 | static |
| `--dsw-static-neutral-bluish-300` | `#cfd3d6` | `#cfd3d6` | 3 | static |
| `--dsw-static-neutral-bluish-400` | `#adb2b8` | `#adb2b8` | 7 | static |
| `--dsw-static-neutral-bluish-50` | `#f9fafb` | `#f9fafb` | 10 | static |
| `--dsw-static-neutral-bluish-500` | `#979da6` | `#979da6` | 1 | static |
| `--dsw-static-neutral-bluish-60` | `#f5f6f7` | `#f9fafb` | 5 | static |
| `--dsw-static-neutral-bluish-600` | `#81858c` | `#81858c` | 3 | static |
| `--dsw-static-neutral-bluish-700` | `#61666b` | `#61666b` | 5 | static |
| `--dsw-static-neutral-bluish-75` | `#f1f3f5` | `#f1f3f5` | 5 | static |
| `--dsw-static-neutral-bluish-750` | `#43454a` | `#43454a` | 9 | static |
| `--dsw-static-neutral-bluish-800` | `#353638` | `#353638` | 12 | static |
| `--dsw-static-neutral-bluish-850` | `#2c2c2e` | `#2c2c2e` | 10 | static |
| `--dsw-static-neutral-bluish-875` | `#232324` | `#232324` | 1 | static |
| `--dsw-static-neutral-bluish-900` | `#1b1b1c` | `#1b1b1c` | 4 | static |
| `--dsw-static-neutral-bluish-950` | `#151517` | `#151517` | 3 | static |
| `--dsw-static-red-100` | `#fee2e2` | `#fee2e2` |  | static |
| `--dsw-static-red-400` | `#f25a5a` | `#f25a5a` | 3 | static |
| `--dsw-static-red-400-a12` | `#f25a5a1f` | `#f25a5a1f` | 1 | static |
| `--dsw-static-red-50` | `#fef2f2` | `#fef2f2` |  | static |
| `--dsw-static-red-500` | `#ef4444` | `#ef4444` |  | static |
| `--dsw-static-red-600` | `#ec1313` | `#ec1313` | 2 | static |
| `--dsw-static-red-600-a08` | `#ec131314` | `#ec131314` | 1 | static |
| `--dsw-static-red-900` | `#570c0c` | `#570c0c` |  | static |

## 其他 (other) — 50 个

| token | 浅色 | 深色 | 引用次数 | 层 |
|---|---|---|---|---|
| `--dsw-alias-button-floating-hover` | `var(--dsw-static-neutral-bluish-75)` | `var(--dsw-static-neutral-bluish-800)` | 3 | alias |
| `--dsw-alias-button-ghost-active-hover` | `var(--dsw-static-neutral-bluish-150)` | `var(--dsw-static-neutral-bluish-700)` |  | alias |
| `--dsw-alias-button-info-hover` | `var(--dsw-static-deepseek-400)` | `var(--dsw-static-deepseek-500)` | 1 | alias |
| `--dsw-alias-button-primary-dimmed` | `var(--dsw-static-neutral-bluish-100)` | `var(--dsw-static-neutral-bluish-750)` |  | alias |
| `--dsw-alias-button-primary-hover` | `var(--dsw-static-neutral-bluish-750)` | `var(--dsw-static-neutral-bluish-100)` | 4 | alias |
| `--dsw-alias-button-tool-bar-hover` | `#54555799` | `#54555799` | 1 | alias |
| `--dsw-alias-code-diff-added` | `var(--dsw-static-green-500-a08)` | `var(--dsw-static-green-500-a12)` | 1 | alias |
| `--dsw-alias-code-diff-deleted` | `var(--dsw-static-red-600-a08)` | `var(--dsw-static-red-400-a12)` | 1 | alias |
| `--dsw-alias-file-diff-added-bg` | `#e6f4e7` | `#1f3124` | 1 | alias |
| `--dsw-alias-file-diff-added-gutter` | `#edf7ed` | `#132016` | 1 | alias |
| `--dsw-alias-file-diff-added-marker` | `#01a241` | `#41c977` | 1 | alias |
| `--dsw-alias-file-diff-deleted-bg` | `#fce6e2` | `#3c1f1b` | 1 | alias |
| `--dsw-alias-file-diff-deleted-gutter` | `#fdece9` | `#28130e` | 1 | alias |
| `--dsw-alias-file-diff-deleted-marker` | `#ba2723` | `#fa423e` | 1 | alias |
| `--dsw-alias-link` | `var(--dsw-static-deepseek-500)` | `var(--dsw-static-deepseek-400)` | 10 | alias |
| `--dsw-alias-markdown-citation` | `var(--dsw-static-neutral-bluish-100)` | `var(--dsw-static-neutral-bluish-800)` | 1 | alias |
| `--dsw-alias-markdown-code-block` | `var(--dsw-static-neutral-bluish-50)` | `var(--dsw-static-neutral-bluish-900)` | 21 | alias |
| `--dsw-alias-markdown-code-block-banner` | `var(--dsw-static-neutral-bluish-50)` | `var(--dsw-static-neutral-bluish-850)` | 3 | alias |
| `--dsw-alias-markdown-code-segment-selected` | `var(--dsw-static-neutral-bluish-00)` | `var(--dsw-static-neutral-bluish-800)` |  | alias |
| `--dsw-alias-markdown-code-segment-unselected` | `var(--dsw-static-neutral-bluish-75)` | `var(--dsw-static-neutral-bluish-900)` |  | alias |
| `--dsw-alias-markdown-inline-code` | `var(--dsw-static-neutral-50)` | `var(--dsw-static-neutral-800)` | 1 | alias |
| `--dsw-alias-markdown-placeholder` | `var(--dsw-static-neutral-bluish-60)` | `var(--dsw-static-neutral-bluish-850)` |  | alias |
| `--dsw-alias-markdown-tag` | `var(--dsw-static-neutral-bluish-75)` | `var(--dsw-static-neutral-bluish-850)` | 1 | alias |
| `--dsw-alias-menu-icon` | `var(--dsw-static-neutral-bluish-800)` | `var(--dsw-alias-label-primary-dimmed)` | 6 | alias |
| `--dsw-alias-switch-thumb` | `var(--dsw-static-neutral-bluish-00)` | `var(--dsw-static-neutral-bluish-400)` | 1 | alias |
| `--dsw-alias-toast-bg` | `var(--dsw-static-neutral-bluish-800)` | `var(--dsw-static-neutral-bluish-750)` | 1 | alias |
| `--dsw-alias-tooltip-bg` | `var(--dsw-static-neutral-bluish-850)` | `var(--dsw-static-neutral-bluish-750)` | 3 | alias |
| `--dsw-alias-tooltip-key-bg` | `color-mix(in srgb, var(--dsw-alias-tooltip-bg), white 18%)` | `color-mix(in srgb, var(--dsw-alias-tooltip-bg), white 18%)` | 2 | alias |
| `--dsw-alias-turn-trigger-bg` | `var(--dsw-alias-markdown-code-block)` | `var(--dsw-alias-interactive-bg-hover)` | 1 | alias |
| `--dsw-corner-shape` | `superellipse(1.5)` | `—` | 1 | corner |
| `--dsw-specific-bubble` | `var(--dsw-static-deepseek-50)` | `var(--dsw-static-neutral-bluish-850)` | 3 | specific |
| `--dsw-specific-bubble-highlight` | `var(--dsw-static-deepseek-200)` | `var(--dsw-static-neutral-bluish-750)` |  | specific |
| `--dsw-specific-input-major` | `var(--dsw-static-neutral-bluish-00)` | `var(--dsw-static-neutral-bluish-850)` | 10 | specific |
| `--dsw-specific-login-input` | `var(--dsw-static-neutral-bluish-50)` | `var(--dsw-static-neutral-bluish-900)` |  | specific |
| `--dsw-specific-menu` | `var(--dsw-menu-surface-fill)` | `var(--dsw-menu-surface-fill)` | 17 | specific |
| `--dsw-specific-selector` | `var(--dsw-static-neutral-bluish-60)` | `var(--dsw-static-neutral-bluish-800)` | 2 | specific |
| `--dsw-specific-sidebar-nav-item-active` | `var(--dsw-static-neutral-bluish-100)` | `var(--dsw-static-neutral-bluish-750)` | 1 | specific |
| `--dsw-specific-sidebar-nav-item-hover` | `var(--dsw-static-neutral-bluish-75)` | `var(--dsw-static-neutral-bluish-850)` | 1 | specific |
| `--dsw-specific-tip` | `var(--dsw-static-neutral-bluish-60)` | `var(--dsw-static-neutral-bluish-800)` |  | specific |
| `--shiki-background` | `var(--dsw-alias-markdown-code-block)` | `—` | 1 | shiki |
| `--shiki-foreground` | `var(--dsw-alias-label-primary)` | `—` | 1 | shiki |
| `--shiki-token-comment` | `#868e96` | `#adb5bd` |  | shiki |
| `--shiki-token-constant` | `#1c7ed6` | `#4dabf7` |  | shiki |
| `--shiki-token-function` | `#6741d9` | `#b197fc` |  | shiki |
| `--shiki-token-keyword` | `#d6336c` | `#faa2c1` |  | shiki |
| `--shiki-token-link` | `#1971c2` | `#74c0fc` |  | shiki |
| `--shiki-token-parameter` | `#e8590c` | `#ffa94d` |  | shiki |
| `--shiki-token-punctuation` | `#495057` | `#ced4da` |  | shiki |
| `--shiki-token-string` | `#2f9e44` | `#69db7c` |  | shiki |
| `--shiki-token-string-expression` | `#2b8a3e` | `#8ce99a` |  | shiki |

