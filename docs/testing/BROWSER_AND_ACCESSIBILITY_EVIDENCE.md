# Browser and Accessibility Evidence

Date: 2026-07-19 (Asia/Calcutta)

## Browser path

Playwright CLI drove a real Chromium session through:

1. Optional Live GPT-5.6 proof: succeeded with 5 responsibilities, 5 proposals, and 4 gaps.
2. Capture and deterministic map: exactly 5 cited responsibilities.
3. Rehearsal: availability conflict and credential exclusions surfaced.
4. Assignment review: compilation disabled at 0/5 approvals and enabled only at 5/5.
5. Candidate compilation: cards remained explicitly labeled Candidate.
6. Deterministic verification: all 5 assertions passed and a 64-character SHA-256 receipt checksum rendered without overflow.
7. Export state: manual-sharing copy and two local download controls rendered.

## Responsive evidence

- Viewport: 360 × 800.
- `documentElement.scrollWidth`: 360.
- `documentElement.clientWidth`: 360.
- Result: no horizontal document overflow.

## Accessibility evidence

The reusable `scripts/browser-audit.js` harness injected the locally installed axe-core engine into the final exported state. After correcting muted-text contrast and the mobile progress rail, the audit returned zero violations.

The browser console's only earlier error was a missing favicon during development; `app/icon.svg` now supplies the icon. No application runtime exception occurred during the golden path.

## Dependency evidence

`npm audit --omit=dev --audit-level=moderate` reports zero vulnerabilities. A PostCSS override keeps Next.js on the patched `8.5.10` release without a framework downgrade.
