import type { Logger } from 'drizzle-orm';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';

export class DrizzleLogger implements Logger {
  constructor(private readonly logger: TLoggerPort) {}

  logQuery(query: string, params: unknown[]): void {
    this.logger.info({ query, params });
  }
}
