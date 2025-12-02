import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

import { DB_CLIENT } from '@/database/config/database.config';
import migrations from './migrations/migrations';

export const useInitDb = () => {
  return useMigrations(DB_CLIENT, migrations);
};
