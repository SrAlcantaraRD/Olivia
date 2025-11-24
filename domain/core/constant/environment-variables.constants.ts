import { z } from 'zod';

const environmentVariableSchema = z.object({
  NODE_ENV: z.string().default('development'),
  LOG_LEVEL: z.string().default('info'),
  MIGRATE_FROM_ARTIFACTS: z.coerce.boolean().default(false),
});

export const ENVIRONMENT_VARIABLES = environmentVariableSchema.parse(
  process.env
);
