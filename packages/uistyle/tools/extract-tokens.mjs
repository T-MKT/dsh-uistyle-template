/**
 * Extract every design token the DSH web shell actually ships.
 *
 * Source of truth is the built theme client bundle, which injects the token CSS
 * at runtime:
 *   @deepseek-ai/dsh-client-ui-theme/lib/client.js
 *
 * Output: tokens.json — machine-readable structured inventory.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const THEME = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim()
  + '/@deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-client-ui-theme/lib/client.js';

const src = readFileSync(THEME, 'utf8');

/** Undo the JS string escaping the bundler applied to the CSS text. */
function unescapeJs(s) {
  return s.replace(/\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)/g, (_, esc) => {
    if (esc[0] === 'u') return String.fromCharCode(parseInt(esc.slice(1), 16));
    if (esc[0] === 'x') return String.fromCharCode(parseInt(esc.slice(1), 16));
    const map = { n: '\n', t: '\t', r: '\r', '"': '"', "'": "'", '\\': '\\', '/': '/' };
    return map[esc] ?? esc;
  });
}

/**
 * Pull every `var NAME = "..."` CSS string literal out of the bundle.
 *
 * A naive /"([^"]*)"/ regex is WRONG here: the CSS bodies contain unescaped
 * inner quotes (font stacks like `"Segoe UI"`, `"PingFang SC"`), which truncate
 * the blob at the first font name and silently drop the rest of the block.
 * Scan character by character and honour backslash escapes instead.
 */
function cssBlobs(text) {
  const out = [];
  const re = /var\s+([A-Za-z0-9_$]+)\s*=\s*"/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const name = m[1];
    let i = m.index + m[0].length; // just past the opening quote
    let raw = '';
    while (i < text.length) {
      const ch = text[i];
      if (ch === '\\') { raw += ch + (text[i + 1] ?? ''); i += 2; continue; }
      if (ch === '"') break;
      raw += ch;
      i++;
    }
    if (/--[a-z]/.test(raw)) out.push({ name, css: unescapeJs(raw) });
    re.lastIndex = i;
  }
  return out;
}

/**
 * Recursive-descent CSS reader. Returns flat declarations, each tagged with the
 * full selector path (at-rule preludes included) it was declared in.
 *
 * Handles both `prop: value;` and a final `prop: value}` with no semicolon —
 * the latter is what a naive splitter drops.
 */
function parseCss(css) {
  const decls = [];
  const N = css.length;
  let i = 0;
  const path = [];

  /** Read until an unnested `;`, `{` or `}`; returns the raw text and the delimiter. */
  function readUntilDelim() {
    let buf = '';
    let depth = 0;
    while (i < N) {
      const ch = css[i];
      if (ch === '(' || ch === '[') depth++;
      else if (ch === ')' || ch === ']') depth--;
      else if (depth <= 0 && (ch === ';' || ch === '{' || ch === '}')) return { buf, ch };
      buf += ch;
      i++;
    }
    return { buf, ch: null };
  }

  /** Skip a balanced {...} block without interpreting it. */
  function skipBlock() {
    let depth = 0;
    while (i < N) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') {
        depth--;
        if (depth === 0) { i++; return; }
      }
      i++;
    }
  }

  while (i < N) {
    const { buf, ch } = readUntilDelim();
    const text = buf.trim();

    if (ch === ';') {
      i++; // consume ';'
      if (text.startsWith('--')) {
        const colon = text.indexOf(':');
        if (colon > 0) {
          decls.push({
            prop: text.slice(0, colon).trim(),
            value: text.slice(colon + 1).trim(),
            ctx: path.join(' || ') || '(none)',
          });
        }
      }
      continue;
    }

    if (ch === '{') {
      i++; // consume '{'
      if (text.startsWith('@')) {
        // At-rule with a block: push prelude, recurse, pop.
        path.push(text);
        parseBody();
        path.pop();
      } else {
        // Style rule: push selector, parse declarations until '}'.
        path.push(text);
        parseBody();
        path.pop();
      }
      continue;
    }

    if (ch === '}') {
      // Unterminated final declaration `--x: y}`.
      i++; // consume '}'
      if (text.startsWith('--')) {
        const colon = text.indexOf(':');
        if (colon > 0) {
          decls.push({
            prop: text.slice(0, colon).trim(),
            value: text.slice(colon + 1).trim(),
            ctx: path.join(' || ') || '(none)',
          });
        }
      }
      return; // caller's pop happens in its own frame
    }

    break; // ch === null: end of input
  }

  /** Parse declarations directly inside the current block until its closing '}'. */
  function parseBody() {
    while (i < N) {
      const { buf, ch } = readUntilDelim();
      const text = buf.trim();

      if (ch === '}') {
        i++; // consume '}' — end of this block
        // A trailing declaration without ';' still counts.
        if (text.startsWith('--')) {
          const colon = text.indexOf(':');
          if (colon > 0) {
            decls.push({
              prop: text.slice(0, colon).trim(),
              value: text.slice(colon + 1).trim(),
              ctx: path.join(' || ') || '(none)',
            });
          }
        }
        return;
      }

      if (ch === ';') {
        i++;
        if (text.startsWith('--')) {
          const colon = text.indexOf(':');
          if (colon > 0) {
            decls.push({
              prop: text.slice(0, colon).trim(),
              value: text.slice(colon + 1).trim(),
              ctx: path.join(' || ') || '(none)',
            });
          }
        }
        continue;
      }

      if (ch === '{') {
        i++;
        const parent = path[path.length - 1] ?? '';
        // Nested at-rule inside a style rule (@media within selector, etc.)
        path.push(text);
        parseBody();
        path.pop();
        void parent;
        continue;
      }

      return; // end of input
    }
  }

  parseBody();
  return decls;
}

