import { SQLITE_DB } from '@/database/config/database.config';

/**
 * Drops all tables in the database, leaving it clean.
 * Use with caution, as this will delete all data.
 */
export const dropDatabase = async () => {
  // Get all user tables
  const tables = SQLITE_DB.getAllSync(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
  ) as { name: string }[];

  // Drop each table
  tables.forEach((table) => {
    SQLITE_DB.execSync(`DROP TABLE IF EXISTS ${table.name};`);
  });
};
