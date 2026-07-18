# Repository Instructions

Source of truth: `docs/blueprint/SAHAAYA_MASTER_BLUEPRINT_v1.md`.

- Complete P0 milestones in order; optional voice and connectors must not delay the deterministic golden path.
- Keep the root clean. Root Markdown is limited to `AGENTS.md` and `README.md`; durable documents belong under `docs/`.
- Use strict TypeScript contracts, deterministic fixtures, explicit Live/Replay providers, and fail-closed validation.
- Never store passwords, account numbers, government IDs, medical records, precise access codes, or raw uploaded household documents.
- Treat Sahaaya as a planning and communication aid, not emergency dispatch, medical, legal, financial, or safeguarding advice.
- Every responsibility, gap, assignment, and action-pack item must cite an exact user-provided fact or visibly state that it is an unresolved assumption.
- Require explicit human approval before generating final role packs. P0 never messages contacts, modifies calendars, or performs external actions.
- Run lint, typecheck, tests, production build, browser smoke, accessibility, secret checks, and the deterministic demo assertion before calling a milestone complete.
- Keep `docs/project/taskstatus.md`, `docs/project/handover.md`, `docs/project/BUILD_STATUS.json`, and `docs/project/CODEX_RESULT.md` accurate.

## External-agent routing

- Use `orchestrate-external-coding-agents` for delegated work.
- Claude Fable 5 owns complex contracts/backend reasoning when available; fall back to Opus 4.8 after Fable quota exhaustion.
- agy owns UI/UX, responsiveness, and visual QA with Gemini 3.5 Flash High when available.
- Hermes owns bounded tests, documentation, repair, and fallback work when authenticated.
- Use one clean non-main worktree per writable worker with non-overlapping file ownership and a DONE / BLOCKED / RISK / NEXT handoff.
- Codex owns architecture, integration, verification, commits, deployment, media, and submission truthfulness.

## Product identity

- Name: Sahaaya
- Full title: Sahaaya — Family Continuity Planner
- Tagline: When you cannot be there, your circle knows what to do.
- Category: Apps for Your Life

