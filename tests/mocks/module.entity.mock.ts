/// <reference types="jest" />

import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type {
  TModule,
  TModuleCreate,
} from '@/domain/module/entity/module.entity';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';

export function mockModule(overrides?: Partial<TModule>): TModule {
  return {
    id: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    name: 'Test Module',
    description: 'A test module for testing purposes',
    code: MODULE_KEY_ENUM.CIC,
    isActive: true,
    status: STATUS_ENUM.ACTIVE,
    ...overrides,
  } satisfies TModule;
}

export function mockModuleCreate(
  overrides?: Partial<TModuleCreate>
): TModuleCreate {
  return {
    name: 'Test Module',
    description: 'A test module for testing purposes',
    code: MODULE_KEY_ENUM.CIC,
    isActive: true,
    ...overrides,
  } satisfies TModuleCreate;
}

export function mockInactiveModule(overrides?: Partial<TModule>): TModule {
  return mockModule({
    id: 2,
    name: 'Inactive Module',
    isActive: false,
    status: STATUS_ENUM.INACTIVE,
    ...overrides,
  });
}

// Legacy exports for backward compatibility
export const mockModuleEntity = mockModule;
export const mockModuleCreateLegacy = mockModuleCreate;
