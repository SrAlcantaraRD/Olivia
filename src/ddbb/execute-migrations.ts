import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

import { DB_CLIENT } from '@/ddbb/config/database.config';
import migrations from './migrations/migrations';

export const useInitDb = () => {
  return useMigrations(DB_CLIENT, migrations);
};
