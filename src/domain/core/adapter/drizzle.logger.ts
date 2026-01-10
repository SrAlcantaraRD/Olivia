import type { Logger } from 'drizzle-orm';

import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { ENVIRONMENT_VARIABLES } from '@/domain/core/constant/environment-variables.constants';

export class DrizzleLogger implements Logger {
  constructor(entityName: string) {
    BASE_LOGGER.setSeverity(ENVIRONMENT_VARIABLES.LOG_LEVEL_POSTGRESQL);
    BASE_LOGGER.extend(entityName);
  }

  logQuery(_query: string, _params: unknown[]): void {}
}
