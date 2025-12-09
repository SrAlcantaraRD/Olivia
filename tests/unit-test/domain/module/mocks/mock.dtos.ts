/// <reference types="jest" />

import type { TModuleFieldCreateDTO } from '@/domain/module/dto/module-field.dto';
import type { TModuleCreateDTO } from '@/domain/module/dto/module.dto';
import { MODULE_FIELD_TYPE_ENUM } from '@/domain/module/enum/module-field-type.enum';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';

export const mockModuleFieldCreateDTO = (
  overrides: Partial<TModuleFieldCreateDTO> = {}
): TModuleFieldCreateDTO => ({
  moduleId: 1,
  title: 'Field 1',
  description: undefined,
  type: MODULE_FIELD_TYPE_ENUM.TEXT,
  values: undefined,
  required: false,
  ord: 0,
  ...overrides,
});

export const mockModuleCreateDTO = (
  overrides: Partial<TModuleCreateDTO> = {}
): TModuleCreateDTO => ({
  name: 'Catheterization',
  description: 'CIC module',
  key: MODULE_KEY_ENUM.CIC,
  isActive: true,
  ord: 0,
  fieldList: undefined,
  ...overrides,
});
