import { relations } from 'drizzle-orm';
import {
  foreignKey,
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from 'drizzle-orm/sqlite-core';

import { AUDIT_COLUMNS } from '@/database/schema/audit-columns';
import { CARER } from '@/database/schema/carer.database-schema';
import { MODULE, MODULE_FIELD } from '@/database/schema/module.database-schema';

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
    carerID: integer('carer_id')
      .notNull()
      .references(() => CARER.id, {
        onDelete: 'restrict',
        onUpdate: 'restrict',
      }),
    synced: integer('synced').notNull().default(0),
  },
  (table) => [
    index('record__index__id').on(table.id),
    index('record__index__status').on(table.status),
    index('record__index__module_id').on(table.moduleID),
    index('record__index__carer_id').on(table.carerID),
    index('record__index__synced').on(table.synced),
    index('record__index__created_at').on(table.createdAt),
    unique('record__unique__module_id__created_at').on(
      table.moduleID,
      table.createdAt
    ),
    foreignKey({
      name: 'record__fk__module__id',
      columns: [table.moduleID],
      foreignColumns: [MODULE.id],
    })
      .onDelete('restrict')
      .onUpdate('restrict'),
    foreignKey({
      name: 'record__fk__carer__id',
      columns: [table.carerID],
      foreignColumns: [CARER.id],
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
    index('record_field__index__created_at').on(table.createdAt),
    unique('record_field__unique__record_id__field_id').on(
      table.recordID,
      table.fieldID
    ),
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

export const RECORD_RELATIONS = relations(RECORD, ({ one, many }) => ({
  carer: one(CARER, {
    fields: [RECORD.carerID],
    references: [CARER.id],
  }),
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
