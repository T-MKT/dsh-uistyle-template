/**
 * SectionHeader: the title block that opens a group of related content.
 *
 * Pages repeat the same title/description/actions arrangement, and the official
 * primitives have no equivalent, so the composition (and its hairline rule)
 * lives here. Optional `children` render under the header row as its body.
 *
 * `title` is typed `ReactNode`, so the inherited HTML `title` attribute
 * (`string`) is omitted from `LayoutProps` — the plain intersection would
 * collapse it to `string & ReactNode` and reject a JSX title.
 */
import type { ReactNode } from 'react';
import type { LayoutProps } from './types.js';
import styles from './SectionHeader.module.css';

export function SectionHeader({
  title,
  description,
  actions,
  className,
  style,
  children,
  ...rest
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
} & Omit<LayoutProps, 'title'>): JSX.Element {
  return (
    <div
      className={[styles.sectionHeader, className].filter(Boolean).join(' ')}
      style={style}
      {...rest}
    >
      <div className={styles.heading}>
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
      {children ? <div className={styles.body}>{children}</div> : null}
    </div>
  );
}
