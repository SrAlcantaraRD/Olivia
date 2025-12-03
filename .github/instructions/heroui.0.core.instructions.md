---
applyTo: "**/*.atom.tsx,**/*.core.tsx,**/ui/components/**/*.{ts,tsx}"
description: "HeroUI core guidance (copied from existing instruction artifact)."
---
````instructions
# heroui-native Core Guidance — Consolidated

This artifact has been consolidated into the canonical architecture guide.

See: `docs/architecture/condensed-copilot-guide.md` — section "UI: heroui-native patterns & atoms" for the canonical wrapper patterns, compound component usage, and accessibility rules.

Original content archived at: `.github/artifacts/archive/4.heroui__0.core.instructions.md`

If you need the original full text, open the archive file above or check Git history.
---
applyTo: "**/frontend/web/**/src/**/*.{tsx,ts}"
description: "Core HeroUI (web) component system usage: atoms, molecules, organisms, forms, tables, typography, layout & best practices."
---

# HeroUI Core UI Instructions

Foundational guidance for composing frontend pages & components (atoms → molecules → organisms → pages) while staying consistent, accessible, and performant.

## Layered Component Taxonomy
| Layer | Location Example | Purpose | Rules |
|-------|------------------|---------|-------|
| Atoms | `components/atoms/*` | Small, styleable UI primitives (typography, badges, icons) | No data fetching or business logic |
| Molecules | `components/molecules/*` | Composition of atoms (tables, cards, menu items) | Accept data via props; no side-effects |
| Organisms | `components/organisms/*` | High-level feature blocks (lists, complex panels) | May orchestrate hook calls if generic; avoid direct HTTP |
| Forms | `components/forms/*` | Entity creation/update; validation orchestration | Use grid helpers, never embed route logic |
| Pages | `pages/**` | Route-level assembly of organisms & logic | Coordinate hooks, adapters, navigation, modals |

Directional dependency: atoms ← molecules ← organisms ← pages (forms can be used by organisms or pages). Never import downward (e.g. atom importing a page).

## Naming & File Patterns
| Artifact | Pattern | Example |
|----------|--------|---------|
| Atom | `<feature>.atom.tsx` | `typography.atom.tsx` |
| Molecule | `<feature>.molecule.tsx` | `custom-table.molecule.tsx` |
| Organism | `<feature>.organism.tsx` | `map-position-list.organism.tsx` |
| Form | `<action>-<entity>.form.tsx` | `create-map.form.tsx` |
| Page | `<entity>-list.page.tsx` / `<entity>-details.page.tsx` | `role-details.page.tsx` |

... (content consolidated; archived for full details)

````
