# Prompt: new-endpoint (internal operations)

This project is local-first; “endpoints” usually mean **operations exposed via ports / QR bundles**, not HTTP.

## What to provide

- Operation name + intent (what capability is being added)
- Inputs/outputs (schemas, DTOs)
- Which layer consumes it (UI, QR flow, background job)

## Constraints

- Prefer extending existing ports over creating new ones
- Schemas live in `src/domain/**/use-case-schema/**`
- DTOs live in `src/domain/**/dto/**`

