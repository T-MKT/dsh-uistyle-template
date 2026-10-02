/**
 * Build config for the two halves of the bundle.
 *
 * `client` is the whole point: a DSH client bundle must be a lazy-CJS factory
 * registered as `window.__ModuleLoader__.load({ id, factory })`, with the
 * factory's own `module`/`exports` bindings and every platform-singleton module
 * (`react`, `react-dom`, the official primitives) left as `require()` calls so
 * the shell hands back its one shared instance. The generated `.d.ts` set comes
 * from `tsc` (`tsconfig.build.json`), not from here.
 *
 * `index` is the Host half: a no-op `apply()` entry, exactly like the official
 * `@deepseek-ai/dsh-client-ui-renderer` host stub.
 */
import { defineConfig } from 'tsdown';
import { dshCssModules } from './tools/css-modules.mjs';

const PACKAGE_NAME = '@tak1208/dsh-uistyle-template';

export default defineConfig([
  {
    name: 'host',
    entry: { index: 'src/index.ts' },
    outDir: 'lib',
    format: 'esm',
    platform: 'node',
    clean: false,
    outExtensions: () => ({ js: '.js' }),
    dts: false,
  },
  {
    name: 'client',
    entry: { client: 'src/client/index.ts' },
    outDir: 'lib',
    format: 'cjs',
    platform: 'browser',
    clean: false,
    sourcemap: true,
    outExtensions: () => ({ js: '.js' }),
    deps: {
      neverBundle: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        '@deepseek-ai/dsh-client-ui-primitives',
      ],
    },
    plugins: [dshCssModules({ packageName: PACKAGE_NAME, clientRoot: 'src/client' })],
    banner: [
      'window.__ModuleLoader__.load({',
      `\tid: ${JSON.stringify(PACKAGE_NAME)},`,
      '\tfactory: (require) => {',
      '\t\tvar module = { exports: {} };',
      '\t\tvar exports = module.exports;',
    ].join('\n'),
    footer: ['\t\treturn module.exports;', '\t}', '});'].join('\n'),
    dts: false,
  },
]);
