---
applyTo: '**/*.integration.spec.ts,**/**/integration/**/*.spec.ts'
description: "Integration test patterns with real database, optional Kafka mocking, and vertical slice validation"
---

# Integration Test Instructions

## Purpose
Test full vertical slices with real adapters (database, Kafka optional) to validate end-to-end behavior including persistence, transactions, external interactions.

## Rules
- Location: Feature in app/src/__tests__/integration/<feature>.integration.spec.ts, DB in libs/database/src/__tests__/integration/<adapter>.integration.spec.ts, Use case in libs/domain/src/__tests__/integration/<use-case>.integration.spec.ts.
- Naming: [Integration] - <Feature>, describe scenario.
- Environment: Set TPS_INTEGRATION_TESTS=true, DATABASE_URL for test DB.
- Database setup: Use drizzle, migrate, Pool for test DB.
- Required cases: Happy path, negative paths, error handling.
- Assertions: Validate persistence, transactions, external calls.
- Quality gates: Real adapters, optional Kafka mock, Codacy scan.
