/**
 * Control group: every usage here is a REAL token extracted from the shell.
 * `tsc --noEmit` must report ZERO errors for this file.
 */
import {
  token,
  tokenStyle,
  setToken,
  tokenClass,
  tokens,
  tokenMeta,
  themeVaryingTokens,
  themeInvariantTokens,
  paletteTokens,
  semanticTokens,
  type TokenName,
} from '@tak1208/dsh-uistyle-template/client';

// The doc example that started this investigation.
const labelPrimary = token('--dsw-alias-label-primary');

// The six tokens the session-notification plugin actually hand-copied.
const handCopied = [
  '--dsw-alias-label-primary',
  '--dsw-alias-label-tertiary',
  '--dsw-alias-border-l2',
  '--dsw-alias-border-l3',
  '--dsw-alias-bg-layer-1',
  '--dsw-alias-bg-module-platform',
  '--dsw-alias-interactive-bg-hover',
  '--dsw-alias-state-business-primary',
  '--ds-ease-in-out',
] as const satisfies readonly TokenName[];

// Fallback form.
const withFallback = token('--dsw-alias-brand-primary', 'transparent');

// Inline style object.
const style = tokenStyle({
  color: '--dsw-alias-label-primary',
  background: '--dsw-alias-bg-layer-1',
  borderColor: '--dsw-alias-border-l2',
});

// Layout / geometry tokens.
const radius = token('--dsw-radius-md');
const motion = token('--ds-transition-duration');

// The real-world payoff: a checked way to set a token on an element.
function applyTheme(el: HTMLElement): void {
  setToken(el, '--dsw-alias-label-primary', 'red');
  setToken(el, '--dsw-alias-bg-layer-1', 'blue');
  setToken(el, '--ds-ease-in-out', 'linear');
  setToken(el, '--dsh-scrollbar-width', '8px');
}

// Metadata is typed too.
const primaryUsage: number = tokenMeta['--dsw-alias-label-primary'].usageCount;
const primaryTheme: string = tokenMeta['--dsw-alias-label-primary'].theme;

// Group accessors exist and are typed.
const varyingCount: number = themeVaryingTokens.length;
const invariantCount: number = themeInvariantTokens.length;
const paletteCount: number = paletteTokens.length;
const semanticCount: number = semanticTokens.length;

// The full map is keyed by token name.
const allNames: TokenName[] = Object.keys(tokens) as TokenName[];

// React-free usage of a few derived values, so nothing is reported unused.
export const report = {
  labelPrimary,
  handCopied,
  withFallback,
  style,
  radius,
  motion,
  className: tokenClass('--dsw-alias-label-primary'),
  primaryUsage,
  primaryTheme,
  varyingCount,
  invariantCount,
  paletteCount,
  semanticCount,
  knownTokenCount: allNames.length,
};

void applyTheme;
