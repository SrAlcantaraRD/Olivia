# Domain Unit Test Coverage Plan

## Executive Summary

This plan outlines the tasks required to achieve 100% unit test coverage for 65 files in the domain layer, specifically in the folders: hooks, use-case, enum, error, use-case-schema under src/domain/**/. The domain layer contains pure business logic following Clean Architecture principles.

## Categorized File List

### Core Module

#### Use-case
- consume-record-synchronization-qr.use-case.ts
- generate-record-synchronization-qr.use-case.ts
- get-app-locale.use-case.ts
- get-app-theme.use-case.ts
- set-app-locale.use-case.ts
- set-app-theme.use-case.ts
- wipe-local-data.use-case.ts

#### Enum
- entity-names.enum.ts
- error-code.enum.ts
- qr-key.enum.ts
- qr.enum.ts
- settings.enum.ts
- status.enum.ts
- time-range.enum.ts

#### Error
- cannot-parse-schema.error.ts
- database-default.error.ts
- entity-not-found-by.error.ts

#### Use-case-schema
- consume-record-synchronization-qr.use-case-schema.ts
- generate-record-synchronization-qr.use-case-schema.ts
- get-app-locale.use-case-schema.ts
- get-app-theme.use-case-schema.ts
- set-app-locale.use-case-schema.ts
- set-app-theme.use-case-schema.ts

### Carer Module

#### Error
- carer-create.errors.ts

#### Use-case-schema
- check-carer-existence.use-case-schema.ts
- create-carer.use-case-schema.ts
- delete-carer.use-case-schema.ts
- secondary-carer.consume-invitation-qr.use-case-schema.ts
- secondary-carer.generate-invitation-qr.use-case-schema.ts
- setup-parent.use-case-schema.ts
- sync-carer.use-case-schema.ts

#### Enum
- carer-type.enums.ts
- error-code.enum.ts

#### Use-case
- check-carer-existence.use-case.ts
- create-carer.use-case.ts
- delete-carer.use-case.ts
- secondary-carer.consume-invitation-qr.use-case.ts
- secondary-carer.generate-invitation-qr.use-case.ts
- setup-parent.use-case.ts
- sync-carer.use-case.ts

### Patient Module

#### Enum
- autonomy-level.enum.ts
- sex.enum.ts

### Module Module

#### Use-case
- add-demo-data.use-case.ts
- create-record.use-case.ts
- get-active-module-list.use-case.ts
- get-module-field-list.use-case.ts
- get-module-list-by-id-list.use-case.ts
- get-record-field-distribution.use-case.ts
- get-record-field-list.use-case.ts
- get-record-statistics.use-case.ts

#### Enum
- module-field-key.enum.ts
- module-field-type.enum.ts
- module-key.enum.ts

#### Use-case-schema
- add-demo-data.use-case-schema.ts
- get-active-module-list-by-id-list.use-case-schema.ts
- get-active-module-list.use-case-schema.ts
- get-module-field-list.use-case-schema.ts
- get-record-field-list.use-case-schema.ts

### Summary Module

#### Use-case-schema
- get-summary-module-detail-by-period.use-case-schema.ts
- get-summary-module-list-by-period.use-case-schema.ts
- refresh-summary-module-detail.use-case-schema.ts

#### Enum
- summary-detail-type.enum.ts
- summary-period.enum.ts

#### Use-case
- get-summary-module-detail-by-period.use-case.ts
- get-summary-module-list-by-period.use-case.ts

## Tasks

Each task is to create comprehensive unit tests for the specified file, ensuring 100% statement, branch, and function coverage. Include tests for valid inputs, invalid inputs, edge cases, and error handling where applicable.

### Core Module Tasks
- Write unit tests for consume-record-synchronization-qr.use-case.ts
- Write unit tests for generate-record-synchronization-qr.use-case.ts
- Write unit tests for get-app-locale.use-case.ts
- Write unit tests for get-app-theme.use-case.ts
- Write unit tests for set-app-locale.use-case.ts
- Write unit tests for set-app-theme.use-case.ts
- Write unit tests for wipe-local-data.use-case.ts
- Write unit tests for entity-names.enum.ts
- Write unit tests for error-code.enum.ts
- Write unit tests for qr-key.enum.ts
- Write unit tests for qr.enum.ts
- Write unit tests for settings.enum.ts
- Write unit tests for status.enum.ts
- Write unit tests for time-range.enum.ts
- Write unit tests for cannot-parse-schema.error.ts
- Write unit tests for database-default.error.ts
- Write unit tests for entity-not-found-by.error.ts
- Write unit tests for consume-record-synchronization-qr.use-case-schema.ts
- Write unit tests for generate-record-synchronization-qr.use-case-schema.ts
- Write unit tests for get-app-locale.use-case-schema.ts
- Write unit tests for get-app-theme.use-case-schema.ts
- Write unit tests for set-app-locale.use-case-schema.ts
- Write unit tests for set-app-theme.use-case-schema.ts

