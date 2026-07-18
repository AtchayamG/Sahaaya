# Threat Model

## Protected assets

Household facts, trusted-circle identities, user decisions, server API key, and exported packs.

## Primary threats and controls

| Threat | Control |
|---|---|
| User pastes passwords, PINs, codes, IDs, account numbers, or health records | Client warning plus server redaction/rejection; never persist raw input |
| Prompt injection in household text | Treat input as data; strict Structured Output; known-ID and citation validation |
| Model invents a person, fact, or assignment | Reject unknown IDs and unsupported citations |
| Model authorizes an unsafe action | Provider cannot set decision or verification fields |
| False emergency confidence | Persistent planning-aid disclosure; no dispatch or guarantee language |
| Contact named without consent | No outbound sharing; manual user-reviewed export only |
| Secret leakage | Server-only environment key, `store: false`, secret scan, `.env*` ignored |
| XSS or unsafe export | Render text safely; JSON serialization; no raw HTML |
| Denial of service / cost abuse | Input, duration, and request rate bounds |

## Data lifecycle

P0 is in-memory. Browser refresh clears state. Live request storage is disabled for the OpenAI call. No analytics or third-party telemetry is required.