const blobs = cssBlobs(src);
const allDecls = [];
for (const b of blobs) {
  for (const d of parseCss(b.css)) allDecls.push({ ...d, blob: b.name });
}

const byProp = new Map();
for (const d of allDecls) {
  if (!byProp.has(d.prop)) byProp.set(d.prop, []);
  byProp.get(d.prop).push(d);
}

// --- classification ------------------------------------------------------

const PALETTE = /^(amber|blue|cyan|green|grey|gray|neutral|orange|purple|red|teal|yellow|bluish|pink|indigo|violet|lime|emerald|sky|rose|fuchsia|slate|zinc|stone|mint|sand)/;

function layerOf(prop) {
  if (prop.startsWith('--dsw-')) return prop.slice(6).split('-')[0];
  if (prop.startsWith('--ds-')) return 'ds';
  if (prop.startsWith('--dsh-')) return 'dsh';
  if (prop.startsWith('--shiki-')) return 'shiki';
  return 'other';
}

function purposeOf(prop) {
  const p = prop;
  if (/font/.test(p)) return 'typography';
  if (/radius/.test(p)) return 'radius';
  if (/shadow|elevation/.test(p)) return 'shadow-elevation';
  if (/ease|transition|duration|motion|animation/.test(p)) return 'motion';
  if (/focus-ring/.test(p)) return 'focus';
  if (/scrollbar/.test(p)) return 'scrollbar';
  if (/gradient|linear/.test(p)) return 'gradient';
  if (/label|text/.test(p)) return 'text';
  if (/bg-|-fill|fill-/.test(p)) return 'background';
  if (/border|stroke/.test(p)) return 'border';
  if (/state-|status-|feedback|brand|accent/.test(p)) return 'brand-state';
  if (/interactive/.test(p)) return 'interactive';
  if (/static-/.test(p)) return 'palette';
  if (/backdrop|blur|filter/.test(p)) return 'effect';
  if (/z-|zindex/.test(p)) return 'z-index';
  return 'other';
}

/** The dark-mode opt-in attribute the theme bundle keys on. */
const DARK_SELECTOR = 'data-ds-dark-theme';

/** Which selector scope the token is declared in — decides who can override it. */
function scopeOf(ctx) {
  if (new RegExp(DARK_SELECTOR).test(ctx)) return 'body[dark]';
  if (/:root/.test(ctx)) return ':root';
  if (/^body/.test(ctx)) return 'body[light]';
  if (/@media/.test(ctx)) return 'media-query';
  if (/@supports/.test(ctx)) return 'supports';
  return 'other';
}

/**
 * Theme behaviour, derived from which scopes carry a declaration:
 *  - `light+dark`  declared in both `body` and `body[data-ds-dark-theme]` → flips
 *  - `light-only`  declared only in `body` but referencing a palette entry that
 *                  itself flips → visually theme-varying through indirection
 *  - `invariant`   one declaration, no palette indirection → same in both themes
 */
function themeOf(defs, prop) {
  const scopes = new Set(defs.map((d) => scopeOf(d.ctx)));
  const dark = scopes.has('body[dark]');
  const light = scopes.has('body[light]');
  if (dark && light) return 'light+dark';
  if (!dark && !light) return 'invariant';
  // Declared on one side only. A palette alias still shifts with the theme
  // because the referenced --dsw-static-* entry is itself overridden.
  const viaPalette = defs.some((d) => /--dsw-static-/.test(d.value));
  if (viaPalette) return 'light-only-via-palette';
  return 'invariant';
}

const tokens = [];
for (const [prop, defs] of byProp) {
  tokens.push({
    token: prop,
    layer: layerOf(prop),
    purpose: purposeOf(prop),
    theme: themeOf(defs, prop),
    scopes: [...new Set(defs.map((d) => scopeOf(d.ctx)))],
    definitionCount: defs.length,
    definitions: defs.map((d) => ({ value: d.value, selector: d.ctx, blob: d.blob })),
  });
}
tokens.sort((a, b) => a.token.localeCompare(b.token));

const dswTokens = tokens.filter((t) => t.token.startsWith('--dsw-'));
const counts = {
  total: tokens.length,
  dsw: dswTokens.length,
  nonDsw: tokens.length - dswTokens.length,
  byLayer: {},
  byPurpose: {},
  byTheme: {},
  byScope: {},
};
for (const t of tokens) {
  counts.byLayer[t.layer] = (counts.byLayer[t.layer] ?? 0) + 1;
  counts.byPurpose[t.purpose] = (counts.byPurpose[t.purpose] ?? 0) + 1;
  counts.byTheme[t.theme] = (counts.byTheme[t.theme] ?? 0) + 1;
  for (const s of t.scopes) counts.byScope[s] = (counts.byScope[s] ?? 0) + 1;
}

const out = {
  source: THEME,
  generatedBy: 'tools/extract-tokens.mjs',
  blobs: blobs.map((b) => b.name),
  counts,
  tokens,
};
writeFileSync(new URL('../tokens.json', import.meta.url), JSON.stringify(out, null, 2));
console.log(JSON.stringify(counts, null, 2));
