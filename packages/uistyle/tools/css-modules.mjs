/**
 * Rolldown plugin: turn `*.module.css` into the virtual module shape a DSH
 * client bundle needs.
 *
 * The browser module table is a flat lazy-CJS factory table, so a plugin bundle
 * owns its own styles: official DSH client bundles compile CSS Modules into one
 * module that (a) injects a single `<style data-plugin-css="<pkg>/<file>">` tag
 * at materialization and (b) exports the scoped class-name map as its default
 * export. This plugin reproduces that artifact shape without depending on the
 * harness' unpublished build plugin.
 *
 * Scoping is deliberately minimal — the CSS in this package is authored here,
 * so `:global`, `composes`, and `@value` are out of scope. A class name in every
 * selector position is rewritten to `<scope>_<local>`; the same map is exported.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const VIRTUAL_PREFIX = '\0dsh-css:';
const VIRTUAL_SUFFIX = '.mjs';

/**
 * Build the plugin.
 * @param options - build inputs.
 * @param options.packageName - published package name, used for the style tag's `data-plugin` and `data-plugin-css` ids.
 * @param options.clientRoot - absolute or cwd-relative directory the style tag id is relative to (the client source root).
 * @returns a rolldown plugin object.
 */
export function dshCssModules({ packageName, clientRoot }) {
  const root = path.resolve(clientRoot);

  return {
    name: 'dsh-css-modules',

    resolveId(source, importer) {
      if (!source.endsWith('.module.css')) return null;
      const base = importer === undefined ? root : path.dirname(importer);
      return VIRTUAL_PREFIX + path.resolve(base, source) + VIRTUAL_SUFFIX;
    },

    load(id) {
      if (!id.startsWith(VIRTUAL_PREFIX)) return null;
      const file = id.slice(VIRTUAL_PREFIX.length, -VIRTUAL_SUFFIX.length);
      const rel = path.relative(root, file).split(path.sep).join('/');
      // A stable, valid CSS identifier prefix: `_` cannot start a number, so a
      // leading hash digit is always safe.
      const scope = `_${createHash('sha256').update(rel).digest('base64url').slice(0, 6)}`;
      const { css, names } = scopeCss(readFileSync(file, 'utf8'), scope);
      const tagId = `${packageName}/${rel}`;

      const code = [
        `const css = ${JSON.stringify(css)};`,
        `const tagId = ${JSON.stringify(tagId)};`,
        'if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {',
        '  const tag = document.createElement("style");',
        `  tag.dataset.plugin = ${JSON.stringify(packageName)};`,
        '  tag.dataset.pluginCss = tagId;',
        '  tag.textContent = css;',
        '  document.head.appendChild(tag);',
        '}',
        'export default {',
        ...[...names].sort().map((name) => `  ${JSON.stringify(name)}: ${JSON.stringify(`${scope}_${name}`)},`),
        '};',
        '',
      ].join('\n');

      return { code, moduleSideEffects: true };
    },
  };
}

/**
 * Rewrite every class name selector with the scope prefix and collect the local names.
 * @param css - the raw stylesheet text.
 * @param scope - scope prefix, without the trailing separator.
 * @returns the rewritten CSS and the set of local class names it defines.
 */
function scopeCss(css, scope) {
  const names = new Set();
  // Nesting mode per brace level: `selector` text or declaration values. Values
  // are skipped so a `.5em` duration or a quoted `.foo` is never rewritten.
  const modes = ['selector'];
  let out = '';
  let i = 0;

  while (i < css.length) {
    const ch = css[i];

    if (ch === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      const stop = end === -1 ? css.length : end + 2;
      out += css.slice(i, stop);
      i = stop;
      continue;
    }

    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < css.length && css[j] !== ch) j += css[j] === '\\' ? 2 : 1;
      out += css.slice(i, Math.min(j + 1, css.length));
      i = j + 1;
      continue;
    }

    if (ch === '{') {
      modes.push(modes[modes.length - 1] === 'selector' ? 'decls' : 'selector');
      out += ch;
      i++;
      continue;
    }

    if (ch === '}') {
      if (modes.length > 1) modes.pop();
      out += ch;
      i++;
      continue;
    }

    if (ch === '.' && modes[modes.length - 1] === 'selector') {
      const match = /^\.(-?[A-Za-z_][A-Za-z0-9_-]*)/.exec(css.slice(i));
      if (match !== null) {
        names.add(match[1]);
        out += `.${scope}_${match[1]}`;
        i += match[0].length;
        continue;
      }
    }

    out += ch;
    i++;
  }

  return { css: out, names };
}
