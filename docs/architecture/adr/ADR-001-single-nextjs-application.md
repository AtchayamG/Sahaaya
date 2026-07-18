# ADR-001 — One Next.js Application

**Status:** Accepted

Use one strict TypeScript Next.js application for UI, API, Replay, and Live provider boundaries. This minimizes deployment and judging friction while preserving server-only secrets. No database, auth, queue, or microservice is justified for P0.

