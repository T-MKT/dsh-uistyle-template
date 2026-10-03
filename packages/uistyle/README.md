# @tak1208/dsh-uistyle-template

DSH Web UI 的**布局组件库 + 类型化设计 token**：官方缺失的 Card / Page / Toolbar / Panel / Stack / SectionHeader，外加 427 个带编译期校验的 `--dsw-*` token。以 bundle 形式供其它 DSH Web 插件 `require`。

> 完整文档（中文/English）、目录结构与关键机制见仓库：
> <https://github.com/T-MKT/dsh-uistyle-template>

## 安装

需要 dsh `0.2.0-rc.2` 与一个 Web（浏览器）profile。在 DSH 会话里用插件管理器的 `install_bundle`，target 填包名（要锁版本就带 `@0.1.0`）：

```text
@tak1208/dsh-uistyle-template
```

它会写入 profile 的 `dependencies` 与 `dsh.profile.bundles`；刷新页面即可。

## 在你的插件里使用

1. 你的插件必须是 bundle（有 `cordis.patch.yml` + `dsh.client`），并声明外部模块请求：

   ```json
   {
     "dsh": {
       "client": {
         "platform": "web",
         "external": ["@tak1208/dsh-uistyle-template"]
       }
     }
   }
   ```

2. 浏览器半区照常 require：

   ```js
   const { Card, Stack, token } = require('@tak1208/dsh-uistyle-template');
   ```

3. **TypeScript 请 import `'@tak1208/dsh-uistyle-template/client'`** —— 裸包名的 `exports['.']` 指向 Host 半区（空的 `apply()`，只用于满足 bundle 行），只有 `./client` 子路径的 `types` 才暴露组件与 token 接口。

> 构建你自己的插件时，记得把本包标为 external（例如 tsdown 的 `deps.neverBundle: ['@tak1208/dsh-uistyle-template']`），否则会被内联进去，出现两份组件与两份样式注入。

## 组件

| 组件 | 专有 props | 说明 |
| --- | --- | --- |
| `Card` | `title` `subtitle` `actions` `padded=true` | 基础表面：可选 header + 内容区 |
| `Page` | `title` `description` `actions` `maxWidth` | 页面外框：24px gutter + 居中列 |
| `Toolbar` | `align='center'` | 横向行、8px gap，不画自有表面 |
| `Panel` | `padded=true` `elevated=false` | 通用容器：layer-2 填充 |
| `Stack` | `direction='column'` `gap=12` `align='stretch'` `justify='start'` | 单轴 flex 与间距原语 |
| `SectionHeader` | `title`（必填）`description` `actions` | 标题块 + 0.5px 底线 |

颜色 / 圆角 / 阴影 / 动效全部走 `--dsw-*` / `--ds-*`，明暗自适应，零硬编码色值。所有组件另接受 `HTMLAttributes<HTMLElement>` 与 `className` / `style` / `children`。

## Token

```ts
import { token, tokenStyle, setToken, tokenMeta } from '@tak1208/dsh-uistyle-template/client';

token('--dsw-alias-label-primary');                    // → 'var(--dsw-alias-label-primary)'
tokenStyle({ color: '--dsw-alias-label-secondary' });  // React 内联样式对象
setToken(el, '--dsw-alias-bg-layer-1', 'red');         // 类型化的 setProperty
tokenMeta['--dsw-alias-bg-layer-1'].theme;             // 'light+dark'
```

导出：`token` / `tokenStyle` / `tokenClass` / `setToken` / `tokens` / `tokenMeta` / `themeVaryingTokens` / `themeInvariantTokens` / `paletteTokens` / `semanticTokens` / `TokenName`。完整清单见仓库的 [`TOKENS.md`](https://github.com/T-MKT/dsh-uistyle-template/blob/main/packages/uistyle/TOKENS.md)。

## 兼容性

基于 dsh `0.2.0-rc.2`（仓库根的 `COMPATIBLE_VERSION` 记录基线）。dsh 升级后如出现异常，请到仓库提 issue。

## 许可证

[MIT](./LICENSE) © 2026 Tak1208
