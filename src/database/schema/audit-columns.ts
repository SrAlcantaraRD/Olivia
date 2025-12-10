import { sql } from 'drizzle-orm';
import { int, integer } from 'drizzle-orm/sqlite-core';

export function AUDIT_COLUMNS() {
  return {
    id: integer('id').primaryKey(),
    status: int('status').default(1).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`) // Función nativa de SQLite (segundos)
      .notNull(),
  };
}
