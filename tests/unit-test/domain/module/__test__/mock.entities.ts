/// <reference types="jest" />

import type { TModuleFieldEntity } from '@/domain/module/entity/module-field.entity';
import type { TModuleEntity } from '@/domain/module/entity/module.entity';
import { MODULE_FIELD_TYPE } from '@/domain/module/enum/module-field-type.enum';
import { MODULE_KEY } from '@/domain/module/enum/module-key.enum';

export const mockModuleFieldEntity = (
  overrides: Partial<TModuleFieldEntity> = {}
): TModuleFieldEntity => ({
  id: 1,
  uuid: 'mf-uuid-1',
  moduleId: 1,
  title: 'Field 1',
  description: undefined,
  type: MODULE_FIELD_TYPE.TEXT,
  values: undefined,
  required: false,
  ord: 0,
  status: true,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  deletedAt: undefined,
  ...overrides,
});

export const mockModuleEntity = (
  overrides: Partial<TModuleEntity> = {}
): TModuleEntity => ({
  id: 1,
  uuid: 'm-uuid-1',
  name: 'Catheterization',
  description: 'CIC module',
  key: MODULE_KEY.CIC,
  active: true,
  ord: 0,
  status: true,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  deletedAt: undefined,
  ...overrides,
});
