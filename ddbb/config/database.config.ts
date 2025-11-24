import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from '../schema';

const EXPO_DB = openDatabaseSync('db.db');

export const DB_CLIENT = drizzle(EXPO_DB, { schema });
