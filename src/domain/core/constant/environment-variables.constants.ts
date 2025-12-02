import { z } from 'zod';

import { BASE_LOGGER } from '@/domain/core/adapter';

const environmentVariableSchema = z.object({
  NODE_ENV: z.string().default('development'),
  LOG_LEVEL: z.string().default('info'),
  LOG_LEVEL_POSTGRESQL: z.string().default('info'),
});

export const ENVIRONMENT_VARIABLES = environmentVariableSchema.parse(
  process.env
);

BASE_LOGGER.debug(ENVIRONMENT_VARIABLES, 'Loaded environment variables');
