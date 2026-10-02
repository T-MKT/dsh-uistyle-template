# dsh-uistyle-template：代码结构与开发进度

> 本文档是本次编码的真源：确定后直接照着它编码；节点编号在编码期间保持不变（提交信息用它指明完成到哪）。
> 状态：`- [ ]` 未完成 / `- [x]` 已完成。一个最小节点完成 = 其下全部要点已勾选，且「完成判据」成立。
>
> 进度（2026-10-02）：§3.1 ~ §3.6 全部完成。`pnpm -r build` / `pnpm -r typecheck` / `pnpm -r verify` 全绿；§3.5 冒烟在本机真 DSH（profile `web`）跑通，库渲染的组件经人工目视确认（明暗自适应、布局正常），profile 临时改动已逐字节回滚。提交：无（未提交，分支 `feat/start`）。
>
> **实现期修正**（与本文档正文不一致处以本块为准）：
> 1. **`title` 与 `HTMLAttributes.title` 冲突**：`{ title?: ReactNode } & LayoutProps` 会求值为 `string & ReactNode`，JSX 标题直接 TS2322。Card / Page / SectionHeader 改为 `& Omit<LayoutProps, 'title'>`（`types.ts` 里已写明该陷阱）。
> 2. **消费端类型走 `./client` 子路径**：包名裸 specifier 在 **运行时** 由扁平模块图归一化到 client 半区（`<pkg>/client` 与裸名等价），但 **类型** 上 `exports['.']` 指向 Host 半区（no-op `apply()`）。因此 `typecheck/` 的消费端断言 import `@tak1208/dsh-uistyle-template/client`；`dsh.client.external` 仍按 §1 假设 3 声明。
> 3. **CSS Modules 构建插件自备**：官方把 `.module.css` 编译成「注入 `<style data-plugin-css>` + 导出 scoped 类名表」的 rolldown 插件**未随包发布**，故本库自写 `packages/uistyle/tools/css-modules.mjs`（复刻官方产物形态：虚拟模块 `\0dsh-css:<abs>.mjs`、`data-plugin` / `data-plugin-css` 去重、scoped 类名）。`.d.ts` 由 `tsc -p tsconfig.build.json` 产出（对齐 session-notification 先例），tsdown 只负责打包。
> 4. **不声明 `peerDependencies: react`**：react / react-dom 由 shell 种子表在运行时提供（官方 primitives / renderer / session-notification 同样只放 devDependencies）；声明为 peer 会让 pnpm 往消费者 profile 自动装一份重复的 react。
> 5. **§3.5 夹具槽位修正**：首版把整页 `Page` 组合注册进 `shell.overlay`（窗口级浮层，其单元格会把 occupant 拉伸到整帧），导致整页盒子遮住 UI 并吞掉指针事件；已改为 `settings.general.item`（正常文档流行），组件本身不含任何 `pointer-events` / `position` / 尺寸规则。
> 6. **命令顺序**：`typecheck` 会先跑 `tsc -p tsconfig.build.json` 产出 `lib/types`，再对「发布面」做断言；故 `pnpm -r typecheck` / `pnpm -r verify` 不再依赖先前的手工 build。

## 1 需求与范围

**需求**：做一个**可被其它 DSH Web 插件复用的组件库 npm 包**，填补官方能力的两处空白：

1. **设计 token 导出层** —— 官方 427 个 `--dsw-*` / `--ds-*` / `--dsh-*` token 只以 CSS 字符串内联在主题包 `lib/client.js` 里，无导出、无类型；拼错 token 静默失效。本项目把 token 提取成**带类型校验的 TS 接口**（此项已完成原型，本次工程化）。
2. **官方缺失的布局组合件** —— 官方 `@deepseek-ai/dsh-client-ui-primitives` 只提供原子件（Button/Input/Menu/Modal…），**没有** Card、Page、Toolbar、Panel、Stack、SectionHeader 等布局件（已逐一确认其 exports 中没有）。

最终形态：其它插件的 `dsh.client.external` 声明本库，`require` 得到组件与 token 接口。

**不做的事**：

- 不重新实现官方已有的原子件（Button/Input/Menu/Modal/Toast/Tooltip 等）——官方 primitives 已被 shell 冻结进种子表，任何插件可免费 `require`，重做是重复劳动且会与官方视觉漂移。
- 不做高复杂度数据件（Table/DataGrid/Select/DatePicker/SettingsForm）——首版范围外的复杂度，官方 `SettingsForm` 已存在。
- 不改动、不 fork 官方 `@deepseek-ai/*` 任何源码（项目 AGENTS.md 明令）。
- 不做主题/皮肤（改配色），那是另一类插件，生态已极拥挤。
- 不写 README（项目写完另说）、不写 COMPATIBLE_VERSION（开发完再写）。
- 不提供运行时 CSS token 注入——token 的 CSS 变量定义仍由官方主题包在运行时注入，本库只提供**类型面 + 文档 + 取值辅助**，不越权定义同名变量。

