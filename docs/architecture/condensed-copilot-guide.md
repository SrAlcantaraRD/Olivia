**Tech Stack & Versions**

- **Node / Package Manager:** `pnpm` (use `pnpm` only)
- **React:** `19.1.0`
- **React Native:** `0.81.5`
- **Expo SDK:** `~54.x` (lockfile may show `54.0.25`) — verify lockfile before release
- **Expo Router:** `~6.x` (lockfile may show `6.0.15`)
- **TypeScript:** `~5.9.x` (dev)
- **Drizzle ORM / Kit:** `drizzle-orm@^0.44.x`, `drizzle-kit@^0.31.x`
- **SQLite:** `expo-sqlite@~16.x`
- **Zod:** `^4.x`
- **Biome (formatter/linter):** `@biomejs/biome@2.x`
- **Testing:** `jest@~29.x`, `jest-expo@^54.x`, `@testing-library/react-native@^13.x`, `detox@^20.x`
- **UI:** `heroui-native@*` (wrap; do not import directly in screens), `uniwind` + `tailwind-variants`
- **CI / Hooks:** `husky`, `commitlint` (Conventional Commits)

**Notes:** use exact versions from `pnpm-lock.yaml` at release time; annotate any lockfile vs package.json discrepancy.

**Rules of Gold (Axioms)**

- **Domain is technology-agnostic** (ALWAYS): domain layer must NOT import infra/UI. **CRITICAL**
- **Ports → Adapters (Hexagonal):** domain defines `I{Entity}Port`; infra implements `{tech}.{entity}.adapter.ts`. **CRITICAL**
- **No business logic in UI components:** use hooks → use-cases → ports. **CRITICAL**
- **Use Zod for validation:** all use-cases validate input with Zod, map errors to domain error types. **CRITICAL**
- **Use `pnpm` + Biome:** `pnpm` for package management; Biome for formatting/linting (80 cols, single quotes). **CRITICAL**
- **Atomic Design enforced:** atoms/molecules/organisms; wrap `heroui-native` in `*.atom.tsx`. **HIGH**
- **DB rules:** Drizzle ORM; soft-delete/status & audit columns mandatory; migrations via `pnpm db:generate`. **HIGH**
- **Git hooks & tests:** Husky pre-commit (biome format/lint), pre-push runs tests; commitlint enforces Conventional Commits. **HIGH**

**Strictly Prohibited (alerts)**

- **DO NOT** import `heroui-native` or raw third-party UI libs directly in screens. Use atoms.
- **DO NOT** put domain logic inside React components or screens.
- **DO NOT** use `npm` or `yarn` for project workflows—use `pnpm` only.

**Conventions of Architecture (folders, naming, patterns)**

- Project root: `src/`
- Domain: `src/domain/` — entities, DTOs, ports, use-cases, errors, mappers, zod schemas
- Database infra: `src/database/` (schemas, adapters, migrations) — unify on `src/database/`
- Adapters: `src/database/adapter/` or `src/adapter/` — filename: `{tech}.{entity}.adapter.ts` (e.g., `sqlite.task.adapter.ts`)
- Ports: co-locate in domain: `src/domain/{entity}/{entity}.port.ts` → `I{Entity}Port`
- Hook layer: `src/hooks/` — `use-{feature}.ts` or `use-{entity}.hook.ts` (inject adapters)
- UI: `src/ui/components/atoms/*.atom.tsx`, `*.molecule.tsx`, `*.organism.tsx`, `*.particle.tsx`
- Adapters mapping: `static toDomainEntity(adapterRow)` required on adapters
- Tests: `tests/unit-test/...` mirror source layout; use-case specs in `*.use-case.spec.ts`
- Path aliases: `@/*` → `./src/*`; `@/i18n` → `./src/ui/i18n/*`

**Import Rules (strict)**

- Screens import only atoms/molecules/organisms via `src/ui/components/...` (no raw `heroui-native`)
- Use `useAdapters()` factory for DI in hooks and tests.

