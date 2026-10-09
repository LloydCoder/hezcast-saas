# Vendored braces security backport

This directory contains the MIT-licensed `braces@3.0.3` implementation from https://github.com/micromatch/braces, retained with its upstream LICENSE.

Tinlance patch: `lib/parse.js` enforces a maximum AST nesting depth of 100 for both brace and parenthesis groups. This mitigates GHSA-vfj7-8cjw-p6xm / CVE-2026-93687, for which the upstream advisory reports no patched release as of 2026-10-09.

The fork version is `3.0.4-tinlance.1`. Reassess and remove this local backport once an upstream patched release is available. Run `node tests/verify-braces-depth-guard.cjs` after any dependency changes.
