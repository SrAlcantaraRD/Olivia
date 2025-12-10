/// <reference types="jest" />

import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import type { TModule } from '@/domain/module/entity/module.entity';
import { MODULE_FIELD_TYPE_ENUM } from '@/domain/module/enum/module-field-type.enum';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';

export const mockModuleFieldEntity = (
  overrides: Partial<TModuleField> = {}
): TModuleField => ({
  id: 1,
  uuid: 'mf-uuid-1',
  moduleId: 1,
  title: 'Field 1',
  description: undefined,
  type: MODULE_FIELD_TYPE_ENUM.TEXT,
  values: undefined,
  required: false,
  ord: 0,
  status: true,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  deletedAt: undefined,
  ...overrides,
});

export const mockModuleEntity = (
  overrides: Partial<TModule> = {}
): TModule => ({
  id: 1,
  uuid: 'm-uuid-1',
  name: 'Catheterization',
  description: 'CIC module',
  key: MODULE_KEY_ENUM.CIC,
  isActive: true,
  ord: 0,
  status: true,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  deletedAt: undefined,
  ...overrides,
});