**关键假设**（均为本机 dsh `0.2.0-rc.2` 实测得出，与事实不符时先改本节）：

1. **宿主模块图是扁平的**：浏览器侧的模块系统是懒加载 CJS 工厂表（`window.__ModuleLoader__.load({id, factory})`）。一个包能成为"动态包行"（被 serve `client.js`、可被 `require`）的条件是——它是 Loader 的一个 entry，且声明了 `dsh.client`。宿主只扫描 **Loader entries** 里的 `dsh.client`。
2. **第三方库要成为可共享的运行时行，必须自己是 bundle**：Loader entry 来自 bundle patch 的 `insert`。故本库必须带 `dsh.bundle.patch`（极简：insert 一行，`id` 用短名 `dsh-uistyle-template`、`name` 用完整 scoped 包名 `@tak1208/dsh-uistyle-template`，对齐 session-notification 先例）+ `dsh.client`（`platform:'web'`）+ 一个 **no-op Host 侧入口**。官方先例：`@deepseek-ai/dsh-client-ui-renderer` 的 `lib/index.js` 就是 `function apply() {}`，注释写明 "Provides no host-side behavior"。
3. **消费者通过 `dsh.client.external` 声明依赖**：`external` 里的 specifier 必须命中一个已存在的包行（`<pkg>/client` 与裸 `<pkg>` 等价），宿主按模块图拓扑排序，保证库行先于消费者行加载；声明缺失供应商、自依赖、环会抛错。因此消费者要在 `dsh.client.external` 里写本库包名，并在 profile 里把本库加入 `dsh.profile.bundles` 使其成为 entry。
4. **构建器用 tsdown**：官方 client 包都用 tsdown 产出 `lib/client.js`（`exports` 的 `./client` 入口），产物是 `window.__ModuleLoader__.load(...)` 工厂格式。本库沿用。
5. **运行时外部依赖固定为三件**：`react`、`react-dom`（及 `react/jsx-runtime`）、`@deepseek-ai/dsh-client-ui-primitives`。这三者都在 shell 冻结的种子表 `PLATFORM_MODULES` 里，本库 `client.js` 必须把它们 external 掉（不内联），运行时 `require` 拿到同一个实例。
6. **类型来源**：`@deepseek-ai/dsh-client-ui-primitives` 的 `.d.ts` 从全局 npm 根解析（已确认存在）；`@types/react` / `@types/react-dom` 需作为 devDependency 安装（本机 profile 无，已确认）。
7. **包名**：`@tak1208/dsh-uistyle-template`（scope 用 npm 用户名 `@tak1208`，非 GitHub 用户名 `@T-MKT`）。仓库名 `dsh-uistyle-template` 与包名末尾一致，目录 `packages/uistyle` 为内部简称。

## 2 代码结构

仓库从"单包 + 根级工具脚本"重组成 pnpm workspace 单包结构（一个库包 + 根级编排；不需要多包，避免无谓复杂）。

```text
dsh-uistyle-template/
├── package.json                  # 私有根：workspace 编排、统一 scripts（pnpm）
├── pnpm-workspace.yaml           # packages: ['packages/*']
├── tsconfig.base.json            # 共享 TS 编译选项
├── .gitignore
├── AGENTS.md                     # 项目约定 + 项目地图（本次回填）
├── .plan/
│   └── plan.md                   # 本文档
└── packages/
    └── uistyle/                  # 组件库包（唯一的产物包）
        ├── package.json          # name=@tak1208/dsh-uistyle-template, dsh.bundle.patch + dsh.client
        ├── cordis.patch.yml      # insert 一行：id=dsh-uistyle-template, name=@tak1208/dsh-uistyle-template
        ├── tsdown.config.ts      # client 入口 external 掉 react*/primitives，产物 lib/client.js
        ├── tsconfig.json         # 继承 base，lib 指向 DOM
        ├── src/
        │   ├── index.ts          # Host 侧 no-op：export function apply() {}（对齐 renderer）
        │   ├── client/
        │   │   ├── index.ts      # 客户端入口：re-export 组件 + token 接口（消费方 require 这里）
        │   │   ├── tokens.ts     # 生成物：token 联合类型 + 常量表 + token()/setToken()（由工具生成）
        │   │   └── components/
        │   │       ├── Card.tsx          # 卡片容器
        │   │       ├── Card.module.css
        │   │       ├── Page.tsx          # 页面区段
        │   │       ├── Page.module.css
        │   │       ├── Toolbar.tsx       # 工具栏
        │   │       ├── Toolbar.module.css
        │   │       ├── Panel.tsx         # 面板
        │   │       ├── Panel.module.css
        │   │       ├── Stack.tsx         # flex 布局
        │   │       ├── Stack.module.css
        │   │       ├── SectionHeader.tsx # 区块标题
        │   │       ├── SectionHeader.module.css
        │   │       └── types.ts          # 组件公共 props 类型
        │   └── (tools 不再放这里，见下)
        ├── lib/                   # 构建产物（tsdown 输出，git 忽略）
        └── tools/                 # token 生成工具（从仓库根迁入）
            ├── extract-tokens.mjs
            ├── build-reference.mjs
            └── gen-types.mjs
```

