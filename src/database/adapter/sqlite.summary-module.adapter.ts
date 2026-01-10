import { subDays, subMonths, subWeeks, subYears } from 'date-fns';
import { and, count, eq, gte, lte, sql } from 'drizzle-orm';

import {
  SQLiteModuleAdapter,
  type TModuleAdapterEntity,
} from '@/database/adapter/sqlite.module.adapter';
import {
  buildAdapterClient,
  type TAppDatabase,
} from '@/database/config/database.config';
import * as DB_SCHEMA from '@/database/schema';
import { BASE_LOGGER } from '@/domain/core/adapter/logger.adapter';
import { ERROR_CODE_ENUM } from '@/domain/core/enum/error-code.enum';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import { ErrorDatabaseDefault } from '@/domain/core/error/database-default.error';
import type { TID } from '@/domain/core/schemas/id.schema';
import type { TSummaryModule } from '@/domain/summary/entity/summary-module.entity';
import type {
  TDaySummaryResult,
  THalfYearSummaryResult,
  TMonthSummaryResult,
  TSummaryPeriodResult,
  TWeekSummaryResult,
  TYearSummaryResult,
} from '@/domain/summary/entity/summary-period.entity';
import type { TSummaryStatistics } from '@/domain/summary/entity/summary-statistics.entity';
import type {
  TSummaryTimeBucketMetadata,
  TTimeBucketItem,
} from '@/domain/summary/entity/summary-time-bucket.entity';
import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

// FIXME: Move domain logic into use-case
export class SQLiteSummaryModuleAdapter implements ISummaryModulePort {
  private readonly database: TAppDatabase;

  constructor(database?: TAppDatabase) {
    this.database = database ?? buildAdapterClient('SummaryModule');
  }
  private async toDomainEntity(
    entity: TModuleAdapterEntity,
    period: SUMMARY_PERIOD_ENUM
  ): Promise<TSummaryModule> {
    const module = SQLiteModuleAdapter.toDomainEntity(entity);

    // 2. Get grouped data
    const groupedData = await this.getGroupedRecordByModule({
      moduleId: module.id,
      period,
    });

    // 3. Calculate statistics
    const statistics = await this.calculateModuleStatistics({
      moduleId: module.id,
      period,
      groupedData,
    });

    BASE_LOGGER.error({ statistics }); // --- IGNORE ---

    return {
      summaryModuleFieldList: [],
      metadata: {
        module,
        moduleFieldList: module.moduleFieldList ?? [],
      },
      groupedData,
      statistics,
    } satisfies TSummaryModule;

    //   results.push(SummaryModule);
    // }

    // const { period } = params;

    // for (const moduleId of idList) {
    //   // Today count
    //   const todayResult = await this.database
    //     .select({ count: count() })
    //     .from(DB_SCHEMA.RECORD)
    //     .where(
    //       and(
    //         eq(DB_SCHEMA.RECORD.moduleID, moduleId),
    //         sql`strftime('%Y-%m-%d', datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch')) = strftime('%Y-%m-%d', 'now')`
    //       )
    //     );

    //   const todayCount = todayResult[0]?.count ?? 0;

    //   // Last recorded at
    //   const lastRecord = await this.database
    //     .select({ createdAt: DB_SCHEMA.RECORD.createdAt })
    //     .from(DB_SCHEMA.RECORD)
    //     .where(eq(DB_SCHEMA.RECORD.moduleID, moduleId))
    //     .orderBy(sql`${DB_SCHEMA.RECORD.createdAt} DESC`)
    //     .limit(1);

    //   const lastRecordedAt = lastRecord[0]?.createdAt ?? null;

    //   // Last 7 days series
    //   const last7DaysStart = subDays(new Date(), 7);
    //   const last7DaysResult = await this.database
    //     .select({
    //       date: sql<string>`strftime('%Y-%m-%d', datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch'))`,
    //       value: count(),
    //     })
    //     .from(DB_SCHEMA.RECORD)
    //     .where(
    //       and(
    //         eq(DB_SCHEMA.RECORD.moduleID, moduleId),
    //         gte(DB_SCHEMA.RECORD.createdAt, last7DaysStart)
    //       )
    //     )
    //     .groupBy(
    //       sql`strftime('%Y-%m-%d', datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch'))`
    //     )
    //     .orderBy(
    //       sql`strftime('%Y-%m-%d', datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch'))`
    //     );

    //   // Previous period average (previous 7 days before last 7 days)
    //   const previousStart = subDays(new Date(), 14);
    //   const previousEnd = subDays(new Date(), 7);
    //   const previousPeriodResult = await this.database
    //     .select({ count: count() })
    //     .from(DB_SCHEMA.RECORD)
    //     .where(
    //       and(
    //         eq(DB_SCHEMA.RECORD.moduleID, moduleId),
    //         gte(DB_SCHEMA.RECORD.createdAt, previousStart),
    //         lte(DB_SCHEMA.RECORD.createdAt, previousEnd)
    //       )
    //     );

    //   const previousTotal = previousPeriodResult[0]?.count ?? 0;
    //   const previousPeriodAverage =
    //     previousTotal > 0 ? previousTotal / 7 : null;

    //   // Get module key from MODULE table
    //   const moduleResult = await this.database
    //     .select({ code: DB_SCHEMA.MODULE.code })
    //     .from(DB_SCHEMA.MODULE)
    //     .where(eq(DB_SCHEMA.MODULE.id, moduleId))
    //     .limit(1);

    //   const moduleKey = moduleResult[0]?.code ?? `module.${moduleId}`;

    //   results.push({
    //     moduleId,
    //     moduleKey: moduleKey as MODULE_KEY_ENUM,
    //     todayCount,
    //     lastRecordedAt: lastRecordedAt ? lastRecordedAt.toISOString() : null,
    //     last7Days: last7DaysResult,
    //     previousPeriodAverage,
    //   });
    // }

    // return results;
    // return {
    //   module,
    //   groupedData:

    //   todayCount: entity.todayCount,
    //   lastRecordedAt: entity.lastRecordedAt,
    //   last7Days: entity.last7Days.map((point) => ({
    //     date: point.date,
    //     value: point.value,
    //   })),
    //   previousPeriodAverage: entity.previousPeriodAverage,
    // };
  }

