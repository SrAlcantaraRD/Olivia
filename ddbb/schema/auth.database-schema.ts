import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { AUDIT_COLUMNS } from '@/ddbb/schema/audit-columns';

export const AUTH = sqliteTable('auth', {
  ...AUDIT_COLUMNS(),

  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  stage: text('stage').notNull(),
});

export const TASK = sqliteTable('task', {
  ...AUDIT_COLUMNS(),

  title: text('title').notNull().unique(),
  description: text('description').notNull(),
});
