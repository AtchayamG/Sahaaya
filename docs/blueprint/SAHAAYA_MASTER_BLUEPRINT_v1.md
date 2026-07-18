# Sahaaya Master Blueprint v1

## 1. Product contract

**Sahaaya — Family Continuity Planner** helps a household answer one question: “If the person who normally coordinates everything were unavailable for 72 hours, would the trusted circle know what to do?”

The product converts a bounded household brief into a cited continuity map, identifies missing or conflicting knowledge, proposes responsibility assignments, requires human approval, and produces verified role-specific action packs.

## 2. Hackathon fit

- Category: Apps for Your Life.
- Consumer audience: households, multigenerational families, single parents, caregivers, roommates, and trusted neighbours.
- Codex role: architecture, implementation, tests, UI, evidence review, and delivery.
- GPT-5.6 role: structured extraction, grounded gap detection, follow-up question generation, and bounded assignment proposals.
- Deterministic application role: schema validation, citation checks, state transitions, approval enforcement, pack compilation, verification, and export.

## 3. Golden scenario

Fictional household organizer **Mira** is unexpectedly unavailable for 72 hours. Her trusted circle includes spouse **Arjun**, grandmother **Lakshmi**, and neighbour **Neha**. Five responsibilities must continue:

1. School pickup and the approved backup adult.
2. Pet feeding and an already-written care schedule.
3. Elder relative wellness check and preferred contact escalation.
4. Time-sensitive household utility payment reminder, without account credentials.
5. Home access coordination and emergency-contact information, without access codes.

The fixture contains exact source facts, deliberate gaps, and one conflicting availability constraint. No real personal data is used.

## 4. P0 workflow

1. **Capture:** load the fictional Replay brief or enter a bounded text brief. Optional voice transcription is a real input convenience, never required for Replay.
2. **Map:** GPT-5.6 or Replay produces exactly five responsibilities with exact fact citations.
3. **Question:** show missing facts and three prioritized follow-up questions. Unanswered questions remain visible assumptions.
4. **Rehearse:** apply the 72-hour-unavailability scenario and expose broken dependencies or conflicts.
5. **Assign:** propose one primary owner and optional backup for each responsibility.
6. **Approve:** the user approves, revises, or rejects every assignment. Any pending/rejected item blocks compilation.
7. **Compile:** create isolated role packs; never message or modify an external system.
8. **Verify:** deterministic assertions confirm five responsibilities, approved ownership, citation integrity, no prohibited secret categories, and no unresolved critical dependency.
9. **Export:** download a JSON continuity receipt and printable role packs labelled as planning aids.

## 5. P0 invariants

- Exactly five golden-scenario responsibilities.
- Every extracted responsibility and gap cites at least one known fact ID.
- Unknown people, facts, or responsibility IDs fail closed.
- Model output cannot approve assignments or declare verification success.
- All five assignments require an explicit human decision.
- Rejected or pending assignments block compilation and export.
- Compiled packs are “candidate packs” until deterministic verification passes.
- Replay and Live results are visibly distinct; Live never silently falls back.
- No external actions, secrets, medical interpretation, legal authority, or emergency-dispatch claims.

## 6. Provider boundary

### Simulated Replay

- Default judging path.
- Credential-free, deterministic, fixture-backed, and visibly labelled “Simulated Replay.”
- Produces the same strict assessment contract as Live.

### Live GPT-5.6

- Server-only Responses API call with Structured Outputs and `store: false`.
- Receives only bounded user text plus public schema instructions.
- Must pass Zod validation and application-level known-ID/citation checks.
- Provider or validation failure is visible and blocks progress; no Replay fallback.

## 7. Architecture

One dependency-light Next.js TypeScript application:

- `app/`: UI and API route.
- `components/`: accessible workflow panels and dialogs.
- `lib/contracts.ts`: strict schemas and types.
- `lib/fixtures.ts`: fictional golden scenario.
- `lib/replay-provider.ts`: deterministic assessment.
- `lib/live-provider.ts`: bounded GPT-5.6 adapter.
- `lib/workflow.ts`: state machine and approval rules.
- `lib/compiler.ts`: candidate pack generation and verifier.
- `tests/`: unit, contract, golden-path, route, browser, and accessibility checks.

No database, authentication, vector store, background queue, OAuth connector, or external messaging in P0.

## 8. Experience specification

The desktop layout uses a continuity map on the left and the active workflow on the right. Mobile collapses into a single ordered flow. The five stages remain visible: Capture, Map, Rehearse, Approve, Verify.

Visual language: warm ivory background, deep ink text, muted turmeric accent, trustworthy teal for verified states, terracotta for unresolved risk, and no generic neon-agent aesthetic.

Every long identifier wraps. Status is communicated by text and icon in addition to colour. All interactions are keyboard accessible, focus-visible, and announced through live regions.

## 9. Safety and trust boundaries

- Do not request passwords, PINs, door codes, government IDs, bank/account numbers, diagnoses, prescriptions, or raw legal documents.
- Redact common secret patterns before provider calls and reject prohibited content categories.
- Treat all user text as untrusted input.
- Never imply emergency coverage or guaranteed continuity.
- Display “Call local emergency services” guidance only as static safety copy when immediate danger is mentioned; do not attempt diagnosis or dispatch.
- Do not infer consent from a contact being named. P0 exports packs for the user to review and share manually.

## 10. Evaluation

The deterministic fixture must achieve:

- 5/5 known responsibilities extracted.
- 100% fact-citation validity.
- 0 invented people, responsibilities, or source facts.
- 1 known availability conflict detected.
- Compilation blocked with any non-approved assignment.
- 100% verified role-pack coverage after approval.
- 0 prohibited secret-category fields in output.
- Desktop/mobile golden path and axe scan pass.

Live proof is a separate bounded smoke test and is never substituted for deterministic product verification.

## 11. Milestones

- M0: rules, blueprint, product, architecture, safety, tests, evaluation, and submission plan.
- M1: contracts, fictional fixture, Replay provider, workflow state machine.
- M2: compiler, verifier, receipt, API route, Live provider.
- M3: production UI and responsive/accessibility flows.
- M4: complete automated gates and bounded GPT-5.6 proof.
- M5: public repository and judging deployment.
- M6: screenshots, video, captions, thumbnail, and submission copy.
- M7: truthful Devpost submission and public-link audit.

## 12. Definition of done

Done means the repository is clean and licensed; the app and Replay demo work without credentials; the Live adapter has a bounded proof; all required automated gates pass; public repo/app/video links work logged out; the README and Devpost copy match reality; and the Apps for Your Life entry is visibly submitted.