**仓库根现有文件的去向**（一次性重组，不留兼容层）：

| 现路径 | 去向 | 说明 |
| --- | --- | --- |
| `tools/extract-tokens.mjs` | `packages/uistyle/tools/extract-tokens.mjs` | 迁移，仅改输出路径 |
| `tools/build-reference.mjs` | `packages/uistyle/tools/build-reference.mjs` | 迁移，输出到库包内 |
| `tools/gen-types.mjs` | `packages/uistyle/tools/gen-types.mjs` | 迁移，输出 `src/client/tokens.ts` |
| `tools/verify-types.sh` | `packages/uistyle/tools/verify-types.sh` | 迁移，路径改指向库包 |
| `src/tokens.ts`（生成物） | `packages/uistyle/src/client/tokens.ts` | 生成物，重跑生成 |
| `tokens.json` / `usage.json` / `TOKENS.md` | `packages/uistyle/` | 生成物，重跑生成 |
| `typecheck/*.ts` | `packages/uistyle/typecheck/*.ts` | 迁移，import 路径改库内相对 |
| 根 `tsconfig.json` | 拆成 `tsconfig.base.json` + 库 `tsconfig.json` | 重组 |

| 文件 | 新增/修改 | 职责 |
| --- | --- | --- |
| `packages/uistyle/package.json` | 新增 | 包元数据：`dsh.bundle.patch`、`dsh.client`、`exports`（`.` / `./client` / `./package.json`）、peerDeps（react / react-dom / primitives） |
| `packages/uistyle/cordis.patch.yml` | 新增 | 极简 bundle patch：insert 一行把本包注册为 Loader entry |
| `packages/uistyle/src/index.ts` | 新增 | Host 侧 no-op `apply()`，对齐官方 renderer |
| `packages/uistyle/src/client/index.ts` | 新增 | 客户端唯一入口：re-export 全部组件 + token 接口 |
| `packages/uistyle/src/client/tokens.ts` | 生成 | token 联合类型 + 常量表 + `token()` / `tokenStyle()` / `setToken()` / 元数据 |
| `packages/uistyle/src/client/components/*.tsx` | 新增 | 6 个布局组件，各配一个 `.module.css`（token 驱动，明暗自适应） |
| `packages/uistyle/src/client/components/types.ts` | 新增 | 组件公共 props 类型，供并行 Agent 冻结引用 |
| `packages/uistyle/tsdown.config.ts` | 新增 | external 配置 + client 入口 + `lib/client.js` 输出 |
| `packages/uistyle/tools/*` | 迁移 | token 生成三件套 + verify 脚本 |

**关键接口与数据流**：

```
[提取期] 官方主题包 lib/client.js ──extract-tokens.mjs──▶ tokens.json ──gen-types.mjs──▶ src/client/tokens.ts
                                                           └───────────build-reference.mjs──▶ TOKENS.md
[构建期] src/client/index.ts ──tsdown(external: react*/primitives)──▶ lib/client.js
[运行期] 消费者插件 bundle ──require('@tak1208/dsh-uistyle-template')──▶ 本库 lib/client.js ──require──▶ react / react-dom / primitives（种子表共享实例）
```

**冻结的签名**（并行的 Agent 按此写码，不得自行改动）：

```ts
// packages/uistyle/src/client/components/types.ts —— 所有布局组件的公共 props 基类
import type { CSSProperties, ReactNode, HTMLAttributes } from 'react';

/** 所有布局组件共有的基础 props。 */
export interface LayoutProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Stack 的方向与对齐。 */
export type StackDirection = 'row' | 'column';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around';
```

