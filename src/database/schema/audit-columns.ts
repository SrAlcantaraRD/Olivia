import { int, integer } from 'drizzle-orm/sqlite-core';

export function AUDIT_COLUMNS() {
  return {
    id: integer('id').primaryKey(),
    status: int('status').default(1).notNull(),
  };
}
