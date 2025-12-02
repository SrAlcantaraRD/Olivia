/// <reference types="jest" />

import type { TCarerEntity } from '@/domain/carer/entity/carer.entity';
import { CARER_TYPE } from '@/domain/carer/enum/carer-type.enums';

export const mockCarerEntity = (
  overrides: Partial<TCarerEntity> = {}
): TCarerEntity => ({
  id: 1,
  uuid: 'carer-uuid-123',
  name: 'John Doe',
  type: CARER_TYPE.ADMIN,
  isPrimary: true,
  pinHash: undefined,
  status: true,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  deletedAt: undefined,
  ...overrides,
});
