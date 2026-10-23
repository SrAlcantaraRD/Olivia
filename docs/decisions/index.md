# Decisions

Snapshot of technical decisions worth preserving without a full ADRs ceremony.

## 2026-10-22 — Lock MMKV at 4.3.2

**Context:** attempted an MMKV bump and an ADRs page because several threads here were landing as open ends.

**Decision:** keep `react-native-mmkv@4.3.2` as the committed pin. It is already the resolved lockfile version and the highest published `4.x` release in the registry; the previous "what if we go higher" question has no viable candidate above it on the same stack.

**Why this is actually safe to leave here:**
- Lockfile already resolves `react-native-mmkv@4.3.2`.
- Peer line is exact, not a wide range, so that alone is not the source of drift.
- The real cross-package coupling worth tracking here is the Nitro SDK peer relationship, the Worklets/Reanimated peer range, and the Expo-native package reality. Those are the reasons this stack is sensitive to isolated moves, not the MMKV version itself.
- Reading the tree as 'MMKV triggers a Nitro SDK require' is misleading. MMKV itself depends on `react-native-nitro-modules` at the package level, and the more useful question for this repo is whether the locked pair and the Reanimated/Worklets peer range stay coherent.

**Actual state of the committed tree:** `package.json` declares `react-native-nitro-modules@^0.35.10` and the lockfile resolves `react-native-nitro-modules@0.35.10` everywhere it appears: standalone and inside the MMKV 4.3.2 dependency. There is no later Nitro SDK resolution in the current lockfile. The more accurate reading is that the MMKV/Nitro pairing in this tree is internally consistent, and the coupling that is easiest to break by accident is Reanimated `0.5 - 0.8` worklets peer range against the installed `react-native-worklets@0.5.1`.

**Verification status:** not run. This is the decision record, not a completed upgrade. No install or typecheck was executed for this page.

**Next step:** pick a single concrete direction and timebox it before touching more files:
- Keep MMKV at 4.3.2 and keep the MMKV/Nitro lockfile pairing as-is, since the current tree is already `react-native-mmkv@4.3.2` with `react-native-nitro-modules@0.35.10`. If this repo ever changes MMKV, Nitro, Reanimated or Worklets, do it as one controlled move and re-verify the lockfile and native build together.
- Update the peer-range/honesty discussion only if a future change makes the MMKV/Nitro or Reanimated/Worklets pairing diverge from what the lockfile resolves.
- Freeze the current docs and lockfile as the reconciliation point and treat dependency verification as "docs corrected, no further action today."

## 2026-10-22 — ADRs page replaces scattered decision chatter

**Context:** dependency-audit notes, MMKV upgrade reasoning, and several "why we are/aren't doing X" threads were living only in chat and in the dependency-audit file.

**Decision:** add one `docs/decisions` page and treat that as the lightweight decision home for this kind of trade-off until the repo has a heavier governance process.

**What lives here now:**
- MMKV leveling decision above.
- Dependency-audit execution summary with the honest reading of what is and isn't actually coupled.

## 2026-10-22 — Dependency audit findings (execution summary)

**What was actually checked:**
- Registry existence and published lineage of `react-native-mmkv`.
- Lockfile resolution of `react-native-mmkv`, `react-native-nitro-modules`, and `react-native-worklets`.
- `package.json` declared ranges for the same packages.
- The locally resolved Nitro SDK version carried by the MMKV install tree.

**Key findings:**
1. MMKV `4.3.2` is the ceiling in the registry, not a local accident.
2. MMKV already depends on `react-native-nitro-modules`, so "does the compiled app require Nitro SDK" is not answered by whether `react-native-nitro-modules` is separately installed; it is answered by build/runtime compatibility of the Nitro SDK version itself.
3. The MMKV/Nitro pairing in the current tree is internally consistent (`react-native-mmkv@4.3.2` with `react-native-nitro-modules@0.35.10`). The older MMKV 4.1.0 / Nitro 0.31.10 constraint in the docs no longer describes this tree, and the active coupling worth protecting is the Reanimated/Worklets peer range, not a Nitro version drift.

**What was not checked:**
- A live install of a bumped version.
- A typecheck/build of the app after any change.
- E2E or device runtime after any change.

**Recommendation without action:** treat dependency drift here as a lockfile + peer-honesty problem, and verify with a real resolved-tree check or local build before claiming a bump succeeded or failed. A failed local check is worth more than a version "exists upstream" argument.

## 2026-10-22 — Automated dependency updates are out of scope for now

**Context:** the CI palette already includes formatting, typing, and tests; it does not currently own automated dependency upgrades, and PRs are coming from a single human contributor anyway.

**Decision:** do not add Dependabot/Renovate or any auto-updater as part of today's work. The repo has real stack-coupling risk around MMKV/Nitro/Worklets/Reanimated, and untracked automated bumps would make it harder to see which change actually moved the tree.

**If this ever gets revisited:**
- Keep it scoped to advisory reporting first, not automatic commits.
- Gate actionable bumps behind a human decision and a verification step that can fail cleanly.
- Prefer one explicit upgrade decision with a verification artifact over many silent package moves.

## 2026-10-22 — Automated commit splitting is out of scope for today

**Context:** a commit-organizer skill exists and was considered for tidying the working tree.

**Decision:** do not use automated commit splitting in this session. The current work is exploratory dependency verification and a decision page, not a reviewable implementation slice that benefits from engineered commit boundaries yet.

**When that would change:** if a concrete change starts touching domain logic, hooks, use cases, database adapters, UI flows, and test suites in the same session, revisit commit unit boundaries and PR slicing at that point.

## 2026-10-22 — Validation strategy is local-only until you ask otherwise

**Context:** Android/iOS simulator access and build paths exist in the repo tooling, but this session is not attempting a real device or CI build.

**What was done this session:** a doc/honesty reconciliation only. README, TESTING.md, the stale README.txt, and the decision page were updated to describe the actual committed pairing — `react-native-mmkv@4.3.2` with `react-native-nitro-modules@0.35.10`, plus the `react-native-reanimated@4.1.7` / `react-native-worklets@0.5.1` peer coupling — instead of the old MMKV 4.1.0 / Nitro 0.31.10 framing.

**What was not done:** no install, typecheck, native build, or Detox/EAS run.

**If you want more than doc reconciliation:** say so explicitly and I will pick the smallest verification path that matches the ask (for example, a local build attempt, or a specific Detox/EAS profile) instead of assuming the larger one.
