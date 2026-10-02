/**
 * Panel: the generic bounded surface a page wraps around one coherent group.
 *
 * The official primitives ship atoms but no mid-level container, so every
 * consumer re-invents the same fill, radius and hairline. Panel keeps that
 * surface in one place and exposes only two knobs: whether it pads its content
 * and whether it is raised above its neighbours.
 */
import type { LayoutProps } from './types.js';
import styles from './Panel.module.css';

export function Panel({
  padded = true,
  elevated = false,
  className,
  style,
  children,
  ...rest
}: {
  padded?: boolean;
  elevated?: boolean;
} & LayoutProps): JSX.Element {
  return (
    <div
      className={[styles.panel, className].filter(Boolean).join(' ')}
      data-padded={String(padded)}
      data-elevated={String(elevated)}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}
