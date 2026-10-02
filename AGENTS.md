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

> 目标结构（对应 `.plan/plan.md`，重组完成后成立；重组前根级 `tools/` `src/` 为旧布局）。

```text
dsh-uistyle-template/
├── package.json            # 私有根：workspace 编排 + 统一 scripts（pnpm）
├── pnpm-workspace.yaml     # packages: ['packages/*']
├── tsconfig.base.json      # 共享 TS 编译选项（strict / DOM / react-jsx）
├── .plan/plan.md           # 编码真源：代码结构与开发进度
└── packages/
    └── uistyle/            # 唯一的产物包，包名 @tak1208/dsh-uistyle-template
        ├── package.json    # dsh.bundle.patch + dsh.client，exports: . / ./client
        ├── cordis.patch.yml# 极简：insert 一行注册为 Loader entry
        ├── tsdown.config.ts# client 入口，external react*/primitives
        ├── src/
        │   ├── index.ts    # Host 侧 no-op：export function apply() {}
        │   └── client/
        │       ├── index.ts          # 客户端唯一入口：re-export 组件 + token 接口
        │       ├── tokens.ts         # 生成物：token 联合类型 + token()/setToken()
        │       └── components/       # 6 个布局件，各配一个 .module.css
        ├── lib/            # tsdown 产物（client.js，git 忽略）
        └── tools/          # token 生成三件套 + verify 脚本
```

**命令**（仓库根）：

- `pnpm -r build` —— 重建所有包（含 token 提取 → 类型生成 → tsdown 打包）
- `pnpm -r typecheck` —— `tsc --noEmit`
- `pnpm -r verify` —— 三重验证（含对照组，见 `packages/uistyle/tools/verify-types.sh`）

**关键机制**（实现时不可违背）：

1. **扁平模块图**：浏览器侧是懒加载 CJS 工厂表；一个包能被 `require` 的前提是它既是 Loader entry、又声明了 `dsh.client`。
2. **库必须自带 bundle**：靠 `cordis.patch.yml` 的 `insert` 成为 entry；Host 侧入口是 no-op `apply()`（对齐官方 `dsh-client-ui-renderer`）。
3. **消费者依赖方式**：`dsh.client.external: ['@tak1208/dsh-uistyle-template']`，并把库加入 profile 的 `dsh.profile.bundles`。
4. **运行时外部化**：`client.js` 必须 external `react*` / `react-dom*` / `@deepseek-ai/dsh-client-ui-primitives`（三者都在 shell 种子表里）。
5. **token 只提供类型面，不注入 CSS**：CSS 变量由官方主题包运行时注入，本库不越权定义同名变量。
6. **不重做官方原子件**：Card/Page/Toolbar/Panel/Stack/SectionHeader 才是本库范围；Button/Input/Menu/Modal 直接用官方 primitives。
