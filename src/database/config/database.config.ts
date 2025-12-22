import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import { ENVIRONMENT_VARIABLES } from '@/domain/core/constant/environment-variables.constants';
import * as schema from '../schema';

export const SQLITE_DB = openDatabaseSync(ENVIRONMENT_VARIABLES.DATABASE_NAME);

export const DB_CLIENT = drizzle(SQLITE_DB, { schema });
