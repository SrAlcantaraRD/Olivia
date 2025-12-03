---
applyTo: "**/*.integration.spec.ts,**/integration/**/*.spec.ts"
description: "Integration test instructions (copied from existing artifact)."
---
````instructions
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

... (content consolidated; archived for full details)

````
