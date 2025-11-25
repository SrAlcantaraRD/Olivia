import type { Config } from 'drizzle-kit';

export default {
  schema: './src/ddbb/schema/index.ts',
  out: './src/ddbb/migrations',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;
