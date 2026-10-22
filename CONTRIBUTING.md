# Contributing to Olivia

Thanks for taking the time to contribute. Olivia is a **local-only** mobile app
for tracking intermittent catheterization. It has no accounts and no cloud
backend: all data stays on the device.

By participating, you agree to follow our [Code of Conduct](./CODE_OF_CONDUCT.md).
For security issues, **do not open a public issue** — follow [SECURITY.md](./SECURITY.md).

## Before you start

- Read the [README](./README.md) for the product overview and architecture.
- Read [`.context/ai-rules.md`](./.context/ai-rules.md) for the non-negotiable
  engineering constraints.
- Browse [`docs/`](./docs) for domain, database and UI documentation.
- For anything non-trivial, open an issue first so we can agree on the approach.

## Requirements

- **Node.js 24** (see `.nvmrc`; `nvm use` works)
- **pnpm** (the only supported package manager — do not use npm or yarn)
- Optional: Xcode (iOS) and/or Android Studio (Android) for native builds
- Optional: an Expo account only if you build with EAS

## Setup

```bash
pnpm install
pnpm start          # Expo dev server
pnpm ios            # iOS simulator
pnpm android        # Android emulator
pnpm web            # Web
```

Database schema changes require a migration:

```bash
pnpm db:generate
```

## Quality gates

Run these before opening a pull request:

```bash
pnpm biome:check    # format + lint (writes fixes)
pnpm typecheck      # strict TypeScript, source and tests
pnpm test           # Jest unit tests
```

Useful extras:

```bash
pnpm test:coverage
pnpm test:ci
pnpm e2e:build:ios:debug && pnpm e2e:test:ios:debug
```

Git hooks run Biome and commit-message checks on commit, and a heavier check on
push. If a hook fails because of an unrelated pre-existing problem, say so in
the PR instead of silently bypassing it.

## Architecture rules

The dependency flow is strict:

```text
UI (src/app, src/ui) → hooks (domain/*/hook) → use-cases → ports ← adapters
                                                       (database/adapter, adapter)
```

- **Domain stays pure**: no Expo or React Native imports in `src/domain/**`
  (except the explicitly domain-owned hook layer).
- **No database access in the UI**: queries live in `src/database/adapter/**`.
- **No storage access in the UI**: use ports such as `ICachePort`.
- **Validate inputs with Zod** in `*.use-case-schema.ts` using `safeParse`.
- **No `any` and no unsafe `as` casts**; prefer `z.infer` and `satisfies`.
- **Use-cases return `IBaseResponse<T>`** (`success`, `message`, optional
  `details`); never throw raw errors from a use-case.
- **No hard-coded user-facing strings**: use typed i18n keys from
  `src/ui/i18n/locales/*`.
- **Accessibility is required**: give interactive components a `testID`.
- **Atomic design**: wrap third-party UI primitives in atoms/molecules instead of
  using them directly in screens.

## Commits and branches

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) and
are validated by commitlint:

```text
feat(module): add catheterization record wizard step
fix(sync): reject QR payloads with mismatched versions
docs: clarify local backup behaviour
```

Allowed types include `feat`, `fix`, `refactor`, `perf`, `test`, `docs`,
`build`, `ci`, `chore`, `style` and `revert`.

Branch names:

- `feature/<short-description>`
- `fix/<issue-or-description>`
- `hotfix/<critical-description>`
- `docs/<short-description>`
- `chore/<short-description>`

Keep commits focused. Do not mix formatting-only changes with behaviour changes.

## Pull requests

1. Fork the repository and create a branch from `main`.
2. Add or update tests for the behaviour you change.
3. Run the quality gates above.
4. Fill in the pull request template, including how you tested the change.
5. Link the related issue when one exists.

Keep pull requests small and reviewable. Large changes are easier to accept when
split into independent, working slices.

## Privacy and sensitive data

This project handles health information, so the following is mandatory:

- **Never** commit real patient data, names, dates of birth, identifiers,
  medical notes, or screenshots containing them.
- Use synthetic/demo data in tests, fixtures, issues, PRs and screenshots.
- **Never** commit secrets: `.env` files, API keys, tokens, keystores,
  certificates or private keys. `.env*` files are git-ignored — keep it that way.
- Do not add analytics, crash reporting or telemetry that sends data off-device
  without prior discussion. The app is "Sin nube. Sin cuentas."

## Reporting bugs and requesting features

Use the issue forms in `.github/ISSUE_TEMPLATE/`. Include the app version,
platform and reproduction steps for bugs, and remove any personal or health data
from logs and screenshots.

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](./LICENSE).
