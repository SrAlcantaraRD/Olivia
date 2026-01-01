import type { Logger } from 'drizzle-orm';

import {
  BASE_LOGGER,
  type TLoggerPort,
} from '@/domain/core/adapter/logger.adapter';
import { ENVIRONMENT_VARIABLES } from '@/domain/core/constant/environment-variables.constants';

export class DrizzleLogger implements Logger {
  private readonly logger: TLoggerPort;
  private readonly logLevel =
    ENVIRONMENT_VARIABLES.LOG_LEVEL_POSTGRESQL.toLowerCase();

  constructor(entityName: string) {
    BASE_LOGGER.setSeverity(ENVIRONMENT_VARIABLES.LOG_LEVEL_POSTGRESQL);
    BASE_LOGGER.extend(entityName);

    this.logger = BASE_LOGGER;
  }

  logQuery(query: string, params: unknown[]): void {
    const payload = { query, params };

    return;

    switch (this.logLevel) {
      case 'error':
        this.logger.error(payload);
        break;
      case 'warn':
        this.logger.warn(payload);
        break;
      case 'info':
        this.logger.info(payload);
        break;
      default:
        this.logger.debug(payload);
        break;
    }
  }
}
