/**
 * Ambient declaration for the CSS Modules the client bundle compiles.
 *
 * The real compilation happens in `tools/css-modules.mjs` (a rolldown plugin
 * that also injects the stylesheet); TypeScript only needs to know the import
 * yields the scoped class-name map.
 */
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
