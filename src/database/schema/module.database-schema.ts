import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { AUDIT_COLUMNS } from '@/database/schema/audit-columns';

export const MODULE = sqliteTable('module', {
  ...AUDIT_COLUMNS(),

  name: text('name').notNull(),
  description: text('description'),
  key: text('key'),
  active: integer('active').notNull().default(0),
  ord: integer('ord').notNull().default(0),
});

export const MODULE_FIELD = sqliteTable('module_field', {
  ...AUDIT_COLUMNS(),

  moduleID: integer('module_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').notNull(),
  values: text('values'),
  required: integer('required').notNull().default(0),
  ord: integer('ord').notNull().default(0),
});

// Relations: MODULE -> MODULE_FIELD (1:N)
export const MODULE_RELATIONS = relations(MODULE, ({ many }) => ({
  fields: many(MODULE_FIELD),
}));

export const MODULE_FIELD_RELATIONS = relations(MODULE_FIELD, ({ one }) => ({
  module: one(MODULE, {
    fields: [MODULE_FIELD.moduleID],
    references: [MODULE.id],
  }),
}));
