/// <reference types="jest" />

import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import type { TModule } from '@/domain/module/entity/module.entity';
import { MODULE_FIELD_TYPE_ENUM } from '@/domain/module/enum/module-field-type.enum';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';

export const mockModuleFieldEntity = (
  overrides: Partial<TModuleField> = {}
): TModuleField => ({
  id: 1,
  moduleId: 1,
  title: 'Field 1',
  type: MODULE_FIELD_TYPE_ENUM.TEXT,
  required: false,
  description: 'mock-description',
  values: '',
  order: 1,
  status: 1,
  ...overrides,
});

export const mockModuleEntity = (
  overrides: Partial<TModule> = {}
): TModule => ({
  id: 1,
  name: 'Catheterization',
  description: 'CIC module',
  isActive: true,
  code: MODULE_KEY_ENUM.CIC,
  status: 1,
  ...overrides,
});
