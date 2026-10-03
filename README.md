<h1 align="center">dsh-uistyle-template</h1>

<p align="center">DSH Web UI 的布局组件库 + 类型化设计 token：官方缺失的 Card / Page / Toolbar / Panel / Stack / SectionHeader，外加 427 个带编译期校验的 <code>--dsw-*</code> token。以 bundle 形式供其它 DSH Web 插件 <code>require</code>。</p>

<p align="center">
简体中文 |
<a href="README.en.md">English</a>
</p>

## 这是什么

一个**可被其它 DSH Web 插件复用的组件库 bundle**，包名 `@tak1208/dsh-uistyle-template`。它填补官方能力的两处空白：

1. **设计 token 没有类型面** —— 官方 427 个 `--dsw-*` / `--ds-*` / `--dsh-*` token 只以 CSS 字符串内联在主题包 `lib/client.js` 里，没有导出、没有类型，拼错一个字母只会静默失效。本库把它们提取成带校验的 TS 接口：拼错 token 是**编译错误**。
2. **官方没有布局组合件** —— `@deepseek-ai/dsh-client-ui-primitives` 只提供原子件（Button / Input / Menu / Modal / Toast …），没有 Card / Page / Toolbar / Panel / Stack / SectionHeader。每个插件都在自己重写这几件容器，本库把它们收敛成一套。

不做什么：不重做官方原子件；不做 Table / DataGrid / Select / DatePicker 这类高复杂度数据件；不定义或覆盖任何 CSS 变量（token 的运行时注入是官方主题包的职责）；不提供主题/皮肤。

## 特性

- **6 个布局件**，各自一个 CSS Module，颜色 / 圆角 / 阴影 / 动效全部取自 `--dsw-*` / `--ds-*`，**明暗自适应，零硬编码色值**。
- **427 个 token 的编译期校验**：`token()` / `tokenStyle()` / `setToken()` 的参数都是 token 名联合类型。
- **与官方视觉同源**：取值、几何、字号都对齐官方 primitives 与主题 token，不引入第二套设计语言。
- **只依赖 shell 种子表**：产物只 `require` 页面模块表里已有的模块（当前是 `react/jsx-runtime`），不内联 React，不新增运行时依赖。

## 接入（消费者插件）

