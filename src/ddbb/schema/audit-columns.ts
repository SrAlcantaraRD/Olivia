import { int, integer, text } from 'drizzle-orm/sqlite-core';

import { generateUUID } from '@/domain/core/schemas';

export function AUDIT_COLUMNS() {
  return {
    id: integer('id').primaryKey(),
    uuid: text('uuid')
      .notNull()
      .unique()
      .$defaultFn(() => generateUUID()),
    status: int('status').default(1).notNull(),
    createdAt: integer('created_at')
      .notNull()
      .$defaultFn(() => Date.now()),
    deletedAt: integer('deleted_at'),
  };
}
