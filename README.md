# Sahaaya — Family Continuity Planner

**When you cannot be there, your circle knows what to do.**

Sahaaya helps a household capture essential routines, discover missing dependencies, rehearse a temporary absence, and produce human-approved action packs for trusted family and caregivers.

The P0 demo is intentionally bounded: a fictional primary household organizer is unavailable for 72 hours. Sahaaya traces five responsibilities, asks grounded follow-up questions, proposes trusted-circle assignments, blocks incomplete approval, and deterministically verifies the final role packs.

Built for **OpenAI Build Week 2026 — Apps for Your Life**.

## Public links

- Live app (no credentials required): https://sahaaya-khaki.vercel.app
- Demo video: https://youtu.be/yhBQ0NKOzM0

## How Codex and GPT-5.6 were used

- **Codex built the entire project.** Blueprint, system architecture, deterministic domain code, UI, tests, media pipeline, deployment, and submission docs were all produced in Codex sessions driving GPT-5.6 (primary session ID `019f5282-7c6f-76d1-888e-ffb0c25de3c8`).
- **GPT-5.6 powers the product's live analysis.** A server-only route (`app/api`) calls the OpenAI Responses API with **Structured Outputs** and `store:false`. The model proposes responsibilities, trusted-circle assignments, and grounded gaps from the household brief; every field is re-validated application-side against the cited source lines before anything is shown.
- **Deterministic TypeScript decides.** The model only proposes. Approval gating, candidate-pack compilation, five deterministic verification assertions, and a SHA-256 receipt are pure TypeScript (`lib/domain`), so the demonstrated plan is reproducible.
- **Replay mode** uses a fictional, visibly labelled fixture so the public demo is credential-free and deterministic; **Live GPT-5.6 Proof** performs the real model call on demand.

## Setup

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local   # optional: add OPENAI_API_KEY for the Live GPT-5.6 path
npm run dev                  # http://localhost:3000 (Replay mode works with no key)
```

Environment variables (`.env.example`):

- `OPENAI_API_KEY` — only needed for the Live GPT-5.6 proof; Replay mode runs without it.
- `OPENAI_MODEL` — defaults to `gpt-5.6`.
- `SAHAAYA_PROVIDER` — `replay` (default, deterministic fixture) or `live`.

### Quality gates

```bash
npm run lint        # eslint, zero warnings
npm run typecheck   # strict TypeScript
npm test            # seven unit/golden-path assertions
npm run demo-assert # golden-path demo assertions
npm run build       # production build
```

### Try the demo (same steps judges can follow)

1. Open the app and click **Extract Continuity Map** — the deterministic Replay path maps five responsibilities with citations from the fictional brief.
2. Optionally click **Run Live GPT-5.6 Proof** — the server-only Responses API call (Structured Outputs, `store:false`) returns validated analysis and never auto-approves a plan.
3. Approve all five assignments; compilation stays blocked until every decision is made.
4. Compile candidate packs, then verify: five deterministic assertions and a 64-character SHA-256 receipt.

## Safety and privacy

Sahaaya does not store passwords, access codes, account numbers, identity documents, medical records, or raw private files. It does not contact people, change calendars, dispatch emergency help, or provide medical, legal, financial, or safeguarding advice. Replay data is fictional and visibly labelled.

## Documentation

- Master blueprint: `docs/blueprint/SAHAAYA_MASTER_BLUEPRINT_v1.md`
- Architecture: `docs/architecture/SYSTEM_ARCHITECTURE.md`
- Rules and evidence: `docs/hackathon/rules-and-evidence-matrix.md`
- Implementation plan: `docs/project/IMPLEMENTATION_PLAN.md`

## License

MIT — see `LICENSE`.
