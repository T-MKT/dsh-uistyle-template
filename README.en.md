<h1 align="center">dsh-uistyle-template</h1>

<p align="center">Layout components and typed design tokens for DSH Web UI plugins: the Card / Page / Toolbar / Panel / Stack / SectionHeader compositions the official primitives lack, plus compile-checked access to all 427 <code>--dsw-*</code> tokens. Ships as a bundle other Web plugins can <code>require</code>.</p>

<p align="center">
<a href="README.md">简体中文</a> |
English
</p>

## What this is

A **reusable component-library bundle** for DSH Web UI plugins, published as `@tak1208/dsh-uistyle-template`. It fills two gaps in the official surface:

1. **The design tokens have no typed surface.** All 427 official `--dsw-*` / `--ds-*` / `--dsh-*` tokens live as CSS strings inside the theme package's `lib/client.js` — not exported, not typed, so a single misspelled name silently produces no style. This library extracts them into a checked TypeScript API: a typo is a **compile error**.
2. **The official primitives ship no layout compositions.** `@deepseek-ai/dsh-client-ui-primitives` provides atoms (Button / Input / Menu / Modal / Toast …) but no Card / Page / Toolbar / Panel / Stack / SectionHeader, so every plugin re-derives the same containers. This library converges them.

What it deliberately does not do: re-implement the official atoms; ship high-complexity data widgets (Table / DataGrid / Select / DatePicker); define or override any CSS variable (injecting the token values at runtime is the official theme package's job); provide themes or skins.

## Features

- **Six layout components**, each with its own CSS Module; every colour, radius, shadow and motion value comes from `--dsw-*` / `--ds-*`, so **light and dark follow the shell with zero hard-coded colours**.
- **Compile-time checking across 427 tokens**: `token()` / `tokenStyle()` / `setToken()` take a token-name union type.
- **Same visual language as the shell**: values, geometry and type scale are aligned with the official primitives and theme tokens rather than a second design language.
- **Depends only on the shell seed table**: the bundle only `require`s modules the page module table already holds (currently `react/jsx-runtime`) — no inlined React, no new runtime dependency.

## Installing (consumer plugin)

Published on npm: **[`@tak1208/dsh-uistyle-template`](https://www.npmjs.com/package/@tak1208/dsh-uistyle-template)** (`latest = 0.1.0`, public).

1. In a DSH session, use the plugin manager's `install_bundle` with the package name (add `@0.1.0` to pin the version):

   ```text
   @tak1208/dsh-uistyle-template
   ```

   The package's own `cordis.patch.yml` inserts its Loader entry and adds the name to the profile's `dsh.profile.bundles`.
2. Declare the external module request in your plugin's `package.json`:

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

3. Require it from your browser half as usual:

   ```js
   const { Card, Stack, token } = require('@tak1208/dsh-uistyle-template');
   ```

   The flat module graph normalizes `<pkg>/client` and the bare package name onto the same row, so both specifiers resolve to the same exports.

> **TypeScript users**: import from `'@tak1208/dsh-uistyle-template/client'`. The bare name's `exports['.']` points at the Host half (an empty `apply()` that only satisfies the bundle row); only the `./client` subpath's `types` expose the components and the token API.

> **Working on this library itself**: run `pnpm install && pnpm -r build` first, then point `install_bundle` at the absolute path of `packages/uistyle` — it is installed with `link:`, so a reload picks up your changes.

## Using the layout components

```tsx
import { Card, Page, Panel, SectionHeader, Stack, Toolbar } from '@tak1208/dsh-uistyle-template/client';

<Page title="Session stats" description="Last 7 days" maxWidth={720}>
  <Stack gap={16}>
    <SectionHeader title="Overview" actions={<button>Refresh</button>} />
    <Panel elevated>
      <Toolbar align="center">
        <span>left</span>
        <span>right</span>
      </Toolbar>
      <Card title="Today" subtitle="Grouped by session" padded>
        Content
      </Card>
    </Panel>
  </Stack>
</Page>;
```

| Component | Own props | Purpose |
| --- | --- | --- |
| `Card` | `title` `subtitle` `actions` `padded=true` | Base surface: optional header above the body, layer-1 fill with a 0.5px edge |
| `Page` | `title` `description` `actions` `maxWidth` | Page frame: 24px gutter and one centred column so heading and body share a width |
| `Toolbar` | `align='center'` | One horizontal row with an 8px gap; paints no surface, so it nests in Page / Card / Panel |
| `Panel` | `padded=true` `elevated=false` | Generic container: layer-2 fill; `elevated` swaps exactly one elevation token |
| `Stack` | `direction='column'` `gap=12` `align='stretch'` `justify='start'` | Single-axis flex and the package's spacing primitive; a numeric `gap` means px |
| `SectionHeader` | `title` (required) `description` `actions` | Section title over a 0.5px rule, with optional `children` as its body |

Every component also accepts `HTMLAttributes<HTMLElement>` (`onClick` / `data-*` / `aria-*` …) plus `className` / `style` / `children`. `title` is a `ReactNode` on Card / Page / SectionHeader, which is why those three `Omit` the HTML `title` (browser tooltip) attribute.

## Using the token API

```ts
import { token, tokenStyle, setToken, tokenMeta } from '@tak1208/dsh-uistyle-template/client';

token('--dsw-alias-label-primary');                      // → 'var(--dsw-alias-label-primary)'
token('--dsw-alias-brand-primary', 'transparent');       // with a fallback
tokenStyle({ color: '--dsw-alias-label-secondary' });    // React inline-style object
setToken(el, '--dsw-alias-bg-layer-1', 'red');           // typed setProperty
tokenMeta['--dsw-alias-bg-layer-1'].theme;               // 'light+dark'
```

| Export | Purpose |
| --- | --- |
| `token(name, fallback?)` | Read a token as a `var(...)` expression |
| `tokenStyle(decls)` | CSS property to token name → inline style object |
| `tokenClass(name)` | Build a `dsh-token-…` class name |
| `setToken(el, name, value)` | Typed `el.style.setProperty` (`setProperty` cannot be narrowed by declaration merging) |
| `tokens` | Name → `var(...)` map of all 427 tokens |
| `tokenMeta` | Per-token `layer` / `purpose` / `theme` / `scopes` / `usageCount` |
| `themeVaryingTokens` `themeInvariantTokens` `paletteTokens` `semanticTokens` | Theme-varying / theme-invariant / raw palette / semantic groups |
| `TokenName` | The token-name union type |

The full human-readable inventory is [`TOKENS.md`](packages/uistyle/TOKENS.md).

## How it works

- **Two-half bundle**: the Host half `lib/index.js` is a no-op `apply()` (mirroring the official `dsh-client-ui-renderer`); the browser half `lib/client.js` is a lazy CJS factory registered through `window.__ModuleLoader__.load({ id, factory })` — the script only registers the factory, and the module body (CSS injection included) runs on first require.
- **A local CSS Modules plugin**: the official rolldown plugin that compiles `.module.css` into one module which injects `<style data-plugin-css="<pkg>/<file>">` and exports the scoped class-name map is not published, so [`tools/css-modules.mjs`](packages/uistyle/tools/css-modules.mjs) reproduces that artifact shape; the `.d.ts` set comes from `tsc -p tsconfig.build.json`.
- **The token pipeline**: theme bundle → `tools/extract-tokens.mjs` → `tokens.json` → `tools/gen-types.mjs` → `src/client/tokens.ts`, and `tools/build-reference.mjs` → `TOKENS.md`. Re-run `pnpm -r build` after a DSH upgrade.

## Repository layout

```text
dsh-uistyle-template/
├── package.json              # private root: workspace orchestration + shared scripts (pnpm)
├── pnpm-workspace.yaml       # packages: ['packages/*']
├── tsconfig.base.json        # shared TS options
├── .plan/plan.md             # the coding source of truth: structure and progress
├── AGENTS.md                 # project guide (includes the project map)
└── packages/uistyle/         # the single published package, @tak1208/dsh-uistyle-template
    ├── package.json          # dsh.bundle.patch + dsh.client, exports: . / ./client
    ├── cordis.patch.yml      # Loader patch: one inserted row
    ├── tsdown.config.ts      # host (esm) + client (cjs factory wrapper) configs
    ├── src/index.ts          # Host half: no-op apply()
    ├── src/client/           # client entry / generated tokens.ts / the six components
    ├── typecheck/            # consumer-side assertions + token typo controls
    ├── tools/                # token pipeline + CSS Modules plugin + verify script
    └── lib/                  # build output (git-ignored)
```

## Development

Requirements: Node ≥ 22, pnpm 11, and a local dsh `0.2.0-rc.2` (the token extraction reads the official theme bundle).

```bash
pnpm install
pnpm -r build       # token extraction → type generation → tsdown bundle + .d.ts
pnpm -r typecheck   # emits lib/types first, then asserts sources and the published surface
pnpm -r verify      # three checks: consumer assertions + compilation proof + control group
```

The third check in `verify` is a **control group**: one deliberately misspelled token must fail to compile — otherwise the type checking is vacuous and the first two results mean nothing.

## Known limitations

- Still `0.x`: per semver, the API of a `0.y.z` version is not considered stable and a minor bump may contain breaking changes — read the matching Release notes before upgrading.
- Does not re-implement the official atoms (use the primitives for Button / Input / Menu / Modal / Toast / Tooltip …).
- No high-complexity data widgets (Table / DataGrid / Select / DatePicker; `SettingsForm` already ships officially).
- Tokens are a type surface and value helper only — this package **never injects CSS variable definitions**.
- The components carry no `pointer-events`, `position` or sizing rules: registering a whole page composition into a floating seat such as `shell.overlay` makes that seat stretch it and swallow the UI (floating seats are for small badges and toasts).
- Depends on DSH's client module graph, theme tokens and `dsh.client` manifest; re-check against `COMPATIBLE_VERSION` after a DSH upgrade.

## Compatibility

[`COMPATIBLE_VERSION`](COMPATIBLE_VERSION) line 1 is the dsh version this package was developed against, line 2 the last check date. Currently `0.2.0-rc.2` (2026-10-02).

## License

[MIT](./LICENSE)
