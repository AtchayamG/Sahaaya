# User Journeys

## Golden path

1. User sees the fictional-data and planning-aid disclosure.
2. User loads the “Mira unavailable for 72 hours” Replay brief.
3. Sahaaya maps five responsibilities and cites the source facts.
4. User reviews three missing-information questions and the detected availability conflict.
5. User starts the 72-hour rehearsal and sees the dependency chain.
6. User rejects one proposed assignment; compilation fails closed.
7. User changes the decision, approves all five, and compiles candidate role packs.
8. User runs deterministic verification and downloads the receipt.

## Live text path

The user enters a bounded, non-sensitive household brief. Live GPT-5.6 returns the same strict contract. Invalid, ungrounded, or prohibited content produces a visible error and no fallback.

## Voice path

The user explicitly starts recording, reviews the transcript, edits it if needed, and submits it through the same text boundary. Recording never starts automatically and is not retained after transcription.

## Failure paths

- Missing API key: Live disabled with a clear explanation; Replay remains available.
- Model or schema failure: preserve input, show typed error, allow retry.
- Prohibited secret-like input: block provider call and explain safe alternatives.
- Pending/rejected decision: block compilation and identify the exact items.

