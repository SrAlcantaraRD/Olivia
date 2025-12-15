import { drizzle } from 'drizzle-orm/expo-sqlite';
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import { openDatabaseSync } from 'expo-sqlite';

import * as DB_SCHEMA from '@/database/schema';
import { DrizzleLogger } from '@/domain/core/adapter/drizzle.logger';
import { ENVIRONMENT_VARIABLES } from '@/domain/core/constant/environment-variables.constants';
import * as schema from '../schema';

export const SQLITE_DB = openDatabaseSync(ENVIRONMENT_VARIABLES.DATABASE_NAME);

export const DB_CLIENT = drizzle(SQLITE_DB, { schema });

export const buildAdapterClient = (name: string) =>
  drizzle(SQLITE_DB, {
    schema: DB_SCHEMA,
    logger: new DrizzleLogger(name),
  });

export type TAppDatabase = BaseSQLiteDatabase<
  'sync',
  unknown,
  typeof DB_SCHEMA
>;
