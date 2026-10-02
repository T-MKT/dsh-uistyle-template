/**
 * Page: the outer section composition every plugin screen starts from.
 *
 * The official primitives ship no page frame, so plugins each invent their own
 * heading/padding/width rules and drift apart. Page fixes that arrangement: an
 * optional heading (title, description, right-aligned actions) over a content
 * area, with both centered on one `maxWidth` column so the title always stays
 * aligned with the body it labels.
 *
 * `title` is typed `ReactNode` here, so `LayoutProps`' inherited HTML `title`
 * attribute (`string`) is omitted from the intersection — otherwise a JSX title
 * would resolve to the impossible `string & ReactNode` and fail to typecheck.
 */
import type { ReactNode } from 'react';
import type { LayoutProps } from './types.js';
import styles from './Page.module.css';

export function Page({
  title,
  description,
  actions,
  maxWidth,
  className,
  style,
  children,
  ...rest
}: {
  /** Page heading. */
  title?: ReactNode;
  /** Supporting line under the heading. */
  description?: ReactNode;
  /** Action area at the right edge of the heading row. */
  actions?: ReactNode;
  /** Content max width; a number is treated as px. Omitted means fill the parent. */
  maxWidth?: number | string;
} & Omit<LayoutProps, 'title'>): JSX.Element {
  const hasHeading =
    title !== undefined || description !== undefined || actions !== undefined;

  return (
    <div className={[styles.page, className].filter(Boolean).join(' ')} style={style} {...rest}>
      <div className={styles.inner} style={maxWidth === undefined ? undefined : { maxWidth }}>
        {hasHeading && (
          <header className={styles.header}>
            <div className={styles.heading}>
              {title !== undefined && <h1 className={styles.title}>{title}</h1>}
              {description !== undefined && <p className={styles.description}>{description}</p>}
            </div>
            <div className={styles.actions}>{actions}</div>
          </header>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
