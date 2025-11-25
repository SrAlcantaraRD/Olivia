import type { Config } from 'drizzle-kit';

export default {
  schema: './ddbb/schema/index.ts',
  out: './ddbb/migrations',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;
