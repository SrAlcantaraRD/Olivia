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
import { RECORD, RECORD_FIELD } from '@/database/schema/record.database-schema';

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
    unique('module__unique__code').on(table.code),
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
    code: text('code').notNull(),
    type: text('type').notNull(),
    values: text('values').notNull(),
    required: integer('required').notNull().default(0),
    order: integer('order').notNull().default(0),
  },
  (table) => [
    index('module_field__index__id').on(table.id),
    index('module_field__index__status').on(table.status),
    index('module_field__index__module_id').on(table.moduleID),
    index('module_field__index__type').on(table.type),
    unique('module_field__unique__module_id__title').on(
      table.moduleID,
      table.code
    ),
    foreignKey({
      name: 'module_field__fk__module__id',
      columns: [table.moduleID],
      foreignColumns: [MODULE.id],
    })
      .onDelete('restrict')
      .onUpdate('restrict'),
  ]
);

// Relations: MODULE -> MODULE_FIELD (1:N)
export const MODULE_RELATIONS = relations(MODULE, ({ many }) => ({
  moduleFieldList: many(MODULE_FIELD),
  recordFieldList: many(RECORD),
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
