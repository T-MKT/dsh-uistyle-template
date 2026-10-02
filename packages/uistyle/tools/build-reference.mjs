/**
 * Render tokens.json into a human-readable Markdown reference.
 *
 * Output: TOKENS.md — the structured inventory, grouped by purpose, with the
 * light/dark definition of every theme-varying token shown side by side.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const data = JSON.parse(readFileSync(new URL('tokens.json', root), 'utf8'));
const usage = JSON.parse(readFileSync(new URL('usage.json', root), 'utf8'));
const usedCount = new Map(usage.used);

const tokens = data.tokens;
const c = data.counts;

/** Shorten a value for table display without losing meaning. */
function pretty(value) {
  let v = value.replace(/\s+/g, ' ').trim();
  // Drop the long system font stacks down to their leading families.
  if (/^(Montserrat|"SF Mono"|-apple-system)/.test(v) || v.length > 64) {
    const parts = v.split(',').map((s) => s.trim());
    v = parts.length > 3 ? `${parts.slice(0, 3).join(', ')}, …` : v;
  }
  return v.length > 68 ? `${v.slice(0, 65)}…` : v;
}

/** The value declared for light vs dark, when the token has both. */
function valuePair(t) {
  const light = t.definitions.find((d) => !d.selector.includes('data-ds-dark-theme'));
  const dark = t.definitions.find((d) => d.selector.includes('data-ds-dark-theme'));
  if (light && dark) return { light: pretty(light.value), dark: pretty(dark.value) };
  if (light) return { light: pretty(light.value), dark: '—' };
  return { light: '—', dark: pretty((dark ?? t.definitions[0]).value) };
}

const PURPOSE_ORDER = [
  'text', 'background', 'border', 'brand-state', 'interactive',
  'typography', 'radius', 'shadow-elevation', 'motion', 'focus',
  'gradient', 'effect', 'scrollbar', 'palette', 'z-index', 'other',
];

const PURPOSE_LABEL = {
  text: '文字 / 标签色 (text)',
  background: '背景 / 填充 (background)',
  border: '描边 / 分隔线 (border)',
  'brand-state': '品牌 / 状态色 (brand-state)',
  interactive: '交互态 (interactive)',
  typography: '字体与排版 (typography)',
  radius: '圆角 (radius)',
  'shadow-elevation': '阴影 / 层级 (shadow-elevation)',
  motion: '动效时长与缓动 (motion)',
  focus: '焦点环 (focus)',
  gradient: '渐变 (gradient)',
  effect: '模糊 / 滤镜 (effect)',
  scrollbar: '滚动条 (scrollbar)',
  palette: '原始色板 (palette, static)',
  'z-index': '层级 z-index',
  other: '其他 (other)',
};

const lines = [];
const w = (s = '') => lines.push(s);

w('# DSH Web UI Design Token 清单');
w();
w('> 自动生成，请勿手改。重新生成：`node tools/extract-tokens.mjs && node tools/build-reference.mjs`');
w();
w('## 这是什么');
w();
w('DSH Web 界面的设计 token —— 带名字的颜色/尺寸常量，CSS 自定义属性（CSS custom property）。');
w('官方组件（`@deepseek-ai/dsh-client-ui-primitives`）内部全部通过这些变量取色取尺寸，');
w('所以**只要用对 token，自定义 UI 就能和官方界面保持一致的视觉与明暗主题**。');
w();
w('## 它们从哪来');
w();
w('不是静态 CSS 文件，而是**运行时由 JS 注入**。官方主题包：');
w();
w('```');
w('@deepseek-ai/dsh-client-ui-theme/lib/client.js');
w('```');
w();
w(`该 bundle 里 ${data.blobs.length} 个 CSS 字符串块携带 token 定义，` +
  `共 **${tokens.reduce((s, t) => s + t.definitionCount, 0)} 条声明**、**${c.total} 个唯一 token**：`);
