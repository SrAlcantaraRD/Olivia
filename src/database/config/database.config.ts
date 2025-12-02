import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import { DATABASE_NAME } from '@/domain/core';
import * as schema from '../schema';

export const SQLITE_DB = openDatabaseSync(DATABASE_NAME);

export const DB_CLIENT = drizzle(SQLITE_DB, { schema });
