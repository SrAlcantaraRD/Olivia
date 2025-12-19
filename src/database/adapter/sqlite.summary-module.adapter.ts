import { and, count, eq, gte, lte, sql } from 'drizzle-orm';

import {
  buildAdapterClient,
  type TAppDatabase,
} from '@/database/config/database.config';
import * as DB_SCHEMA from '@/database/schema';
import type { TID } from '@/domain/core/schemas/id.schema';
import type { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';
import type { TSummaryModule } from '@/domain/summary/entity/summary-module.entity';
import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';

export type TSummaryModuleAdapterEntity = {
  moduleId: number;
  moduleKey: string;
  todayCount: number;
  lastRecordedAt: string | null;
  last7Days: Array<{ date: string; value: number }>;
  previousPeriodAverage: number | null;
};

export class SQLiteSummaryModuleAdapter implements ISummaryModulePort {
  private readonly database: TAppDatabase;

  constructor(database?: TAppDatabase) {
    this.database = database ?? buildAdapterClient('SummaryModule');
  }

  public static toDomainEntity(
    entity: TSummaryModuleAdapterEntity
  ): TSummaryModule {
    return {
      moduleId: entity.moduleId,
      moduleKey: entity.moduleKey as MODULE_KEY_ENUM,
      todayCount: entity.todayCount,
      lastRecordedAt: entity.lastRecordedAt,
      last7Days: entity.last7Days.map((point) => ({
        date: point.date,
        value: point.value,
      })),
      previousPeriodAverage: entity.previousPeriodAverage,
    };
  }

  public async getModuleSummaries(moduleIds: TID[]): Promise<TSummaryModule[]> {
    const results: TSummaryModule[] = [];

    for (const moduleId of moduleIds) {
      // Today count
      const todayResult = await this.database
        .select({ count: count() })
        .from(DB_SCHEMA.RECORD)
        .where(
          and(
            eq(DB_SCHEMA.RECORD.moduleID, moduleId),
            sql`strftime('%Y-%m-%d', ${DB_SCHEMA.RECORD.createdAt}) = strftime('%Y-%m-%d', 'now')`
          )
        );

      const todayCount = todayResult[0]?.count ?? 0;

      // Last recorded at
      const lastRecord = await this.database
        .select({ createdAt: DB_SCHEMA.RECORD.createdAt })
        .from(DB_SCHEMA.RECORD)
        .where(eq(DB_SCHEMA.RECORD.moduleID, moduleId))
        .orderBy(sql`${DB_SCHEMA.RECORD.createdAt} DESC`)
        .limit(1);

      const lastRecordedAt = lastRecord[0]?.createdAt ?? null;

      // Last 7 days series
      const last7DaysResult = await this.database
        .select({
          date: sql<string>`strftime('%Y-%m-%d', ${DB_SCHEMA.RECORD.createdAt})`,
          value: count(),
        })
        .from(DB_SCHEMA.RECORD)
        .where(
          and(
            eq(DB_SCHEMA.RECORD.moduleID, moduleId),
            gte(DB_SCHEMA.RECORD.createdAt, sql`datetime('now', '-7 days')`)
          )
        )
        .groupBy(sql`strftime('%Y-%m-%d', ${DB_SCHEMA.RECORD.createdAt})`)
        .orderBy(sql`strftime('%Y-%m-%d', ${DB_SCHEMA.RECORD.createdAt})`);

      // Previous period average (previous 7 days before last 7 days)
      const previousPeriodResult = await this.database
        .select({ count: count() })
        .from(DB_SCHEMA.RECORD)
        .where(
          and(
            eq(DB_SCHEMA.RECORD.moduleID, moduleId),
            gte(DB_SCHEMA.RECORD.createdAt, sql`datetime('now', '-14 days')`),
            lte(DB_SCHEMA.RECORD.createdAt, sql`datetime('now', '-7 days')`)
          )
        );

      const previousTotal = previousPeriodResult[0]?.count ?? 0;
      const previousPeriodAverage =
        previousTotal > 0 ? previousTotal / 7 : null;

      // Get module key from MODULE table
      const moduleResult = await this.database
        .select({ code: DB_SCHEMA.MODULE.code })
        .from(DB_SCHEMA.MODULE)
        .where(eq(DB_SCHEMA.MODULE.id, moduleId))
        .limit(1);

      const moduleKey = moduleResult[0]?.code ?? `module.${moduleId}`;

      results.push({
        moduleId,
        moduleKey: moduleKey as MODULE_KEY_ENUM,
        todayCount,
        lastRecordedAt: lastRecordedAt ? lastRecordedAt.toISOString() : null,
        last7Days: last7DaysResult,
        previousPeriodAverage,
      });
    }

    return results;
  }
}
