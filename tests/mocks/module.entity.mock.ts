/// <reference types="jest" />

import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type {
  TModule,
  TModuleCreate,
} from '@/domain/module/entity/module.entity';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';

export const mockModuleEntity = (
  overrides: Partial<TModule> = {}
): TModule => ({
  id: 1,
  name: 'Test Module',
  description: 'A test module',
  code: MODULE_KEY_ENUM.CIC,
  isActive: true,
  status: STATUS_ENUM.ACTIVE,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  ...overrides,
});

export const mockModuleCreate = (
  overrides: Partial<TModuleCreate> = {}
): TModuleCreate => ({
  name: 'Test Module',
  description: 'A test module',
  code: MODULE_KEY_ENUM.CIC,
  isActive: true,
  ...overrides,
});
