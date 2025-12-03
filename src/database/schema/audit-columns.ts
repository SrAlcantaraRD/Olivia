import { int, integer, text } from 'drizzle-orm/sqlite-core';

import { generateUUID } from '@/domain/core/schemas/uuid.schema';

export function AUDIT_COLUMNS() {
  return {
    id: integer('id').primaryKey(),
    uuid: text('uuid')
      .notNull()
      .unique()
      .$defaultFn(() => generateUUID()),
    status: int('status').default(1).notNull(),

    createdAt: text('created_at')
      .notNull()
      .$defaultFn(() => Date.now().toString()),
    updatedAt: text('updated_at'),
    deletedAt: text('deleted_at'),
  };
}
