# Test Mocks System

This directory contains all the mock utilities for unit testing the Oliva App domain layer.

## Overview

To avoid code repetition and maintain consistency across tests, all mocks are centralized and exported through the main index file.

## Usage

Instead of importing from individual mock files:

```typescript
// ❌ OLD WAY - Multiple imports
import { mockCachePort, mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockRecordCreate, mockRecordEntity } from '@/tests/mocks/module-field.entity.mock';
import { mockRecordFieldPort, mockRecordPort } from '@/tests/mocks/module-field.port.mock';
```

Use the centralized import:

```typescript
// ✅ NEW WAY - Single import
import {
  mockCachePort,
  mockLoggerPort,
  mockRecordCreate,
  mockRecordEntity,
  mockRecordFieldPort,
  mockRecordPort,
} from '@/tests/mocks';
```

## Available Mocks

### Core Ports
- `mockCachePort()` - Cache/secure store operations
- `mockLoggerPort()` - Logging operations
- `mockNotifyPort()` - Notification operations
- `mockNavigationPort()` - Navigation operations

### Entities
- `mockCarerEntity()` - Carer entity with defaults
- `mockPatientEntity()` - Patient entity with defaults
- `mockModuleEntity()` - Module entity with defaults
- `mockRecordEntity()` - Record entity with defaults
- `mockRecordFieldEntity()` - Record field entity with defaults

### DTOs
- `mockCarerCreate()` - Carer creation DTO
- `mockPatientCreate()` - Patient creation DTO
- `mockRecordCreate()` - Record creation DTO
- `mockRecordFieldCreate()` - Record field creation DTO

### Ports
- `mockCarerPort()` - Carer repository operations
- `mockPatientPort()` - Patient repository operations
- `mockModulePort()` - Module repository operations
- `mockModuleFieldPort()` - Module field repository operations
- `mockRecordPort()` - Record repository operations
- `mockRecordFieldPort()` - Record field repository operations

## Mock Pattern

All mocks follow a consistent pattern:

```typescript
export function mockXxxPort(
  overrides?: Partial<Record<keyof IXxxPort, jest.Mock>>
): jest.Mocked<IXxxPort> {
  return {
    method1: jest.fn(),
    method2: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<IXxxPort>;
}

export const mockXxxEntity = (
  overrides: Partial<TXxxEntity> = {}
): TXxxEntity => ({
  id: 1,
  name: 'Default Name',
  ...overrides,
}) satisfies TXxxEntity;
```

## Adding New Mocks

1. Create the mock file in the appropriate location
2. Export the mock functions
3. Add the export to `index.ts`
4. Update this README

## Test Templates

Use the templates in `tests/unit-test/domain/` for consistency:
- `template.use-case.spec.ts`
- `template.use-case-schema.spec.ts`
- `template.enum.spec.ts`
- `template.error.spec.ts`
