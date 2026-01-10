# Git workflow, testing, deployment

## Git workflow

### Branch naming convention

```bash
# Feature branches
git checkout -b feature/brief-description
# e.g., feature/caregiver-invite, feature/procedure-logging

# Bug fixes
git checkout -b fix/issue-description
# e.g., fix/database-migration-error

# Hotfixes (production issues)
git checkout -b hotfix/critical-bug
# e.g., hotfix/data-loss-prevention

# Release branches
git checkout -b release/v1.2.0
```

### Commit message format

```bash
# Using commitlint with conventional commits
<type>(<scope>): <description>

# Types:
# feat: new feature
# fix: bug fix
# docs: documentation
# style: formatting
# refactor: code restructuring
# test: testing
# chore: maintenance

# Examples:
feat(auth): add caregiver invitation flow
fix(database): resolve migration deadlock
docs(api): update port adapter documentation
refactor(ui): extract common form components
test(domain): add use case validation tests
```

### Pull request template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
<!-- Add screenshots for UI changes -->

## Checklist
- [ ] Code follows Clean Architecture principles
- [ ] TypeScript strict mode enabled
- [ ] Accessibility standards met
- [ ] I18n keys added for new strings
- [ ] Database migrations tested
- [ ] Documentation updated
```

## Development environment setup

### Local development

```bash
pnpm install
pnpm start
pnpm ios      # iOS simulator
pnpm android  # Android emulator
pnpm web      # Web browser
```

## Quality gates (run before pushing)

```bash
pnpm biome:check
pnpm test
```

Note: `pnpm typecheck` is recommended but currently fails due to known test/mocks drift (tracked in `.context/debt.md`).

## Testing

This repo uses Jest for unit tests and Detox for E2E.

- Unit tests: `pnpm test`, `pnpm test:watch`, `pnpm test:coverage`
- E2E (Detox): `pnpm e2e:*`

See `.context/testing.md` for the current test folder layout and references.
