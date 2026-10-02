/**
 * Client entry of `@tak1208/dsh-uistyle-template`.
 *
 * Consumers reach this module through `require('@tak1208/dsh-uistyle-template')`
 * (or the explicit `/client` subpath) after declaring the package under
 * `dsh.client.external`. It re-exports the typed token surface and the layout
 * components the official primitives do not ship.
 */
export {
  tokens,
  token,
  tokenStyle,
  tokenClass,
  setToken,
  tokenMeta,
  themeVaryingTokens,
  themeInvariantTokens,
  paletteTokens,
  semanticTokens,
} from './tokens.js';
export type { TokenName, TokenMeta } from './tokens.js';

export { Card } from './components/Card.js';
export { Page } from './components/Page.js';
export { Toolbar } from './components/Toolbar.js';
export { Panel } from './components/Panel.js';
export { Stack } from './components/Stack.js';
export { SectionHeader } from './components/SectionHeader.js';
export type { LayoutProps, StackAlign, StackDirection, StackJustify } from './components/types.js';