```ts
// 各组件签名（JSDoc 为行为契约）
export function Card(props: {
  title?: ReactNode;          // 卡片标题，渲染于头部
  subtitle?: ReactNode;       // 标题下的次要说明
  actions?: ReactNode;        // 头部右侧操作区
  padded?: boolean;           // 默认 true，false 则内容区无内边距
} & LayoutProps): JSX.Element;

export function Page(props: {
  title?: ReactNode;          // 页面大标题
  description?: ReactNode;    // 标题下说明
  actions?: ReactNode;        // 标题右侧操作区
  maxWidth?: number | string; // 内容最大宽度，默认 undefined（撑满）
} & LayoutProps): JSX.Element;

export function Toolbar(props: {
  align?: StackAlign;         // 垂直对齐，默认 'center'
} & LayoutProps): JSX.Element; // 横向工具条，子项间 gap

export function Panel(props: {
  padded?: boolean;           // 默认 true
  elevated?: boolean;         // 默认 false；true 加阴影层级
} & LayoutProps): JSX.Element;

export function Stack(props: {
  direction?: StackDirection; // 默认 'column'
  gap?: number | string;      // 默认 12
  align?: StackAlign;         // 交叉轴对齐，默认 'stretch'
  justify?: StackJustify;     // 主轴对齐，默认 'start'
} & LayoutProps): JSX.Element;

export function SectionHeader(props: {
  title: ReactNode;           // 必填
  description?: ReactNode;
  actions?: ReactNode;
} & LayoutProps): JSX.Element;
```

```ts
// token 接口（生成物，签名已确定）—— 并行 Agent 直接 import
export type TokenName = keyof typeof tokens;
export function token(name: TokenName, fallback?: string): string;
export function tokenStyle(decls: Record<string, TokenName>): Record<string, string>;
export function setToken(el: { style: CSSStyleDeclaration }, name: TokenName, value: string): void;
export const tokenMeta: Readonly<Record<TokenName, TokenMeta>>;
```

## 3 开发进度

### 3.1 仓库重组为 workspace + 工具迁移

#### 3.1.1 建 pnpm workspace，迁移 token 工具链到库包

- [x] 根 `package.json` 改为私有 workspace 编排：`packageManager: pnpm`、scripts 聚合（`build`/`typecheck`/`verify` 转发到 `packages/uistyle`）
- [x] 新建 `pnpm-workspace.yaml`（`packages: ['packages/*']`）
- [x] 新建 `tsconfig.base.json`（`strict`、`lib: [ES2022, DOM]`、`jsx: react-jsx`、`moduleResolution: Bundler`）
- [x] 迁移 `tools/{extract-tokens,build-reference,gen-types}.mjs` → `packages/uistyle/tools/`，改输出路径为库包内
- [x] 迁移 `tools/verify-types.sh` → 库包内，路径改库内相对
- [x] 迁移 `typecheck/`、`tokens.json`、`usage.json`、`TOKENS.md` 到库包
- [x] 重跑生成，确认 `packages/uistyle/src/client/tokens.ts` 落地、427 token 数不变
- **完成判据**：`pnpm -r build` 与 `pnpm -r verify` 在重组后仍通过；根目录不再残留 `tools/` `src/` `tokens.json` 等旧文件

### 3.2 库包骨架（build 能产出一个可被 serve 的空 client.js）

#### 3.2.1 包元数据 + 极简 bundle patch + no-op Host 入口

- [x] `packages/uistyle/package.json`：`name: '@tak1208/dsh-uistyle-template'`、`type: module`、`exports`（`.`→`lib/index.js`、`./client`→`lib/client.js`、`./package.json`）、`dsh.bundle.patch: './cordis.patch.yml'`、`dsh.client: { platform: 'web' }`、peerDeps（react/react-dom/primitives）、devDeps（tsdown/typescript/@types/react/@types/react-dom/primitives）
- [x] `cordis.patch.yml`：`- insert: [{ id: dsh-uistyle-template, name: '@tak1208/dsh-uistyle-template' }]`
- [x] `src/index.ts`：`export function apply() {}`
- [x] `tsdown.config.ts`：client 入口 `src/client/index.ts` → `lib/client.js`，external `react*`、`react-dom*`、`@deepseek-ai/dsh-client-ui-primitives`
- [x] `src/client/index.ts` 暂只 re-export tokens
- **完成判据**：`pnpm --filter @tak1208/dsh-uistyle-template build` 产出 `lib/client.js`，且产物里对 react/primitives 是 `require(...)` 而非内联（grep 验证）

