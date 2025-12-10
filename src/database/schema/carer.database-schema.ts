import { relations } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { AUDIT_COLUMNS } from '@/database/schema/audit-columns';
import { RECORD } from '@/database/schema/record.database-schema';

export const CARER = sqliteTable(
  'carer',
  {
    ...AUDIT_COLUMNS(),

    name: text('name').notNull(),
    type: text('type').notNull(),
    isPrimary: integer('is_primary').notNull().default(0),
    pinHash: text('pin_hash').notNull(),
  },
  (table) => [
    index('carer__index__id').on(table.id),
    index('carer__index__status').on(table.status),
    index('carer__index__is_primary').on(table.isPrimary),
  ]
);

export const CARER_RELATIONS = relations(CARER, ({ many }) => ({
  recordList: many(RECORD),
}));
