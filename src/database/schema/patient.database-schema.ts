import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { AUDIT_COLUMNS } from '@/database/schema/audit-columns';

export const PATIENT = sqliteTable(
  'patient',
  {
    ...AUDIT_COLUMNS(),

    name: text('name').notNull(),
    birthDate: integer('birth_date').notNull(),
    sex: text('sex').notNull(),
    autonomyLevel: text('autonomy_level').notNull(),
  },
  (table) => [
    index('patient__index__id').on(table.id),
    index('patient__index__status').on(table.status),
  ]
);
