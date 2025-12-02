import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { AUDIT_COLUMNS } from '@/database/schema/audit-columns';

export const CARER = sqliteTable('carer', {
  ...AUDIT_COLUMNS(),

  name: text('name').notNull(),
  type: text('type').notNull(),
  isPrimary: integer('is_primary').notNull().default(0),
  pinHash: text('pin_hash').notNull(),
});

export const CARER_RELATIONS = relations(CARER, ({ many }) => ({}));
