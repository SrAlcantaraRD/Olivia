/// <reference types="jest" />

import type { TCarerCreateDTO } from '@/domain/carer/dto/carer.dto';
import { CARER_TYPE } from '@/domain/carer/enum/carer-type.enums';

export const mockCarerCreateDTO = (
  overrides: Partial<TCarerCreateDTO> = {}
): TCarerCreateDTO => ({
  name: 'John Doe',
  type: CARER_TYPE.SECONDARY,
  isPrimary: true,
  pinHash: undefined,
  ...overrides,
});
