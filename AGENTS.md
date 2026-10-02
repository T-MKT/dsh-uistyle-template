# AGENTS.md

## 环境要求
项目全局使用 `pnpm` 进行操作。

当前项目兼容 `dsh` 版本：`0.2.0-rc.2`

## 工作原则
- **禁止修改 `dsh` 源代码。**
- 高内聚低耦合，文件及文件夹职责清晰。
- 保持简洁。如无必要，勿增实体。

- 不保留向后兼容性。直接移除过时的路径，而不是添加兼容层、回退机制或迁移逻辑。
- 注意 `dsh` 的接口可用性。

## 项目地图

> 对应 `.plan/plan.md`；本文档随代码结构同步维护。

```text
dsh-uistyle-template/
├── package.json              # 私有根：workspace 编排 + 统一 scripts（pnpm）
├── pnpm-workspace.yaml       # packages: ['packages/*']
├── tsconfig.base.json        # 共享 TS 编译选项（strict / DOM / react-jsx）
├── .plan/plan.md             # 编码真源：代码结构与开发进度
└── packages/
    └── uistyle/              # 唯一的产物包，包名 @tak1208/dsh-uistyle-template
        ├── package.json      # dsh.bundle.patch + dsh.client，exports: . / ./client
        ├── cordis.patch.yml  # 极简：insert 一行注册为 Loader entry
        ├── tsdown.config.ts  # 两个 config：host(esm) + client(cjs 工厂包装)
        ├── tsconfig.json     # 继承 base：src + typecheck
        ├── tsconfig.build.json # 只产 .d.ts 到 lib/types
        ├── src/
        │   ├── index.ts      # Host 侧 no-op：export function apply() {}
        │   └── client/
        │       ├── index.ts          # 客户端唯一入口：6 组件 + token 接口
        │       ├── css-modules.d.ts  # *.module.css 的 ambient 声明
        │       ├── tokens.ts         # 生成物：427 token + token()/setToken()
        │       └── components/       # 6 个布局件，各配一个 .module.css
        ├── typecheck/        # 消费端断言（走包名 ./client）+ 拼写对照组
        ├── tokens.json       # token 生成物（extract-tokens 产出）
        ├── usage.json        # shell 产物中 token 引用统计（生成物输入）
        ├── TOKENS.md         # token 生成物（人读清单）
        ├── lib/              # 构建产物（index.js / client.js / types，git 忽略）
        └── tools/
            ├── extract-tokens.mjs   # 官方主题 bundle → tokens.json
            ├── build-reference.mjs  # tokens.json → TOKENS.md
            ├── gen-types.mjs        # tokens.json → src/client/tokens.ts
            ├── css-modules.mjs      # rolldown 插件：.module.css → 注入 style + scoped 类名表
            └── verify-types.sh      # 三重验证（含对照组）
```

**命令**（仓库根，顺序无依赖）：

- `pnpm -r build` —— 重建所有包（token 提取 → 类型生成 → tsdown 打包 + `.d.ts`）
- `pnpm -r typecheck` —— 先产出 `lib/types`，再对源码与「发布面」断言（`tsc --noEmit`）
- `pnpm -r verify` —— 三重验证（含对照组，见 `packages/uistyle/tools/verify-types.sh`）

**消费者用法**（另一个 DSH Web 插件）：

- `dsh.client.external: ['@tak1208/dsh-uistyle-template']`，并把本库加入 profile 的 `dsh.profile.bundles`（或 `plugin_manager install_bundle` 指定包目录，会以 `link:` 装入）。
- 运行时 `require('@tak1208/dsh-uistyle-template')` 拿到 **client 半区**（`<pkg>/client` 与裸名由扁平模块图归一，两者等价）。
- **TS 里请 import `@tak1208/dsh-uistyle-template/client`**：裸名的 `exports['.']` 指向 Host 半区（no-op `apply()`），只有 `./client` 的 `types` 是组件与 token 接口。

**关键机制**（实现时不可违背）：

1. **扁平模块图**：浏览器侧是懒加载 CJS 工厂表；一个包能被 `require` 的前提是它既是 Loader entry、又声明了 `dsh.client`。
2. **库必须自带 bundle**：靠 `cordis.patch.yml` 的 `insert` 成为 entry；Host 侧入口是 no-op `apply()`（对齐官方 `dsh-client-ui-renderer`）。
3. **运行时外部化**：`client.js` 只 `require` 种子表里的模块（当前是 `react/jsx-runtime`；`react` / `react-dom` / primitives 亦在表内），工厂内自带 `module`/`exports` 包装。
4. **CSS Modules 自备构建插件**：官方那套「注入 `<style data-plugin-css>` + 导出 scoped 类名表」的 rolldown 插件未随包发布，本库在 `tools/css-modules.mjs` 复刻其产物形态；`.d.ts` 由 `tsc -p tsconfig.build.json` 产出，tsdown 只负责打包。
5. **token 只提供类型面，不注入 CSS**：CSS 变量由官方主题包运行时注入，本库不越权定义同名变量。
6. **不重做官方原子件**：Card/Page/Toolbar/Panel/Stack/SectionHeader 才是本库范围；Button/Input/Menu/Modal 直接用官方 primitives。
7. **不声明 `peerDependencies: react`**：react / react-dom 由 shell 种子表提供，声明为 peer 会让 pnpm 往消费者 profile 装一份重复的 react。
8. **组件不含 `pointer-events` / `position` / 尺寸规则**：把整页组合放进 `shell.overlay` 会被该槽位拉伸并遮住 UI —— 那是槽位用法问题，浮层只放小型浮动件。
