/// <reference types="jest" />

import type { TCarer, TCarerCreate } from '@/domain/carer/entity/carer.entity';
import { CARER_TYPE_ENUM } from '@/domain/carer/enum/carer-type.enums';

export const mockCarerEntity = (overrides: Partial<TCarer> = {}): TCarer => ({
  id: 1,
  name: 'John Doe',
  type: CARER_TYPE_ENUM.ADMIN,
  isPrimary: true,
  pinHash: 'hashed-pin-123',
  status: 1,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  ...overrides,
});

export const mockCarerCreate = (
  overrides: Partial<TCarerCreate> = {}
): TCarerCreate => ({
  name: 'John Doe',
  type: CARER_TYPE_ENUM.SECONDARY,
  isPrimary: true,
  pinHash: 'hashed-pin-123',
  ...overrides,
});