已发布到 npm：**[`@tak1208/dsh-uistyle-template`](https://www.npmjs.com/package/@tak1208/dsh-uistyle-template)**（`latest = 0.1.0`，public）。

1. 在 DSH 会话里用插件管理器的 `install_bundle`，target 填包名（要锁版本就写 `@tak1208/dsh-uistyle-template@0.1.0`）：

   ```text
   @tak1208/dsh-uistyle-template
   ```

   该包自带的 `cordis.patch.yml` 会把它插成一条 Loader entry，并把包名写进 profile 的 `dsh.profile.bundles`。
2. 你的插件 `package.json` 声明外部模块请求：

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

3. 浏览器半区照常 require：

   ```js
   const { Card, Stack, token } = require('@tak1208/dsh-uistyle-template');
   ```

   `<pkg>/client` 与裸包名由扁平模块图归一到同一行，两种写法等价。

> **TypeScript 用户注意**：请 `import { Card } from '@tak1208/dsh-uistyle-template/client'`。裸包名的 `exports['.']` 指向 Host 半区（空的 `apply()`，只用于满足 bundle 行），只有 `./client` 子路径的 `types` 才是组件与 token 接口。

> **想改本库本身**：先 `pnpm install && pnpm -r build`，再把 `install_bundle` 的 target 换成 `packages/uistyle` 的绝对路径 —— 会以 `link:` 装入，改完刷新页面即生效。

## 使用：布局组件

```tsx
import { Card, Page, Panel, SectionHeader, Stack, Toolbar } from '@tak1208/dsh-uistyle-template/client';

<Page title="会话统计" description="最近 7 天" maxWidth={720}>
  <Stack gap={16}>
    <SectionHeader title="概览" actions={<button>刷新</button>} />
    <Panel elevated>
      <Toolbar align="center">
        <span>左</span>
        <span>右</span>
      </Toolbar>
      <Card title="今日" subtitle="按会话聚合" padded>
        内容
      </Card>
    </Panel>
  </Stack>
</Page>;
```

| 组件 | 专有 props | 说明 |
| --- | --- | --- |
| `Card` | `title` `subtitle` `actions` `padded=true` | 基础表面：可选 header + 内容区，layer-1 填充 + 0.5px 描边 |
| `Page` | `title` `description` `actions` `maxWidth` | 页面外框：24px gutter + 居中列，heading 与正文同宽 |
| `Toolbar` | `align='center'` | 横向行，8px gap；不画自己的表面，可放进 Page / Card / Panel |
| `Panel` | `padded=true` `elevated=false` | 通用容器：layer-2 填充，`elevated` 只换一个 elevation token |
| `Stack` | `direction='column'` `gap=12` `align='stretch'` `justify='start'` | 单轴 flex 与间距原语；`gap` 传数字按 px 处理 |
| `SectionHeader` | `title`（必填）`description` `actions` | 区块标题 + 尾部 0.5px 分隔线，可选 `children` 作为正文 |

每个组件都另外接受 `HTMLAttributes<HTMLElement>`（`onClick` / `data-*` / `aria-*` …）与 `className` / `style` / `children`。Card / Page / SectionHeader 的 `title` 是 `ReactNode`，因此这三个组件的 HTML `title`（浏览器工具提示）属性被显式 `Omit` 掉。

## 使用：token 接口

```ts
import { token, tokenStyle, setToken, tokenMeta } from '@tak1208/dsh-uistyle-template/client';

token('--dsw-alias-label-primary');                      // → 'var(--dsw-alias-label-primary)'
token('--dsw-alias-brand-primary', 'transparent');       // 带兜底值
tokenStyle({ color: '--dsw-alias-label-secondary' });    // React 内联样式对象
setToken(el, '--dsw-alias-bg-layer-1', 'red');           // 类型化的 setProperty
tokenMeta['--dsw-alias-bg-layer-1'].theme;               // 'light+dark'
```

| 导出 | 用途 |
| --- | --- |
| `token(name, fallback?)` | 取 `var(...)` 表达式 |
| `tokenStyle(decls)` | CSS 属性 → token 名的对象转内联样式 |
| `tokenClass(name)` | 生成 `dsh-token-…` 类名 |
| `setToken(el, name, value)` | 类型化的 `el.style.setProperty`（`setProperty` 本身无法用声明合并收窄） |
| `tokens` | 427 个 token 名 → `var(...)` 的常量表 |
| `tokenMeta` | 每个 token 的 `layer` / `purpose` / `theme` / `scopes` / `usageCount` |
| `themeVaryingTokens` `themeInvariantTokens` `paletteTokens` `semanticTokens` | 明暗变化 / 明暗一致 / 原始色板 / 语义层分组 |
| `TokenName` | token 名联合类型 |

人类可读的完整清单见 [`TOKENS.md`](packages/uistyle/TOKENS.md)。

## 实现

- **双半区 bundle**：Host 侧 `lib/index.js` 是 no-op `apply()`（对齐官方 `dsh-client-ui-renderer`）；浏览器侧 `lib/client.js` 是 `window.__ModuleLoader__.load({ id, factory })` 的懒加载 CJS 工厂 —— 脚本只注册工厂，模块体（含 CSS 注入）在首次 require 时才执行。
- **CSS Modules 自备构建插件**：官方那套「注入 `<style data-plugin-css="<pkg>/<file>">` + 导出 scoped 类名表」的 rolldown 插件没有随包发布，本库在 [`tools/css-modules.mjs`](packages/uistyle/tools/css-modules.mjs) 复刻了它的产物形态；`.d.ts` 由 `tsc -p tsconfig.build.json` 产出。
- **token 生成链**：主题 bundle → `tools/extract-tokens.mjs` → `tokens.json` → `tools/gen-types.mjs` → `src/client/tokens.ts`；`tools/build-reference.mjs` → `TOKENS.md`。升级 dsh 后重跑 `pnpm -r build` 即可。

## 目录结构

```text
dsh-uistyle-template/
├── package.json              # 私有根：workspace 编排 + 统一 scripts（pnpm）
├── pnpm-workspace.yaml       # packages: ['packages/*']
├── tsconfig.base.json        # 共享 TS 编译选项
├── .plan/plan.md             # 编码真源：代码结构与开发进度
├── AGENTS.md                 # 项目级指南（含项目地图）
└── packages/uistyle/         # 唯一产物包 @tak1208/dsh-uistyle-template
    ├── package.json          # dsh.bundle.patch + dsh.client，exports: . / ./client
    ├── cordis.patch.yml      # Loader 补丁：insert 一行
    ├── tsdown.config.ts      # host(esm) + client(cjs 工厂包装) 两个 config
    ├── src/index.ts          # Host 半区：no-op apply()
    ├── src/client/           # 客户端入口 / 生成物 tokens.ts / 6 个组件
    ├── typecheck/            # 消费端断言 + token 拼写对照组
    ├── tools/                # token 生成三件套 + CSS Modules 插件 + verify 脚本
    └── lib/                  # 构建产物（git 忽略）
```

## 开发

要求：Node ≥ 22、pnpm 11、本机装有 dsh `0.2.0-rc.2`（token 提取要读官方主题 bundle）。

```bash
pnpm install
pnpm -r build       # token 提取 → 类型生成 → tsdown 打包 + .d.ts
pnpm -r typecheck   # 先产出 lib/types，再对源码与「发布面」断言
pnpm -r verify      # 三重验证：消费端断言 + 参与编译确认 + 对照组
```

`verify` 的第 3 项是**对照组**：故意拼错一个 token 必须报错 —— 否则说明类型检查在空转，前两项结论无效。

## 已知限制

- 当前仍是 `0.x`：按 semver 约定，`0.y.z` 的 API 不视为稳定，minor 升级可能包含破坏性变更 —— 升级前请读对应 Release 说明。
- 不重做官方原子件（Button / Input / Menu / Modal / Toast / Tooltip … 直接用 primitives）。
- 不做高复杂度数据件（Table / DataGrid / Select / DatePicker；`SettingsForm` 官方已有）。
- token 只提供类型面与取值辅助，**不注入 CSS 变量定义**。
- 组件不含 `pointer-events` / `position` / 尺寸规则：把整页组合注册进 `shell.overlay` 这类浮层槽位，会被该槽位拉伸并遮住 UI（浮层只放小型浮动件）。
- 依赖 DSH 的客户端模块图、主题 token 与 `dsh.client` 清单；dsh 升级后按 `COMPATIBLE_VERSION` 复核。

## 兼容性

[`COMPATIBLE_VERSION`](COMPATIBLE_VERSION) 第一行 = 开发所基于的 dsh 版本，第二行 = 上次检查日期。当前基于 `0.2.0-rc.2`（2026-10-02）。

## 许可证

[MIT](./LICENSE)
