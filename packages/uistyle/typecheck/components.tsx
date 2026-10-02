/**
 * Consumer-side assertion for the published surface.
 *
 * This file is written the way another plugin uses the package — it imports the
 * package NAME, so TypeScript resolves `package.json` `exports` → `lib/types`,
 * never a relative source path. It therefore proves the shipped declarations
 * (and the export map) really expose the §2 frozen signatures: every component
 * called with its documented props, every token helper called with a real token.
 *
 * `pnpm run typecheck` emits `lib/types` first, so this assertion always runs
 * against the built surface rather than the sources.
 */
import {
  Card,
  Page,
  Panel,
  SectionHeader,
  Stack,
  Toolbar,
  setToken,
  token,
  tokenClass,
  tokenMeta,
  tokenStyle,
  tokens,
  type LayoutProps,
  type StackAlign,
  type StackDirection,
  type StackJustify,
} from '@tak1208/dsh-uistyle-template/client';

/** The full composition, exercising every frozen prop. */
export const composed = (
  <Page
    title={<span>Page title</span>}
    description="Description"
    actions={<button type="button">Action</button>}
    maxWidth={720}
    className="consumer-page"
    data-testid="page"
  >
    <Stack direction="column" gap={16} align="stretch" justify="between">
      <SectionHeader
        title={<span>Section</span>}
        description="Section description"
        actions={<button type="button">More</button>}
      >
        <Panel padded elevated>
          <Toolbar align="center">
            <span>left</span>
            <span>right</span>
          </Toolbar>
          <Card title={42} subtitle="Card subtitle" actions={<span>…</span>} padded={false}>
            Card body
          </Card>
        </Panel>
      </SectionHeader>
    </Stack>
  </Page>
);

/** Non-JSX props are typed too, `ReactNode` titles included. */
const direction: StackDirection = 'row';
const align: StackAlign = 'end';
const justify: StackJustify = 'around';
const shared: LayoutProps = { className: 'shared', style: { color: 'red' } };

/** The token helpers resolve through the same entry as the components. */
function restyle(el: HTMLElement): void {
  setToken(el, '--dsw-alias-label-primary', 'rebeccapurple');
  setToken(el, '--dsh-scrollbar-width', '8px');
}

export const facts = {
  direction,
  align,
  justify,
  shared,
  labelPrimary: token('--dsw-alias-label-primary'),
  withFallback: token('--dsw-alias-brand-primary', 'transparent'),
  style: tokenStyle({ color: '--dsw-alias-label-primary', background: '--dsw-alias-bg-layer-1' }),
  className: tokenClass('--dsw-alias-label-primary'),
  knownTokenCount: Object.keys(tokens).length,
  primaryTheme: tokenMeta['--dsw-alias-label-primary'].theme,
  restyle,
};
