---
applyTo: "**/*.integration.spec.ts,**/integration/**/*.spec.ts"
description: "Integration test patterns with real database, optional Kafka mocking, and vertical slice validation"
---

# Integration Test Instructions

## Purpose
Test full vertical slices with real adapters (database, Kafka optionally mocked) to validate end-to-end behavior including persistence, transactions, and external service interactions.

## Location
- Feature integration tests: `apps/backend/api/elysiajs/app/src/__tests__/integration/<feature>.integration.spec.ts`
- Database integration tests: `libs/database/<context>/src/__tests__/integration/<adapter>.integration.spec.ts`
- Use case integration tests: `libs/domain/<context>/src/__tests__/integration/<use-case>.integration.spec.ts`

## Naming Conventions
- File: `<feature>.integration.spec.ts`
- Top-level describe: `[Integration] - <Feature>`
- Test name: Should describe the full scenario being validated

## Environment Setup

### Required Environment Variables
```typescript
// Set in test setup or before running
process.env.TPS_INTEGRATION_TESTS = 'true'; // Flag to enable integration test mode
process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/nakire_tps_test';
process.env.KAFKA_BROKER = 'localhost:9092'; // Optional: use test Kafka or mock
```

### Database Setup Pattern
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as schema from '../schemas'; // Import all schemas

let db: ReturnType<typeof drizzle>;
let pool: Pool;

# Integration Tests — Consolidated

This artifact has been consolidated into the canonical architecture guide.

See: `docs/architecture/condensed-copilot-guide.md` — section "Testing: Integration Tests" for the canonical patterns, env setup, DB migration flow, and example skeletons.

Original content archived at: `.github/artifacts/archive/4.testing__integration-test.instructions.md`

If you need the original full text, open the archive file above or check Git history.
