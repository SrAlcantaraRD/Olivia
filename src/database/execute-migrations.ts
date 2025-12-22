import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

import { DB_CLIENT } from '@/database/config/database.config';
import { dropDatabase } from '@/database/config/drop-database.config';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import migrations from './migrations/migrations';

export const useInitDb = () => {
  const schemaMigrations = useMigrations(DB_CLIENT, migrations);
  // Apply seeds (custom migrations) when schema migrations succeed

  try {
    BASE_LOGGER.info(
      `[useInitDb] Migrations to apply: ${JSON.stringify(schemaMigrations)}`
    );
    // Log available migrations in the bundle
    try {
      const keys = Object.keys(migrations.migrations || {});
      BASE_LOGGER.info(`[useInitDb] Bundled migrations: ${keys.join(',')}`);
    } catch (_err) {
      /* ignore */
    }

    // If schema migrations fail, drop database and retry
    if (!schemaMigrations.success && schemaMigrations.error) {
      BASE_LOGGER.info('Schema migrations failed, dropping database...');
      dropDatabase();
      // After dropping, the migrations will run again on next app start
    }
    // Log full error details if present
    if (schemaMigrations.error) {
      BASE_LOGGER.error(
        '[useInitDb] Migration error details:',
        schemaMigrations.error
      );
    }

    return {
      success: schemaMigrations.success,
      error: schemaMigrations.error,
    };
  } catch (_error) {
    return { success: false, error: _error };
  }
};
