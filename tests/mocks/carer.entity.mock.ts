/// <reference types="jest" />

import type { TCarer, TCarerCreate } from '@/domain/carer/entity/carer.entity';
import { CARER_TYPE_ENUM } from '@/domain/carer/enum/carer-type.enums';

export function mockCarer(overrides?: Partial<TCarer>): TCarer {
  return {
    id: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    name: 'Test Carer',
    type: CARER_TYPE_ENUM.ADMIN,
    isPrimary: true,
    pinHash: 'hashed-pin',
    status: 1,
    ...overrides,
  } satisfies TCarer;
}

export function mockCarerCreate(
  overrides?: Partial<TCarerCreate>
): TCarerCreate {
  return {
    name: 'Test Carer',
    type: CARER_TYPE_ENUM.ADMIN,
    isPrimary: true,
    pinHash: 'hashed-pin',
    ...overrides,
  } satisfies TCarerCreate;
}

export function mockSecondaryCarer(overrides?: Partial<TCarer>): TCarer {
  return mockCarer({
    id: 'secondary-carer-id',
    name: 'Secondary Carer',
    type: CARER_TYPE_ENUM.SECONDARY,
    isPrimary: false,
    ...overrides,
  });
}

// Legacy exports for backward compatibility
export const mockCarerEntity = mockCarer;
export const mockCarerCreateLegacy = mockCarerCreate;
