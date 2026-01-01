/// <reference types="jest" />

import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type { TModuleField } from '@/domain/module/entity/module-field.entity';
import type { TModule } from '@/domain/module/entity/module.entity';
import type {
  TRecordField,
  TRecordFieldCreate,
} from '@/domain/module/entity/record-field.entity';
import type {
  TRecord,
  TRecordCreate,
} from '@/domain/module/entity/record.entity';
import { MODULE_FIELD_TYPE_ENUM } from '@/domain/module/enum/module-field-type.enum';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';

export const mockModuleFieldEntity = (
  overrides: Partial<TModuleField> = {}
): TModuleField =>
  ({
    id: 1,
    moduleId: 1,
    title: 'Field 1',
    type: MODULE_FIELD_TYPE_ENUM.TEXT,
    required: false,
    description: 'mock-description',
    values: '',
    order: 1,
    status: 1,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  }) satisfies TModuleField;

export const mockModuleEntity = (overrides: Partial<TModule> = {}): TModule =>
  ({
    id: 1,
    name: 'Catheterization',
    description: 'CIC module',
    isActive: true,
    code: MODULE_KEY_ENUM.CIC,
    status: STATUS_ENUM.ACTIVE,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  }) satisfies TModule;

export const mockRecordEntity = (overrides: Partial<TRecord> = {}) =>
  ({
    id: 1,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    status: STATUS_ENUM.ACTIVE,
    carerID: 1,
    moduleID: 1,
    data: '{"field1":"value1","field2":"value2"}',
    synchronized: false,
    ...overrides,
  }) satisfies TRecord;

export const mockRecordFieldEntity = (
  overrides: Partial<TRecordField> = {}
): TRecordField =>
  ({
    id: 1,
    recordID: 1,
    fieldID: 1,
    value: 'Sample Value',
    status: STATUS_ENUM.ACTIVE,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  }) satisfies TRecordField;

export const mockRecordCreate = (
  overrides: Partial<TRecordCreate> = {}
): TRecordCreate =>
  ({
    carerID: 1,
    data: '{"field1":"value1","field2":"value2"}',
    moduleID: 1,
    synchronized: false,
    fieldList: [],
    createdAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  }) satisfies TRecordCreate;

export const mockRecordFieldCreate = (
  overrides: Partial<TRecordFieldCreate> = {}
): TRecordFieldCreate =>
  ({
    fieldID: 1,
    value: 'Sample Value',
    ...overrides,
  }) satisfies TRecordFieldCreate;
