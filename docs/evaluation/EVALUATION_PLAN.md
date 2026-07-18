# Evaluation Plan

## Deterministic fixture scorecard

| Metric | Target |
|---|---:|
| Known responsibilities recovered | 5/5 |
| Valid fact citations | 100% |
| Invented IDs | 0 |
| Known availability conflicts detected | 1/1 |
| Compilation blocked with pending/rejected decision | 100% |
| Verified role-pack responsibility coverage | 5/5 |
| Prohibited sensitivity categories in output | 0 |
| Serious/critical axe violations | 0 |

## Live proof

Run one bounded fictional prompt through GPT-5.6 Structured Outputs with `store: false`. Validate schema, IDs, and citations. Record only model name, timestamp, high-level pass/fail, and sanitized error metadata.

## Judge experience

A logged-out judge must load Replay, complete the five-stage flow, demonstrate a rejection block, verify the packs, and download the receipt without credentials or setup.

