---
applyTo: "**/*.hook-port.adapter.ts,**/*.hook-port.adapter.spec.ts"
description: "Frontend Hook-Port Adapter guidance (copied from existing instruction artifact)."
---
````instructions
# Frontend Hook-Port Adapter — Consolidated

This artifact has been consolidated into the canonical architecture guide.

See: `docs/architecture/condensed-copilot-guide.md` — section "Adapters: Frontend Hook-Port Adapters" for canonical patterns, error mapping rules, and test skeletons.

Original content archived at: `.github/artifacts/archive/4.heroui__1.hook-port-adapter.instructions.md`

If you need the original full text, open the archive file above or check Git history.
---
applyTo: "**/frontend/web/**/src/**/*api.*.hook-port.adapter.ts"
description: "Instructions for implementing frontend API Hook Port Adapters bridging HTTP client to domain hook ports."
---

# Frontend Hook Port Adapter Instructions

## Purpose
Translate HTTP client calls to `I<Entity>HookPort` contract. Centralize error mapping & response normalization.

... (content consolidated; archived for full details)

````