### 3.3 组件层（内部并行：token 面 / 组件 / 类型契约各自独立）

> 本节三件互不写对方文件，依赖 §2 冻结签名。执行时同一条消息并发派发 3 个 subagent。

#### 3.3.1 布局组件（Agent A / B / C 并行）

- [x] **Agent A**：`src/client/components/Card.tsx` + `Card.module.css` — 卡片容器（title/subtitle/actions/padded）
- [x] **Agent B**：`src/client/components/{Page,Toolbar}.tsx` + 各自 `.module.css` — 页面区段 + 工具条
- [x] **Agent C**：`src/client/components/{Panel,Stack,SectionHeader}.tsx` + 各自 `.module.css` — 面板 + flex 布局 + 区块标题
- [x] 所有 CSS 一律走 `var(--dsw-*)` / `var(--ds-*)` token（从 `tokens.ts` 取名字），明暗自适应；不写死色值
- [x] `src/client/index.ts` 导出全部 6 个组件 + `types.ts` 里的类型
- **完成判据**：`pnpm --filter @tak1208/dsh-uistyle-template typecheck` 通过；`src/client/index.ts` 的导出与 §2 冻结签名逐条一致

### 3.4 构建与类型产物打通

#### 3.4.1 tsdown 产出可用 client.js + d.ts 类型

- [x] 确认 `lib/client.js` 为 `__ModuleLoader__.load` 工厂格式（对齐官方产物）
- [x] 确认 `lib/types/client/index.d.ts` 生成且被 `exports['./client'].types` 指向
- [x] 写一个最小消费端断言：`typecheck/` 里 import `@tak1208/dsh-uistyle-template`，用 §2 冻结签名调用全部组件与 token 函数
- **完成判据**：`pnpm --filter @tak1208/dsh-uistyle-template build && pnpm --filter @tak1208/dsh-uistyle-template verify` 全绿

### 3.5 运行时冒烟验证（本机真 DSH 加载）

#### 3.5.1 极简 consumer 验证库能被宿主 serve 并 require

- [x] 在 profile（`~/.dsh/profiles/web`）临时把本库加入 `dsh.profile.bundles`（或以 `file:` 依赖 + bundles 加入），记录操作步骤
- [x] 写一个最小消费者入口（临时文件或独立小包）：`dsh.client.external: ['@tak1208/dsh-uistyle-template']`，`require('@tak1208/dsh-uistyle-template')` 后渲染一个 `Card` 到页面
- [x] 浏览器验证：库的 `client.js` 被 `/plugins` serve、无 "missing supplier"/cycle 报错、Card 正确渲染且跟随明暗主题
- [x] 冒烟通过后**回滚 profile 的临时改动**（不污染用户 profile）
- **完成判据**：真 DSH Web 页面出现库渲染的 Card，且控制台无模块图错误；profile 恢复原状
- **操作步骤与结果（2026-10-02）**：
  1. 备份 `~/.dsh/profiles/web/{package.json,cordis.patch.yml,pnpm-lock.yaml,pnpm-workspace.yaml}`；
  2. `plugin_manager install_bundle` target = `packages/uistyle` 绝对目录 → `application: applied`、`warnings: []`（pnpm 以 `link:` 装入），Loader entry `include:dsh-uistyle-template` `fiberPhase: active`；
  3. 同法装入临时 consumer `/tmp/dsh-uistyle-smoke`（`dsh.client.external: ['@tak1208/dsh-uistyle-template']`，`require('@tak1208/dsh-uistyle-template')`）：首版注册进 `shell.overlay`，人工目视确认组件与明暗正确，但整页 `Page` 被该浮层单元格拉伸成整帧盒子并吞掉指针事件（槽位用法错误，见「实现期修正」5）；改注册进 `settings.general.item` 后 `Slots.listSubTree` 显示 occupant `{id: uistyle-smoke, order: 99, active: true}`，人工目视确认 SectionHeader / Card / Stack 间距 / elevated Panel 布局正常；
  4. 卸载两个 bundle：profile 四个文件与备份逐字节一致，Loader entries 由 200 回到 198，live slot 树不再有 `uistyle-smoke`，安装期新建的两个 `node_modules` 软链已删除。

### 3.6 收尾

#### 3.6.1 回填 AGENTS.md 项目地图

- [x] 在 `AGENTS.md` 追加「项目地图」：目录树、模块职责、构建/验证命令、关键机制（扁平模块图、bundle+client 形态、external 依赖）
- **完成判据**：AGENTS.md 的项目地图与实际目录树一致，命令可直接照抄执行