  public async getAll(params: {
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryModule[]> {
    const rows = await this.database.query.MODULE.findMany({
      where: (row, { eq }) => eq(row.active, STATUS_ENUM.ACTIVE),
      with: {
        moduleFieldList: true,
      },
    });

    return Promise.all(
      rows.map((module) => this.toDomainEntity(module, params.period))
    );
  }

  public async getInList(params: {
    idList: TID[];
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryModule[]> {
    const rows = await this.database.query.MODULE.findMany({
      where: (module, { inArray }) => inArray(module.id, params.idList),
      with: {
        moduleFieldList: true,
      },
    });

    return Promise.all(
      rows.map((module) => this.toDomainEntity(module, params.period))
    );
  }

  public async getDetails(params: {
    id: TID;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryModule> {
    const row = await this.database.query.MODULE.findFirst({
      where: (row, { eq, and }) =>
        and(eq(row.active, STATUS_ENUM.ACTIVE), eq(row.id, params.id)),
      with: {
        moduleFieldList: true,
      },
    });

    if (!row) {
      throw new ErrorDatabaseDefault(
        ERROR_CODE_ENUM.ENTITY_NOT_FOUND,
        `Summary module with ID ${params.id} not found.`
      );
    }

    return this.toDomainEntity(row, params.period);
  }

  private async calculateModuleStatistics(params: {
    moduleId: TID;
    period: SUMMARY_PERIOD_ENUM;
    groupedData: TSummaryPeriodResult;
  }): Promise<TSummaryStatistics> {
    const { moduleId, period, groupedData } = params;

    const currentPeriodTotal = groupedData.metadata.totalCount;

    // Get previous period data
    const { startDate: prevStart, endDate: prevEnd } =
      this.getPreviousPeriodDateRange(period);

    const prevConditions = [
      eq(DB_SCHEMA.RECORD.moduleID, moduleId),
      gte(DB_SCHEMA.RECORD.createdAt, prevStart),
      lte(DB_SCHEMA.RECORD.createdAt, prevEnd),
    ];

    const [prevResult] = await this.database
      .select({ count: count() })
      .from(DB_SCHEMA.RECORD)
      .where(and(...prevConditions));

    const previousPeriodTotal = prevResult?.count ?? 0;

    const percentageChange =
      previousPeriodTotal > 0
        ? ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) *
          100
        : 0;

    // Get last recorded timestamp
    const [lastRecord] = await this.database
      .select({ createdAt: DB_SCHEMA.RECORD.createdAt })
      .from(DB_SCHEMA.RECORD)
      .where(eq(DB_SCHEMA.RECORD.moduleID, moduleId))
      .orderBy(sql`${DB_SCHEMA.RECORD.createdAt} DESC`)
      .limit(1);

    const lastRecordedAt = lastRecord ? lastRecord.createdAt : new Date(0);

    return {
      currentPeriodTotal,
      previousPeriodTotal,
      percentageChange: Math.round(percentageChange * 10) / 10,
      lastRecordedAt,
      currentPeriodAverage:
        groupedData.metadata.uniqueRecords > 0
          ? currentPeriodTotal / groupedData.metadata.uniqueRecords
          : null,
      previousPeriodAverage:
        previousPeriodTotal > 0
          ? previousPeriodTotal / groupedData.metadata.uniqueRecords // Approximation
          : null,
      mostCommonValue: null,
      weightedAverage: null,
    } satisfies TSummaryStatistics;
  }

  private getPreviousPeriodDateRange(period: SUMMARY_PERIOD_ENUM): {
    startDate: Date;
    endDate: Date;
  } {
    const current = this.getDateRangeForPeriod(period);
    const duration = current.endDate.getTime() - current.startDate.getTime();

    return {
      startDate: new Date(current.startDate.getTime() - duration),
      endDate: new Date(current.startDate.getTime() - 1),
    };
  }

  private getDateRangeForPeriod(period: SUMMARY_PERIOD_ENUM): {
    startDate: Date;
    endDate: Date;
  } {
    const now = new Date();
    const endDate = now;
    let startDate: Date;

    switch (period) {
      case SUMMARY_PERIOD_ENUM.DAY:
        // Last 24 hours
        startDate = subDays(now, 1);
        break;

      case SUMMARY_PERIOD_ENUM.WEEK:
        // Last 7 days
        startDate = subWeeks(now, 1);
        break;

      case SUMMARY_PERIOD_ENUM.MONTH:
        // Last 30 days
        startDate = subMonths(now, 1);
        break;

      case SUMMARY_PERIOD_ENUM.HALF_YEAR:
        // Last 24 weeks
        startDate = subMonths(now, 6);
        break;

      case SUMMARY_PERIOD_ENUM.YEAR:
        // Last 12 months
        startDate = subYears(now, 1);
        break;

      default:
        startDate = subWeeks(now, 1);
    }

    return { startDate, endDate };
  }

  private async getGroupedRecordByModule(params: {
    moduleId: TID;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryPeriodResult> {
    const { moduleId, period } = params;

    const { startDate, endDate } = this.getDateRangeForPeriod(period);
    const groupByClause = this.buildGroupByClause(period);

    const conditions = [
      eq(DB_SCHEMA.RECORD.moduleID, moduleId),
      gte(DB_SCHEMA.RECORD.createdAt, startDate),
      lte(DB_SCHEMA.RECORD.createdAt, endDate),
    ];

    const results = await this.database
      .select({
        bucketKey: sql<string>`${groupByClause}`,
        count: count(),
        bucketTimestamp: sql<number>`MIN(${DB_SCHEMA.RECORD.createdAt})`,
      })
      .from(DB_SCHEMA.RECORD)
      .where(and(...conditions))
      .groupBy(groupByClause)
      .orderBy(sql`MIN(${DB_SCHEMA.RECORD.createdAt})`);

    // Fill missing buckets and format
    const buckets = this.fillMissingBuckets(
      results,
      period,
      startDate,
      endDate
    );

    // Calculate metadata
    const totalCount = buckets.reduce((sum, b) => sum + b.value, 0);
    const uniqueRecords = new Set(results.map((r) => r.bucketTimestamp)).size;

    return this.buildTypedPeriodResult(period, buckets, {
      totalCount,
      uniqueRecords,
      dateRange: { from: startDate, to: endDate },
    });
  }

  private buildTypedPeriodResult(
    period: SUMMARY_PERIOD_ENUM,
    buckets: TTimeBucketItem[],
    metadata: TSummaryTimeBucketMetadata
  ): TSummaryPeriodResult {
    switch (period) {
      case SUMMARY_PERIOD_ENUM.DAY:
        return {
          period: SUMMARY_PERIOD_ENUM.DAY,
          buckets: buckets.map((b, i) => ({ ...b, hour: i })),
          metadata,
        } satisfies TDaySummaryResult;

      case SUMMARY_PERIOD_ENUM.WEEK:
        return {
          period: SUMMARY_PERIOD_ENUM.WEEK,
          buckets: buckets.map((b, i) => ({ ...b, dayOfWeek: i })),
          metadata,
        } satisfies TWeekSummaryResult;

      case SUMMARY_PERIOD_ENUM.MONTH:
        return {
          period: SUMMARY_PERIOD_ENUM.MONTH,
          buckets: buckets.map((b, i) => ({ ...b, dayOfMonth: i + 1 })),
          metadata,
        } satisfies TMonthSummaryResult;

      case SUMMARY_PERIOD_ENUM.HALF_YEAR:
        return {
          period: SUMMARY_PERIOD_ENUM.HALF_YEAR,
          buckets: buckets.map((b, i) => ({ ...b, weekNumber: i + 1 })),
          metadata,
        } satisfies THalfYearSummaryResult;

      case SUMMARY_PERIOD_ENUM.YEAR:
        return {
          period: SUMMARY_PERIOD_ENUM.YEAR,
          buckets: buckets.map((b, i) => ({ ...b, month: i + 1 })),
          metadata,
        } satisfies TYearSummaryResult;

      default:
        throw new Error(`Unsupported period: ${period}`);
    }
  }

  private fillMissingBuckets(
    results: { bucketKey: string; count: number; bucketTimestamp: number }[],
    period: SUMMARY_PERIOD_ENUM,
    startDate: Date,
    endDate: Date
  ): TTimeBucketItem[] {
    const buckets: TTimeBucketItem[] = [];

    switch (period) {
      case SUMMARY_PERIOD_ENUM.DAY: {
        // 24 hours
        for (let hour = 0; hour < 24; hour++) {
          const bucketKey = hour.toString().padStart(2, '0');
          const existing = results.find((r) => r.bucketKey === bucketKey);
          const timestamp = new Date(
            startDate.getTime() + hour * 60 * 60 * 1000
          );

          buckets.push({
            label: `${bucketKey}:00`,
            value: existing?.count ?? 0,
            timestamp,
          });
        }
        break;
      }

      case SUMMARY_PERIOD_ENUM.WEEK: {
        // 7 days
        const dayNames: Ti18nKeys[] = [
          'common.day.sunday',
          'common.day.monday',
          'common.day.tuesday',
          'common.day.wednesday',
          'common.day.thursday',
          'common.day.friday',
          'common.day.saturday',
        ];
        for (let day = 0; day < 7; day++) {
          const bucketKey = day.toString();
          const existing = results.find((r) => r.bucketKey === bucketKey);
          const timestamp = new Date(
            startDate.getTime() + day * 24 * 60 * 60 * 1000
          );

          buckets.push({
            label: dayNames[day] ?? `Day ${day}`,
            value: existing?.count ?? 0,
            timestamp,
          });
        }
        break;
      }

      case SUMMARY_PERIOD_ENUM.MONTH: {
        // 30 days
        for (let day = 0; day < 30; day++) {
          const timestamp = new Date(
            startDate.getTime() + day * 24 * 60 * 60 * 1000
          );
          const bucketKey = timestamp.toISOString().split('T')[0] ?? '';
          const existing = results.find((r) => r.bucketKey === bucketKey);

          buckets.push({
            label: `${timestamp.getMonth() + 1}/${timestamp.getDate()}`,
            value: existing?.count ?? 0,
            timestamp,
          });
        }
        break;
      }

      case SUMMARY_PERIOD_ENUM.HALF_YEAR: {
        // 24 weeks
        for (let week = 0; week < 24; week++) {
          const timestamp = new Date(
            startDate.getTime() + week * 7 * 24 * 60 * 60 * 1000
          );
          const year = timestamp.getFullYear();
          // Simplified week calculation
          const weekNum = Math.floor(
            (timestamp.getTime() - new Date(year, 0, 1).getTime()) /
              (7 * 24 * 60 * 60 * 1000)
          );
          const bucketKey = `${year}-${weekNum.toString().padStart(2, '0')}`;
          const existing = results.find((r) => r.bucketKey === bucketKey);

          buckets.push({
            label: `W${weekNum}`,
            value: existing?.count ?? 0,
            timestamp,
          });
        }
        break;
      }

      case SUMMARY_PERIOD_ENUM.YEAR: {
        // 12 months
        const monthNames: Ti18nKeys[] = [
          'common.month.january',
          'common.month.february',
          'common.month.march',
          'common.month.april',
          'common.month.may',
          'common.month.june',
          'common.month.july',
          'common.month.august',
          'common.month.september',
          'common.month.october',
          'common.month.november',
          'common.month.december',
        ];
        const currentYear = endDate.getFullYear();

        for (let month = 0; month < 12; month++) {
          const timestamp = new Date(currentYear, month, 1);
          const bucketKey = `${currentYear}-${(month + 1).toString().padStart(2, '0')}`;
          const existing = results.find((r) => r.bucketKey === bucketKey);

          buckets.push({
            label: monthNames[month] ?? `Month ${month + 1}`,
            value: existing?.count ?? 0,
            timestamp,
          });
        }
        break;
      }
    }

    return buckets;
  }

  private buildGroupByClause(period: SUMMARY_PERIOD_ENUM) {
    switch (period) {
      case SUMMARY_PERIOD_ENUM.DAY:
        // Group by hour (0-23)
        return sql`strftime('%H', datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch'))`;

      case SUMMARY_PERIOD_ENUM.WEEK:
        // Group by day of week (0-6, Sunday=0)
        return sql`strftime('%w', datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch'))`;

      case SUMMARY_PERIOD_ENUM.MONTH:
        // Group by full date
        return sql`DATE(datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch'))`;

      case SUMMARY_PERIOD_ENUM.HALF_YEAR:
        // Group by year-week
        return sql`strftime('%Y-%W', datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch'))`;

      case SUMMARY_PERIOD_ENUM.YEAR:
        // Group by year-month
        return sql`strftime('%Y-%m', datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch'))`;

      default:
        return sql`DATE(datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch'))`;
    }
  }
}
