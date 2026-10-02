/**
 * Stack: the one-axis flex container the layout components compose with.
 *
 * The official primitives expose no spacing primitive, so sections end up with
 * ad-hoc flex rules in every consumer stylesheet. Stack centralizes that: the
 * caller passes semantic direction/align/justify names and Stack translates
 * them to flexbox, leaving `style` free to override anything it computed.
 */
import type { LayoutProps, StackAlign, StackDirection, StackJustify } from './types.js';
import styles from './Stack.module.css';

/** Cross-axis names, kept exhaustive so a new `StackAlign` fails to compile. */
const ALIGN: Record<StackAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

/** Main-axis names, kept exhaustive so a new `StackJustify` fails to compile. */
const JUSTIFY: Record<StackJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
};

export function Stack({
  direction = 'column',
  gap = 12,
  align = 'stretch',
  justify = 'start',
  className,
  style,
  children,
  ...rest
}: {
  direction?: StackDirection;
  gap?: number | string;
  align?: StackAlign;
  justify?: StackJustify;
} & LayoutProps): JSX.Element {
  return (
    <div
      className={[styles.stack, className].filter(Boolean).join(' ')}
      style={{
        flexDirection: direction,
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        alignItems: ALIGN[align],
        justifyContent: JUSTIFY[justify],
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
