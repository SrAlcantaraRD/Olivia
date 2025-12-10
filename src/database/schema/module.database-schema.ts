import { relations } from 'drizzle-orm';
import {
  foreignKey,
  index,
  integer,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

import { AUDIT_COLUMNS } from '@/database/schema/audit-columns';

export const MODULE = sqliteTable(
  'module',
  {
    ...AUDIT_COLUMNS(),

    code: text('code').notNull().unique(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    active: integer('active').notNull().default(0),
  },
  (table) => [
    index('module__index__id').on(table.id),
    index('module__index__status').on(table.status),
    index('module__index__code').on(table.code),
    index('module__index__active').on(table.active),
  ]
);

export const MODULE_FIELD = sqliteTable(
  'module_field',
  {
    ...AUDIT_COLUMNS(),

    moduleID: integer('module_id')
      .notNull()
      .references(() => MODULE.id, {
        onDelete: 'restrict',
        onUpdate: 'restrict',
      }),
    title: text('title').notNull(),
    description: text('description'),
    type: text('type').notNull(),
    values: text('values'),
    required: integer('required').notNull().default(0),
    order: integer('order').notNull().default(0),
  },
  (table) => [
    index('module_field__index__id').on(table.id),
    index('module_field__index__status').on(table.status),
    index('module_field__index__module_id').on(table.moduleID),
    index('module_field__index__type').on(table.type),
    foreignKey({
      name: 'module_field__fk__module__id',
      columns: [table.moduleID],
      foreignColumns: [MODULE.id],
    })
      .onDelete('restrict')
      .onUpdate('restrict'),
  ]
);

export const RECORD = sqliteTable(
  'record',
  {
    ...AUDIT_COLUMNS(),

    moduleID: integer('module_id')
      .notNull()
      .references(() => MODULE.id, {
        onDelete: 'restrict',
        onUpdate: 'restrict',
      }),
    data: text('data').notNull(),
    synced: integer('synced').notNull().default(0),
  },
  (table) => [
    index('record__index__id').on(table.id),
    index('record__index__status').on(table.status),
    index('record__index__module_id').on(table.moduleID),
    index('record__index__synced').on(table.synced),
    foreignKey({
      name: 'record__fk__module__id',
      columns: [table.moduleID],
      foreignColumns: [MODULE.id],
    })
      .onDelete('restrict')
      .onUpdate('restrict'),
  ]
);

export const RECORD_FIELD = sqliteTable(
  'record_field',
  {
    ...AUDIT_COLUMNS(),

    recordID: integer('record_id')
      .notNull()
      .references(() => RECORD.id, {
        onDelete: 'restrict',
        onUpdate: 'restrict',
      }),
    fieldID: integer('field_id')
      .notNull()
      .references(() => MODULE_FIELD.id, {
        onDelete: 'restrict',
        onUpdate: 'restrict',
      }),
    value: text('value').notNull(),
  },
  (table) => [
    index('record_field__index__id').on(table.id),
    index('record_field__index__status').on(table.status),
    index('record_field__index__record_id').on(table.recordID),
    index('record_field__index__field_id').on(table.fieldID),
    foreignKey({
      name: 'record_field__fk__record__id',
      columns: [table.recordID],
      foreignColumns: [RECORD.id],
    })
      .onDelete('restrict')
      .onUpdate('restrict'),
    foreignKey({
      name: 'record_field__fk__module_field__id',
      columns: [table.fieldID],
      foreignColumns: [MODULE_FIELD.id],
    })
      .onDelete('restrict')
      .onUpdate('restrict'),
  ]
);

// Relations: MODULE -> MODULE_FIELD (1:N)
export const MODULE_RELATIONS = relations(MODULE, ({ many }) => ({
  fieldList: many(MODULE_FIELD),
  recordList: many(RECORD),
}));

export const MODULE_FIELD_RELATIONS = relations(
  MODULE_FIELD,
  ({ one, many }) => ({
    module: one(MODULE, {
      fields: [MODULE_FIELD.moduleID],
      references: [MODULE.id],
    }),
    recordFieldList: many(RECORD_FIELD),
  })
);

export const RECORD_RELATIONS = relations(RECORD, ({ one, many }) => ({
  module: one(MODULE, {
    fields: [RECORD.moduleID],
    references: [MODULE.id],
  }),
  recordFieldList: many(RECORD_FIELD),
}));

export const RECORD_FIELD_RELATIONS = relations(RECORD_FIELD, ({ one }) => ({
  record: one(RECORD, {
    fields: [RECORD_FIELD.recordID],
    references: [RECORD.id],
  }),
  moduleField: one(MODULE_FIELD, {
    fields: [RECORD_FIELD.fieldID],
    references: [MODULE_FIELD.id],
  }),
}));
