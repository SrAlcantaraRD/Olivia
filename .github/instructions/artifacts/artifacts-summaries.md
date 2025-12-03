# Artifacts Summaries (Option B: 3–5 line summaries)

This file contains short, focused summaries (3–5 lines) for each artifact under `.github/artifacts/`, intended for quick reading by developers and AI assistants.

---

## README.md
Top-level index and entrypoint for the artifacts folder. Contains a table of contents, quick-start guide, architecture overview, and recommended reading order for AI assistants. Use this first to locate the right artifact for a task.

---

## 0.project-overview/tech-stack.md
Full technology inventory and version snapshot (December 2025). Documents core scripts, development workflow, and key rules (pnpm, Biome, Husky). Reference this to confirm dependency versions and environment setup.

---

## 1.domain/1.entity.instructions.md
Describes domain entity conventions using Zod schemas and the `BaseEntitySchema` pattern. Explains required fields (id, uuid, status, timestamps) and validation rules. Reference when adding or updating domain entities.

---

## 1.domain/2.dto.instructions.md
Defines DTO generation patterns and helpers to keep domain entities decoupled from transport shapes. Shows `GenerateDTOSchema` usage and mapping best practices. Use for API payload or adapter boundaries.

---

## 1.domain/3.mapper.instructions.md
Mapper patterns between entities and DTOs, with the `TBaseMapper` interface and examples. Explains where mapping logic belongs (domain mappers, not adapters). Consult when adding transforms.

---

## 1.domain/4.port.instructions.md
Rules for creating minimal, cohesive port interfaces (`I<Entity>Port`). Ports must return domain entities and contain no infrastructure details. Use when adding new external capabilities.

---

## 1.domain/5.use-case.instructions.md
Structure and responsibilities of use-cases (business logic orchestration). Guidance on error handling, input validation, and port usage. Read before implementing domain behavior.

---

## 1.domain/6.use-case-schema.instructions.md
Zod schema recommendations for validating use-case inputs and outputs. Shows patterns for reusing entity schemas and shaping responses. Useful for robust use-case validation.

---

## 1.domain/6.use-case-spec.instructions.md
Behavior-driven specification templates for use-cases, including examples and expected flows. Use to write clear, testable use-case specs.

---

## 1.domain/7.error.instructions.md
Domain error design: `BaseError`, typed `IErrorDetails`, and guidance on translating adapter/DB errors to domain errors. Reference when adding new error types.

---

## 1.domain/8.hook.instructions.md
Patterns for React hooks that wrap use-cases: state management, caching, adapter injection via `useAdapters`, and user feedback via notify adapters. Use when building UI-facing hooks.

---

## 1.domain/9.enum.instructions.md
Enum conventions and helper mappers (e.g., status, sex, autonomy level). Explains documented helpers to convert DB values to typed enums. Consult when adding new enums or helper mappers.

---

## 2.database/1.schema.instructions.md
Drizzle schema conventions, naming (snake_case), and migration guidance. Covers soft-delete patterns and column naming best practices. Use when modifying DB schema or creating migrations.

---

## 2.database/2.adapter.instructions.md
Adapter implementation template and rules (static `toDomainEntity`, soft-delete filtering, transactions). Originally PostgreSQL-focused but applicable to SQLite with Drizzle. Use as canonical adapter blueprint.

---

## 2.database/3.adapter-test.instructions.md
Testing strategies for adapters: unit tests for `toDomainEntity`, query expectations, and mock setups. Use to create robust adapter tests and validate SQL mappings.

---

## 3.adapters/0.adapter-pattern.instructions.md
Hexagonal architecture guide for Ports & Adapters, including `useAdapters` factory example, adapter naming conventions, and examples (SQLite adapters, `ToastUINotifyPortAdapter`). High-value for architectural consistency.

---

## 4.heroui/0.core-native.instructions.md
Mobile-specific guide for `heroui-native`: wrapper atom requirement (never import heroui directly in screens), `useThemeColor`, compound components, and accessibility rules. Use when building mobile UI atoms and ensuring a11y.

---

## 4.heroui/0.core.instructions.md
Legacy web-focused heroui core documentation retained for reference. Not the primary source for mobile code — consult only if working on web targets or cross-referencing web patterns.

---

## 4.heroui/1.hook-port-adapter.instructions.md
Guidance on how hooks orchestrate ports and adapters in the UI layer. Includes examples of adapter injection and data flow from hooks to screens.

---

## 4.heroui/2.page.instructions.md
Page-level composition patterns: SafeAreaView, ScrollView usage, layout and spacing rules, and example screen structure. Use as a reference when composing new screens.

---

## 4.testing/integration-test.instructions.md
Integration test patterns and Jest/RTL setup, including recommended mocks for Expo modules (fonts, splash-screen, haptics) and coverage expectations. Helpful for setting up reliable tests.

---

## 5.ui-components/0.toast-system.instructions.md
Complete toast system docs: BaseToast component, AuraSVG radial gradient technique, DRY variants, `ToastUINotifyPortAdapter` implementation and i18n integration. Read when changing notifications or toast visuals.

---

## 5.ui-components/1.atomic-design.instructions.md
Atomic Design implementation for the app: atoms/molecules/organisms/particles, typography atoms, wrapper patterns for heroui-native, naming conventions and anti-patterns. Primary resource for UI component design.

---

## 6.i18n/0.internationalization.instructions.md
i18next setup and `Ti18nKeys` type-safety guidance. Contains `TextTranslation` component, `useAppTranslation` hook, workflow for adding keys and test-mocking strategies. Use when adding or changing translations.

---


---

Progress update: I created an artifacts manifest and a medium-length summary file (3–5 lines per artifact). Next I'll mark the todo items done and finish verification.
