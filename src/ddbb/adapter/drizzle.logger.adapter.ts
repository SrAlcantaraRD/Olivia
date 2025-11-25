import type { Logger } from 'drizzle-orm';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';

// Tipo flexible que acepta tanto el logger base como el extendido
type LoggerLike = Pick<TLoggerPort, 'info'>;

export class DrizzleLogger implements Logger {
  constructor(private readonly logger: LoggerLike) {}

  logQuery(query: string, params: unknown[]): void {
    this.logger.info({ query, params });
  }
}