**Style Guide (Snippets) — minimal canonical examples**

Adapter → Port (GOOD)
```ts
// src/database/adapter/sqlite.patient.adapter.ts
export class SQLitePatientAdapter implements IPatientPort {
  static toDomainEntity(r){ return { id:r.id, uuid:r.uuid, name:r.name }; }
  async getById(id){ const row = await db.query.PATIENT.findFirst({ where: f=>f.id.eq(id) });
    return row ? SQLitePatientAdapter.toDomainEntity(row) : null; }
}
```

Hook injecting adapters (GOOD)
```ts
// src/hooks/use-adapters.ts
export const useAdapters = ()=>({ patientAdapter:new SQLitePatientAdapter(), notify:new ToastAdapter() });
```

Atom UI (GOOD)
```tsx
// src/ui/components/atoms/button.atom.tsx
export const ButtonAtom=({i18nKey,...p})=> (
  <Button {...p}><TypographyParagraph i18nKey={i18nKey}/></Button>
);
```

Use-case with Zod validation (GOOD)
```ts
// src/domain/carer/use-cases/setup-parent.use-case.ts
const parsed = RequestSetupParentSchema.safeParse(input);
if(!parsed.success) throw new DomainError('INVALID_PAYLOAD', parsed.error.message);
await this.carerAdapter.create(parsed.data.parent);
return { ok:true };
```

Bad vs Good (1-line each)
- Bad: `Screen` directly calls `db` or `drizzle`.
- Good: `Screen` calls `useHook()` which calls use-case which calls adapter.

**Workflows Specific (exact zsh commands)**

- Dev / start
```zsh
pnpm start
pnpm ios
pnpm android
```
- Lint / Format (Biome)
```zsh
pnpm biome:format
pnpm biome:lint
pnpm biome:check
```
- Tests
```zsh
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm test:ci
```
- E2E (Detox)
```zsh
pnpm e2e:build:ios:debug
pnpm e2e:test:ios:debug
```
- DB Migrations (Drizzle)
```zsh
pnpm db:generate
```
- Git / Hooks
```zsh
pnpm install    # prepare -> husky install
git commit -m "feat(scope): msg"    # Conventional Commits
```

**Duplications & Consolidation Plan**

- Consolidate repeated rules from: `.github/artifacts/**`, `docs/**`, `HOOKS.md` into this single file: `docs/architecture/condensed-copilot-guide.md` (this file).
- Action: rewrite artifact files to a 2-line reference pointing to this doc; keep full historical content in `/.github/artifacts/archive/` if needed.

**Risks / Preserve These Details**

- Exact Expo & Expo Router versions and lockfile discrepancies.
- DB constraints (FKs), audit columns, soft-delete semantics and migration config path (`src/database/*`).
- Zod schemas and domain error codes mapping.
- Husky pre-push test enforcement and Biome config (80 cols, single quotes).

**Essential Summary (for Copilot)**

1. Clean Architecture + Hexagonal: domain defines ports; infra implements adapters. Keep domain pure.
2. Use `pnpm` + Biome; pre-commit enforces format and lint; pre-push runs tests.
3. Adapters: `{tech}.{entity}.adapter.ts` with `static toDomainEntity`.
4. Hooks: `use-*` inject `useAdapters()` factory.
5. UI: Atomic Design; use `.atom.tsx` wrappers; no raw UI libs in screens.
6. Validation: Zod in use-cases; map to domain errors.
7. DB: Drizzle, soft-delete + audit columns, migrations via `pnpm db:generate`.
8. Tests: unit (use-case + adapter), e2e (Detox); gate via pre-push CI.
9. i18n: all UI strings via i18n keys; no hardcoded text.
10. Preserve version discrepancies and DB semantics when condensing.

---
File created as canonical, minimal source for Copilot & contributors. Replace repeated guidance files with references to this file.
