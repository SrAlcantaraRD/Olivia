# Documentation index

Most design documents are in Spanish. They were written while the app was being
built, so some describe intended flows rather than the current implementation.
Each section below says how far a document can be trusted.

For the product overview, current limitations and setup, read the
[README](../README.md) first.

## Current reference

- [Architecture overview](../.context/architecture/overview.md) — layers,
  composition root, runtime data flow.
- [Architecture patterns](../.context/architecture/patterns.md) — ports,
  adapters, hooks, storage and date conventions.
- [AI rules and constraints](../.context/ai-rules.md) — hard engineering rules
  used by maintainers and AI assistants.
- [Known technical debt](../.context/debt.md) — tracked issues.
- [Testing](../TESTING.md) — test layout, commands and measured status.
- [Git hooks](../HOOKS.md) — what runs on commit and push.
- [Security policy](../SECURITY.md) — reporting and known limitations.

## Domain and data design

- [Domain-driven design](architecture/domain-driven-design.md) — ubiquitous
  language and bounded contexts. **Design reference**; it uses "Patient"/"Child"
  interchangeably, while the code uses `patient`.
- [Data model](architecture/data-model.md) — tables and relationships.
  **Partly outdated**: it still mentions a `sync_payloads` table, which does not
  exist in the current schema.
- [Use cases](architecture/use-cases.md) — intended user flows. **Partly
  outdated**: it describes permission levels and a secondary-caregiver step that
  are not implemented.

## Product and requirements

- [Original PRD/PSD](PRD_PSD_cateterismo.md) (and the [.txt copy](PRD_PSD_cateterismo.txt))
  — the initial academic product brief. **Historical**: mentions reminders,
  role permissions, encrypted P2P sync, PDF/CSV export, an ElysiaJS backend and
  REST endpoints, none of which are part of the current app.
- [PRD v2 — cloud platform](roadmap/prd-v2-cloud-platform.md) — **exploratory
  draft, not implemented**. Describes a future Supabase-based, multi-user
  platform. It is not a commitment and contains no verified compliance.

## UI and features

- [Screen wireframes](architecture/screens-wireframe.md) and the
  [step-by-step wireframes](wireframe-screens/) — historical design sketches with
  placeholder data.
- [Form wizard component](components/form-wizard.md) — **outdated**: the current
  component is `src/ui/components/molecules/wizard.molecule.tsx` (`Wizard`), not
  `FormWizard`.
- [Parent setup form](components/parent-setup-form.md) — implementation notes.
- Feature notes in [`features/`](features/) — point-in-time records for the
  settings header, secondary caregivers, hooks refactor, language switch, logout
  wipe, summaries, performance and theme toggle. Treat them as history, not as
  current specifications.
- [Private-zone i18n keys](i18n/private-zone-keys.md) — key inventory.

## Testing

- [Domain unit-test coverage plan](testing/domain-unit-test-coverage-plan.md) —
  a plan to reach full coverage. **Not achieved**; measured coverage is 18.5% of
  statements. See [TESTING.md](../TESTING.md).

## Conventions

- Architecture and code rules live in [`.context/`](../.context/) and
  [`agents.md`](../agents.md).
- Contribution workflow: [CONTRIBUTING.md](../CONTRIBUTING.md).
