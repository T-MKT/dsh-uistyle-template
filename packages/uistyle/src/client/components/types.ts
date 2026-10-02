/**
 * Props contracts shared by every layout component in this package.
 *
 * These are the frozen public signatures: component files and the package entry
 * both import them, so a change here is a change to the published API.
 */
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

/**
 * Props every layout component accepts on top of its own.
 *
 * Beware `title`: `HTMLAttributes` declares it as `string` (the tooltip), so a
 * component that repurposes `title` as a `ReactNode` heading must intersect with
 * `Omit<LayoutProps, 'title'>` — the plain intersection evaluates to
 * `string & ReactNode` and rejects every JSX title.
 */
export interface LayoutProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Main-axis direction of a {@link Stack}. */
export type StackDirection = 'row' | 'column';

/** Cross-axis alignment; `stretch` and `start` map straight onto flexbox. */
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';

/** Main-axis distribution; `between` and `around` mean the CSS space-* values. */
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around';
