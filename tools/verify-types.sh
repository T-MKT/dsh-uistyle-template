#!/usr/bin/env bash
#
# Prove the generated type surface actually rejects misspelled tokens.
#
# Three checks, each of which can genuinely fail:
#
#   1. the project compiles clean WITH every `@ts-expect-error` directive in
#      typecheck/typo-cases.ts satisfied
#      → correct usage is accepted AND every deliberate typo was rejected.
#        If a typo slipped through, tsc reports "Unused '@ts-expect-error'
#        directive" and this fails.
#
#   2. typecheck/typo-cases.ts really participates in the compilation
#      → guards against check 1 passing merely because the file was excluded.
#
#   3. CONTROL: a standalone file with a plain misspelled token must ERROR
#      → proves checks 1-2 are not vacuous. Without this, a `tsc` that silently
#        disabled all checking would also "pass" them.
#
# Checks invoke tsc with -p so tsconfig.json (its `lib`/`target`) is in effect.
set -uo pipefail

cd "$(dirname "$0")/.."
TSC=./node_modules/.bin/tsc
fail=0

echo "== 1. 全项目类型检查 =="
if "$TSC" -p tsconfig.json --noEmit >/tmp/verify-all.out 2>&1; then
  echo "   ✅ 零错误：valid.ts 的正确用法被接受，且全部 typo 已按预期被拒"
else
  echo "   ❌ 出现错误："
  grep -v 'npm notice' /tmp/verify-all.out | sed 's/^/      /'
  fail=1
fi

echo "== 2. 确认 typo 用例确实参与编译 =="
count=$("$TSC" -p tsconfig.json --noEmit --listFiles 2>/dev/null | grep -c 'typo-cases.ts' || true)
if [ "$count" -ge 1 ]; then
  echo "   ✅ typo-cases.ts 已编译，其 @ts-expect-error 由第 1 项校验"
else
  echo "   ❌ typo-cases.ts 未参与编译 —— 第 1 项的通过是假象"
  fail=1
fi

echo "== 3. 对照组：一处拼写错误必须报错 =="
probe=typecheck/.control-probe.ts
cat > "$probe" <<'EOF'
import { token } from '../src/tokens.js';
export const deliberatelyMisspelled = token('--dsw-alias-labl-primary');
EOF
if "$TSC" --noEmit --strict --target ES2022 --lib ES2022,DOM "$probe" >/tmp/verify-control.out 2>&1; then
  echo "   ❌ 对照组通过了 —— 类型检查是空转的，前两项结论无效"
  fail=1
else
  echo "   ✅ 对照组如期报错，证明检查确实生效："
  grep -E 'error TS' /tmp/verify-control.out | head -2 | sed 's/^/      /'
fi
rm -f "$probe"

echo
if [ "$fail" = 0 ]; then
  echo "✅ 全部通过：类型补全确实能挡住拼写错误"
else
  echo "❌ 存在失败项"
fi
exit "$fail"