w();
for (const b of data.blobs) w(`- \`${b}\``);
w();
w('明暗切换靠属性选择器 —— 浅色是 `body`，深色是 `body[data-ds-dark-theme]`：');
w();
w('```css');
w('body                        { --dsw-alias-bg-layer-1: var(--dsw-static-neutral-bluish-00);  }');
w('body[data-ds-dark-theme]    { --dsw-alias-bg-layer-1: var(--dsw-static-neutral-bluish-875); }');
w('```');
w();
w('## 总量');
w();
w('| 指标 | 数量 |');
w('|---|---|');
w(`| **全部 token** | **${c.total}** |`);
w(`| \`--dsw-*\` 官方命名空间 | ${c.dsw} |`);
w(`| \`--ds-*\` | ${c.byLayer.ds} |`);
w(`| \`--dsh-*\` | ${c.byLayer.dsh} |`);
w(`| \`--shiki-*\` 代码高亮 | ${c.byLayer.shiki} |`);
w();
w('### 按命名层 (layer)');
w();
w('| 层 | 数量 | 说明 |');
w('|---|---|---|');
const LAYER_DESC = {
  alias: '语义别名层 —— 指向 static 色板，**日常应该用这一层**',
  static: '原始色板层 —— 具体色值，不带语义',
  font: '排版尺度（复合简写 + 5 个子属性）',
  specific: '场景专用覆盖（如 mac 桌面端菜单背景）',
  shiki: '代码高亮配色',
  dsh: '内容区/滚动条专用（注意不是 dsw 前缀）',
  ds: '全局常量：缓动、过渡时长、等宽字体（注意不是 dsw 前缀）',
  radius: '圆角',
  elevation: '层级阴影',
  shadow: '阴影',
  gradient: '渐变',
  linear: '线性渐变',
  focus: '焦点环',
  menu: '菜单模糊',
  corner: '超椭圆圆角',
  mask: '遮罩',
};
for (const [k, v] of Object.entries(c.byLayer).sort((a, b) => b[1] - a[1])) {
  w(`| \`--${k === 'ds' || k === 'dsh' || k === 'shiki' ? '' : 'dsw-'}${k}-*\` | ${v} | ${LAYER_DESC[k] ?? ''} |`);
}
w();
w('### 按明暗行为 (theme)');
w();
w('| 行为 | 数量 | 含义 |');
w('|---|---|---|');
w(`| \`invariant\` | ${c.byTheme.invariant ?? 0} | 明暗相同 |`);
w(`| \`light+dark\` | ${c.byTheme['light+dark'] ?? 0} | **明暗各有一套定义，自动切换** |`);
for (const [k, v] of Object.entries(c.byTheme)) {
  if (k === 'invariant' || k === 'light+dark') continue;
  w(`| \`${k}\` | ${v} | |`);
}
w();
w('### 定义所在的选择器作用域 (scope)');
w();
w('| 作用域 | token 数 |');
w('|---|---|');
for (const [k, v] of Object.entries(c.byScope).sort((a, b) => b[1] - a[1])) w(`| \`${k}\` | ${v} |`);
w();
w('## 实际使用情况');
w();
w(`在 dsh ${process.env.DSH_VERSION ?? '0.2.0-rc.2'} 实际发布的 ${usage.scannedFiles ?? 75} 个前端产物文件中统计：`);
w();
w('| 指标 | 数量 |');
w('|---|---|');
w(`| 被引用过（定义之外） | ${usage.used.length} |`);
w(`| 零引用 | ${usage.unused.length} |`);
w();
w('> ⚠️ **口径说明**：零引用只代表"在已发布的构建产物里没被引用"。');
w('> 官方源码未公开，可能存在运行时才用到、或功能未启用的 token。');
w('> 这个数字**不能**理解为"官方废弃了这些 token"。');
w();
w('### 引用最多的 25 个（值得优先掌握）');
w();
w('| 引用次数 | token | 用途 |');
w('|---|---|---|');
for (const [name, n] of usage.used.slice(0, 25)) {
  const t = tokens.find((x) => x.token === name);
  w(`| ${n} | \`${name}\` | ${PURPOSE_LABEL[t?.purpose] ?? t?.purpose ?? ''} |`);
}
w();
w('---');
w();
w('# 按用途分类的完整清单');
w();
w('每个 token 列出浅色 / 深色两套取值。`—` 表示该侧没有定义（明暗相同）。');
w();

for (const purpose of PURPOSE_ORDER) {
  const group = tokens.filter((t) => t.purpose === purpose);
  if (group.length === 0) continue;
  w(`## ${PURPOSE_LABEL[purpose]} — ${group.length} 个`);
  w();
  if (purpose === 'palette') {
    w('原始色板。**一般不要直接用**，应该用 `--dsw-alias-*` 语义层。');
    w('列在这里是为了查证 alias 到底指向什么色值。');
    w();
  }
  if (purpose === 'typography') {
    w('排版 token 是复合结构：一个总简写 + `-font-family` / `-font-size` / `-font-style` / `-font-weight` / `-line-height` 五个子属性。');
    w();
  }
  w('| token | 浅色 | 深色 | 引用次数 | 层 |');
  w('|---|---|---|---|---|');
  for (const t of group) {
    const { light, dark } = valuePair(t);
    const n = usedCount.get(t.token) ?? 0;
    w(`| \`${t.token}\` | \`${light}\` | \`${dark}\` | ${n || ''} | ${t.layer} |`);
  }
  w();
}

writeFileSync(new URL('TOKENS.md', root), lines.join('\n') + '\n');
console.log(`TOKENS.md written: ${lines.length} lines`);
