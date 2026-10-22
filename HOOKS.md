# Git hooks

The repository uses **Husky**. Hooks are installed by the `prepare` script when
you run `pnpm install`.

The hook files live in `.husky/` and are executable shell scripts.

## pre-commit

```sh
pnpm lint
npx @biomejs/biome format --write
npx @biomejs/biome check --write
git update-index --again
```

- `pnpm lint` runs `expo lint`.
- Biome formats and fixes the working tree.
- `git update-index --again` restages files that the hooks modified.

There is no `set -e` and no `|| exit 1`, so only the last command determines the
hook's exit status. A failing lint or Biome step does not necessarily block the
commit.

`lint-staged.config.js` exists, but no hook uses it today. The hook also runs
Biome over the whole project rather than only staged files, contrary to older
documentation.

## commit-msg

```sh
pnpm dlx commitlint --edit $1
```

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<optional scope>): <subject>
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
`build`, `ci`, `chore`, `revert`. Examples:

```bash
git commit -m "feat(module): add catheterization wizard step"
git commit -m "fix(qr): reject payloads with mismatched versions"
git commit -m "docs: correct the architecture links"
```

## pre-push

```sh
pnpm typecheck
pnpm test
pnpm test:ci
# then, if the release build is missing:
pnpm e2e:build:ios
pnpm e2e:test:ios
```

This is a heavy hook: it typechecks, runs the unit suite twice, and builds and
runs the iOS release Detox suite when `ios/build/Build/Products/Release-iphonesimulator/TFG.app`
is absent.

The first two commands are also not guarded by `|| exit 1`; only `test:ci` and
the E2E commands explicitly abort the push.

**The hook currently blocks every push**, because `pnpm test:ci` fails on `main`
(see [TESTING.md](TESTING.md)). Do not bypass it silently. Either fix the failure
or use `git push --no-verify` deliberately and say so in the pull request
description.

## Bypassing (discouraged)

```bash
git commit --no-verify -m "chore: ..."
git push --no-verify
```

Skipping hooks is acceptable only for work-in-progress commits that will be
cleaned up before review, or when a documented pre-existing failure is unrelated
to the change.

## Configuration

- Hook scripts: `.husky/`
- Lint/format rules: `biome.json`
- Commit rules: `commitlint.config.js`
- Unused staged-file rules: `lint-staged.config.js`
