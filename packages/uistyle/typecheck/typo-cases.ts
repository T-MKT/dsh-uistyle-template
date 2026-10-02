/**
 * The real question this file answers: does the generated type surface actually
 * REJECT a misspelled token name?
 *
 * Every misused token below carries `@ts-expect-error`. That directive is
 * self-verifying in both directions:
 *
 *   - if the type surface correctly rejects the bad name → the expected error is
 *     there, the directive is satisfied, and `tsc` reports ZERO errors.
 *   - if the type surface does NOT reject it (the failure mode we are testing
 *     for) → the directive becomes an "Unused '@ts-expect-error' directive"
 *     error, and `tsc` FAILS.
 *
 * So "tsc --noEmit passes" means typo detection works, not that it was skipped.
 */
import { token, tokenStyle, setToken, tokenClass, tokenMeta, themeVaryingTokens, type TokenName } from '@tak1208/dsh-uistyle-template/client';

// --- 1. helper accessors -------------------------------------------------

// Missing a letter in "label".
// @ts-expect-error -- '--dsw-alias-labl-primary' is not a real token
token('--dsw-alias-labl-primary');

// Right shape, wrong number: the shell only defines border levels 1-4.
// @ts-expect-error -- '--dsw-alias-border-l5' does not exist
token('--dsw-alias-border-l5');

// Forgetting the leading dashes is a classic slip.
// @ts-expect-error -- missing the '--' prefix
token('dsw-alias-label-primary');

// A fake token that merely looks plausible.
// @ts-expect-error -- invented token name
token('--dsw-alias-text-muted');

// The whole point: an unknown name must not silently be accepted.
// @ts-expect-error -- arbitrary custom property is not a design token
token('--my-own-color');

// --- 2. object-literals are checked per key -----------------------------

// @ts-expect-error -- background token name is misspelled
tokenStyle({ color: '--dsw-alias-label-primary', background: '--dsw-alias-bg-layer-11' });

// @ts-expect-error -- 'colour' is not a CSS property name we define; the VALUE is mistyped
tokenStyle({ color: '--dsw-alias-label-primry' });

// --- 3. setToken (the checked alternative to setProperty) ---------------

// @ts-expect-error -- background token name is misspelled
setToken(document.body, '--dsw-alias-bg-layr-1', 'red');

// @ts-expect-error -- an arbitrary custom property is not a design token
setToken(document.body, '--anything-goes', 'red');

// --- 4. const arrays are checked against the token union -----------------

const typos = [
  '--dsw-alias-label-primary',
  // @ts-expect-error -- one bad entry invalidates the array
  '--dsw-alias-label-primry',
] as const satisfies readonly TokenName[];

// --- 5. metadata lookups are keyed, so a typo is an error too -----------

// @ts-expect-error -- no such key in tokenMeta
tokenMeta['--dsw-alias-border-l5'];

// --- 6. the group arrays are token names, not free strings --------------

const firstVarying: TokenName = themeVaryingTokens[0];

// --- 7. the helper param is typed, so passing a raw value is an error ---

// @ts-expect-error -- passing a CSS value where a token NAME is expected
tokenClass('red');

export const bad = { typos, firstVarying };