### Carer Module Tasks
- Write unit tests for carer-create.errors.ts
- Write unit tests for check-carer-existence.use-case-schema.ts
- Write unit tests for create-carer.use-case-schema.ts
- Write unit tests for delete-carer.use-case-schema.ts
- Write unit tests for secondary-carer.consume-invitation-qr.use-case-schema.ts
- Write unit tests for secondary-carer.generate-invitation-qr.use-case-schema.ts
- Write unit tests for setup-parent.use-case-schema.ts
- Write unit tests for sync-carer.use-case-schema.ts
- Write unit tests for carer-type.enums.ts
- Write unit tests for error-code.enum.ts
- Write unit tests for check-carer-existence.use-case.ts
- Write unit tests for create-carer.use-case.ts
- Write unit tests for delete-carer.use-case.ts
- Write unit tests for secondary-carer.consume-invitation-qr.use-case.ts
- Write unit tests for secondary-carer.generate-invitation-qr.use-case.ts
- Write unit tests for setup-parent.use-case.ts
- Write unit tests for sync-carer.use-case.ts

### Patient Module Tasks
- Write unit tests for autonomy-level.enum.ts
- Write unit tests for sex.enum.ts

### Module Module Tasks
- Write unit tests for add-demo-data.use-case.ts
- Write unit tests for create-record.use-case.ts
- Write unit tests for get-active-module-list.use-case.ts
- Write unit tests for get-module-field-list.use-case.ts
- Write unit tests for get-module-list-by-id-list.use-case.ts
- Write unit tests for get-record-field-distribution.use-case.ts
- Write unit tests for get-record-field-list.use-case.ts
- Write unit tests for get-record-statistics.use-case.ts
- Write unit tests for module-field-key.enum.ts
- Write unit tests for module-field-type.enum.ts
- Write unit tests for module-key.enum.ts
- Write unit tests for add-demo-data.use-case-schema.ts
- Write unit tests for get-active-module-list-by-id-list.use-case-schema.ts
- Write unit tests for get-active-module-list.use-case-schema.ts
- Write unit tests for get-module-field-list.use-case-schema.ts
- Write unit tests for get-record-field-list.use-case-schema.ts

### Summary Module Tasks
- Write unit tests for get-summary-module-detail-by-period.use-case-schema.ts
- Write unit tests for get-summary-module-list-by-period.use-case-schema.ts
- Write unit tests for refresh-summary-module-detail.use-case-schema.ts
- Write unit tests for summary-detail-type.enum.ts
- Write unit tests for summary-period.enum.ts
- Write unit tests for get-summary-module-detail-by-period.use-case.ts
- Write unit tests for get-summary-module-list-by-period.use-case.ts
- Mock all external dependencies such as ports, adapters, and database interactions using Jest mocks.
- Use spies for functions to verify calls and returns.
- For schemas (use-case-schema), test validation with both valid and invalid Zod inputs, including edge cases like empty objects, null values, and type mismatches.
- For enums, test that the exported constants match expected values and that all defined values are present.
- For errors, test error instantiation, properties, and any custom methods.
- For use-cases, test the execute method with various input scenarios, mocking dependencies, and asserting outputs and side effects.
- Ensure tests are isolated and do not rely on external state.
- Use descriptive test names and organize tests with describe/it blocks.
- Run tests with `pnpm test` and generate coverage reports with `pnpm test --coverage`.
- Follow the project's TypeScript strict mode and linting rules (biome).
- **NEW**: Import all mocks from the central `@/tests/mocks` index to avoid repetition.
- **NEW**: Use the provided templates in `tests/unit-test/domain/` for consistency:
  - `template.use-case.spec.ts` for use case tests
  - `template.use-case-schema.spec.ts` for schema validation tests
  - `template.enum.spec.ts` for enum tests
  - `template.error.spec.ts` for error class tests

## Success Metrics

- Achieve 100% line coverage for each individual file as reported by Jest coverage.
- Achieve 100% branch coverage for conditional logic.
- Achieve 100% function coverage for all exported and internal functions.
- All tests pass without failures.
- No introduction of regressions; existing functionality remains intact.
- Coverage reports are generated and reviewed for any uncovered lines, with justifications or additional tests added as needed.
- Total project coverage for the domain layer reaches 100% upon completion of all tasks.
