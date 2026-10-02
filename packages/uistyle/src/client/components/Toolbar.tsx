/**
 * Toolbar: a single horizontal row of controls with a fixed 8px gap.
 *
 * Rows like this (list header, dialog footer, editor strip) are rebuilt inline
 * in plugin code because the primitives only ship the buttons themselves. The
 * only knob is cross-axis alignment, so the row keeps whatever chrome the
 * caller's container already provides.
 */
import type { LayoutProps, StackAlign } from './types.js';
import styles from './Toolbar.module.css';

export function Toolbar({
  align = 'center',
  className,
  style,
  children,
  ...rest
}: {
  /** Cross-axis alignment of the row items; defaults to `center`. */
  align?: StackAlign;
} & LayoutProps): JSX.Element {
  return (
    <div
      className={[styles.toolbar, className].filter(Boolean).join(' ')}
      data-align={align}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}
