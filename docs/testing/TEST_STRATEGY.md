# Test Strategy

## Required gates

- Lint and strict TypeScript typecheck.
- Contract tests for strict schemas, unknown keys, unknown IDs, citations, and sensitivity rejection.
- Replay tests for deterministic five-responsibility output.
- Workflow tests for rejection/pending blocks and decision revision.
- Compiler tests for isolated candidate packs and exact coverage.
- Verification tests for citations, ownership, gap resolution, and prohibited fields.
- Route tests for Replay, Live missing-key, provider error, and invalid payload cases.
- Golden demo assertion.
- Production build.
- Playwright desktop/mobile flow with axe.
- Secret scan and dependency audit.
- One bounded GPT-5.6 smoke proof with no secret/raw payload evidence.

## Truth rules

Replay tests prove deterministic application behaviour, not model quality. Live smoke proves the integration boundary, not household safety or correctness. Browser tests prove the depicted demo path only.

