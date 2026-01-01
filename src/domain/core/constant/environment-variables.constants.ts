import { z } from 'zod';

const environmentVariableSchema = z.object({
  NODE_ENV: z.string().default('development'),
  LOG_LEVEL: z.string().default('4'),
  LOG_LEVEL_POSTGRESQL: z.string().default('info'),
  DATABASE_NAME: z.string().default('tfg-uoc'),
  QR_CHUNK_SIZE: z.preprocess(
    (v) => (typeof v === 'string' ? Number(v) : v),
    z.number().int().min(100).default(800)
  ),
});

export const ENVIRONMENT_VARIABLES = environmentVariableSchema.parse(
  process.env
);
