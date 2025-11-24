import type { Config } from 'drizzle-kit';

export default {
  schema: './ddbb/schemas/index.ts',
  out: './ddbb/migrations',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;
