import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { AUDIT_COLUMNS } from '@/database/schema/audit-columns';

export const PATIENT = sqliteTable('patient', {
  ...AUDIT_COLUMNS(),

  name: text('name').notNull(),
  birthDate: integer('birth_date').notNull(),
  sex: text('sex').notNull(),
  autonomyLevel: text('autonomy_level').notNull(),
});
