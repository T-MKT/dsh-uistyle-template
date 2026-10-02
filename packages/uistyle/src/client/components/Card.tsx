/**
 * Card: the base surface composition of this package.
 *
 * The official primitives ship atoms (Button, Tag, ...) but no container, so
 * every plugin re-derived the same bordered, padded panel. Card is that panel:
 * one surface with an optional header (title / subtitle / right-aligned
 * actions) above a body whose padding a caller can drop when it brings its own
 * full-bleed or scrolling layout.
 *
 * `title` is typed `ReactNode`, so the inherited HTML `title` attribute
 * (`string`) is omitted from `LayoutProps` — the plain intersection would
 * collapse it to `string & ReactNode` and reject a JSX title.
 */
import type { ReactNode } from 'react';
import type { LayoutProps } from './types.js';
import styles from './Card.module.css';

export function Card({
  title,
  subtitle,
  actions,
  padded = true,
  className,
  style,
  children,
  ...rest
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  padded?: boolean;
} & Omit<LayoutProps, 'title'>): JSX.Element {
  const hasHeader = title !== undefined || subtitle !== undefined || actions !== undefined;

  return (
    <section
      className={[styles.card, className].filter(Boolean).join(' ')}
      style={style}
      data-padded={String(padded)}
      {...rest}
    >
      {hasHeader && (
        <header className={styles.header}>
          <div className={styles.heading}>
            {title !== undefined && <div className={styles.title}>{title}</div>}
            {subtitle !== undefined && <div className={styles.subtitle}>{subtitle}</div>}
          </div>
          {actions !== undefined && <div className={styles.actions}>{actions}</div>}
        </header>
      )}
      <div className={styles.body}>{children}</div>
    </section>
  );
}
