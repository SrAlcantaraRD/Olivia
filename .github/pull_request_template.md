## Summary

<!-- What does this PR change and why? -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor (no behaviour change)
- [ ] Documentation
- [ ] Build / CI / tooling
- [ ] Other (describe below)

## Related issue

<!-- e.g. Closes #123 -->

## How was this tested?

<!-- Commands you ran, platforms/devices covered, and relevant results. -->

- [ ] `pnpm biome:check` (or `pnpm exec biome ci .`)
- [ ] `pnpm typecheck` — currently fails on `main`; state any new or fixed errors
- [ ] `pnpm test` — currently fails on `main`; state any new or fixed failures
- [ ] Manual verification (describe)
- [ ] E2E (describe configuration)

## Screenshots / recordings

<!-- Optional. Use synthetic demo data only — never real patient data. -->

## Checklist

- [ ] The change respects the architecture flow (UI → hooks → use-cases → ports ← adapters)
- [ ] Domain code has no Expo/React Native imports
- [ ] No database or storage access from UI code
- [ ] Inputs are validated with Zod; no `any` or unsafe `as` casts
- [ ] No hard-coded user-facing strings (i18n keys used)
- [ ] Interactive components have `testID` props
- [ ] Tests added or updated, and docs updated when behaviour changed
- [ ] No secrets, credentials, `.env` files, keystores or certificates
- [ ] No real patient data or personal health information in code, fixtures, logs or screenshots
