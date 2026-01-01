import { subDays, subMonths, subWeeks, subYears } from 'date-fns';
import { and, count, eq, gte, lte, sql } from 'drizzle-orm';
import type { SQLiteColumn } from 'drizzle-orm/sqlite-core';

import {
  SQLiteModuleFieldAdapter,
  type TModuleFieldAdapterEntity,
} from '@/database/adapter/sqlite.module-field.adapter';
import {
  buildAdapterClient,
  type TAppDatabase,
} from '@/database/config/database.config';
import * as DB_SCHEMA from '@/database/schema';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import { ErrorEntityNotFoundBy } from '@/domain/core/error/entity-not-found-by.error';
import type { TID } from '@/domain/core/schemas/id.schema';
import type {
  TSummaryModuleField,
  TSummaryModuleFieldDistribution,
} from '@/domain/summary/entity/summary-field.entity';
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
import type { ISummaryModuleFieldPort } from '@/domain/summary/port/summary-module-field.port';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

export class SQLiteSummaryModuleFieldAdapter
  implements ISummaryModuleFieldPort
{
  private readonly database: TAppDatabase;

  constructor(database?: TAppDatabase) {
    this.database = database ?? buildAdapterClient('SummaryModuleField');
  }

  private async toDomainEntity(
    entity: TModuleFieldAdapterEntity,
    period: SUMMARY_PERIOD_ENUM
  ): Promise<TSummaryModuleField> {
    // 2. Get grouped data
    const groupedData = await this.getGroupedRecordFieldsByField({
      fieldId: entity.id,
      period,
    });

    // 3. Get value distribution (if applicable)
    const distribution = await this.getFieldValueDistribution({
      fieldId: entity.id,
      period,
    });

    // 4. Calculate statistics
    const statistics = await this.calculateFieldStatistics({
      fieldId: entity.id,
      period,
      groupedData,
    });

    return {
      metadata: {
        moduleID: entity.moduleID,
        moduleField: SQLiteModuleFieldAdapter.toDomainEntity(entity),
      },
      groupedData,
      distribution,
      statistics,
    } satisfies TSummaryModuleField;
  }

  public async getByModuleID(params: {
    moduleID: TID;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryModuleField[]> {
    const rows = await this.database.query.MODULE_FIELD.findMany({
      where: (row, { and, eq }) =>
        and(
          eq(row.status, STATUS_ENUM.ACTIVE),
          eq(row.moduleID, params.moduleID)
        ),
    });

    const list = await Promise.all(
      rows.map((row) => this.toDomainEntity(row, params.period))
    );

    return list;
  }

  public async getDetails(params: {
    id: TID;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryModuleField> {
    const row = await this.database.query.MODULE_FIELD.findFirst({
      where: (row, { and, eq }) =>
        and(eq(row.status, STATUS_ENUM.ACTIVE), eq(row.id, params.id)),
    });

    if (!row) {
      throw new ErrorEntityNotFoundBy('Module Filld', 'id', params.id);
    }

    return this.toDomainEntity(row, params.period);
  }

  private async getGroupedRecordFieldsByField(params: {
    fieldId: TID;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryPeriodResult> {
    const { fieldId, period } = params;

    const { startDate, endDate } = this.getDateRangeForPeriod(period);
    const groupByClause = this.buildGroupByClause(
      period,
      DB_SCHEMA.RECORD_FIELD.createdAt
    );

    const conditions = [
      eq(DB_SCHEMA.RECORD_FIELD.fieldID, fieldId),
      gte(DB_SCHEMA.RECORD.createdAt, startDate),
      lte(DB_SCHEMA.RECORD.createdAt, endDate),
    ];

    const results = await this.database
      .select({
        bucketKey: sql<string>`${groupByClause}`,
        count: count(),
        bucketTimestamp: sql<number>`MIN(${DB_SCHEMA.RECORD.createdAt})`,
      })
      .from(DB_SCHEMA.RECORD_FIELD)
      .innerJoin(
        DB_SCHEMA.RECORD,
        eq(DB_SCHEMA.RECORD_FIELD.recordID, DB_SCHEMA.RECORD.id)
      )
      .where(and(...conditions))
      .groupBy(groupByClause)
      .orderBy(sql`MIN(${DB_SCHEMA.RECORD.createdAt})`);

    const buckets = this.fillMissingBuckets(
      results,
      period,
      startDate,
      endDate
    );

    const totalCount = buckets.reduce((sum, b) => sum + b.value, 0);
    const uniqueRecords = new Set(results.map((r) => r.bucketTimestamp)).size;

    return this.buildTypedPeriodResult(period, buckets, {
      totalCount,
      uniqueRecords,
      dateRange: { from: startDate, to: endDate },
    });
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

  private buildGroupByClause(
    period: SUMMARY_PERIOD_ENUM,
    column: SQLiteColumn
  ) {
    switch (period) {
      case SUMMARY_PERIOD_ENUM.DAY:
        // Group by hour (0-23)
        return sql`strftime('%H', datetime(${column}, 'unixepoch'))`;

      case SUMMARY_PERIOD_ENUM.WEEK:
        // Group by day of week (0-6, Sunday=0)
        return sql`strftime('%w', datetime(${column}, 'unixepoch'))`;

      case SUMMARY_PERIOD_ENUM.MONTH:
        // Group by full date
        return sql`DATE(datetime(${column}, 'unixepoch'))`;

      case SUMMARY_PERIOD_ENUM.HALF_YEAR:
        // Group by year-week
        return sql`strftime('%Y-%W', datetime(${column}, 'unixepoch'))`;

      case SUMMARY_PERIOD_ENUM.YEAR:
        // Group by year-month
        return sql`strftime('%Y-%m', datetime(${column}, 'unixepoch'))`;

      default:
        return sql`DATE(datetime(${column}, 'unixepoch'))`;
    }
  }

  private async getFieldValueDistribution(params: {
    fieldId: TID;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryModuleFieldDistribution[]> {
    const { fieldId, period } = params;

    // Get the module field to check if it's SELECT type
    const [moduleField] = await this.database
      .select()
      .from(DB_SCHEMA.MODULE_FIELD)
      .where(eq(DB_SCHEMA.MODULE_FIELD.id, fieldId))
      .limit(1);

    const { startDate, endDate } = this.getDateRangeForPeriod(period);

    const conditions = [
      eq(DB_SCHEMA.RECORD_FIELD.fieldID, fieldId),
      gte(DB_SCHEMA.RECORD.createdAt, startDate),
      lte(DB_SCHEMA.RECORD.createdAt, endDate),
    ];

    const results = await this.database
      .select({
        value: DB_SCHEMA.RECORD_FIELD.value,
        count: count(),
      })
      .from(DB_SCHEMA.RECORD_FIELD)
      .innerJoin(
        DB_SCHEMA.RECORD,
        eq(DB_SCHEMA.RECORD_FIELD.recordID, DB_SCHEMA.RECORD.id)
      )
      .where(and(...conditions))
      .groupBy(DB_SCHEMA.RECORD_FIELD.value)
      .orderBy(sql`count(*) DESC`);

    const total = results.reduce((sum, r) => sum + r.count, 0);

    // For SELECT fields, ensure all options are shown (even with 0 count)
    const availableOptions = JSON.parse(moduleField.values) as string[];

    // Create a map of existing counts
    const countMap = new Map(results.map((r) => [r.value, r.count]));

    // Ensure all options are present, maintaining their original order
    return availableOptions.map((option) => ({
      value: option,
      count: countMap.get(option) ?? 0,
      percentage:
        total > 0
          ? Math.round(((countMap.get(option) ?? 0) / total) * 100 * 10) / 10
          : 0,
    }));
  }

  private async calculateFieldStatistics(params: {
    fieldId: TID;
    period: SUMMARY_PERIOD_ENUM;
    groupedData: TSummaryPeriodResult;
  }): Promise<TSummaryStatistics> {
    const { fieldId, period, groupedData } = params;

    // Get the module field to check type
    const [moduleField] = await this.database
      .select()
      .from(DB_SCHEMA.MODULE_FIELD)
      .where(eq(DB_SCHEMA.MODULE_FIELD.id, fieldId))
      .limit(1);

    const currentPeriodTotal = groupedData.metadata.totalCount;

    // Get previous period data
    const { startDate: prevStart, endDate: prevEnd } =
      this.getPreviousPeriodDateRange(period);

    const prevConditions = [
      eq(DB_SCHEMA.RECORD_FIELD.fieldID, fieldId),
      gte(DB_SCHEMA.RECORD.createdAt, prevStart),
      lte(DB_SCHEMA.RECORD.createdAt, prevEnd),
    ];

    const [prevResult] = await this.database
      .select({ count: count() })
      .from(DB_SCHEMA.RECORD_FIELD)
      .innerJoin(
        DB_SCHEMA.RECORD,
        eq(DB_SCHEMA.RECORD_FIELD.recordID, DB_SCHEMA.RECORD.id)
      )
      .where(and(...prevConditions));

    const previousPeriodTotal = prevResult?.count ?? 0;

    const { startDate, endDate } = this.getDateRangeForPeriod(period);

    const valueConditions = [
      eq(DB_SCHEMA.RECORD_FIELD.fieldID, fieldId),
      gte(DB_SCHEMA.RECORD.createdAt, startDate),
      lte(DB_SCHEMA.RECORD.createdAt, endDate),
    ];

    // Get most common value
    const [mostCommon] = await this.database
      .select({
        value: DB_SCHEMA.RECORD_FIELD.value,
        count: count(),
      })
      .from(DB_SCHEMA.RECORD_FIELD)
      .innerJoin(
        DB_SCHEMA.RECORD,
        eq(DB_SCHEMA.RECORD_FIELD.recordID, DB_SCHEMA.RECORD.id)
      )
      .where(and(...valueConditions))
      .groupBy(DB_SCHEMA.RECORD_FIELD.value)
      .orderBy(sql`count(*) DESC`)
      .limit(1);

    const mostCommonValue = mostCommon?.value ?? null;

    // Build base statistics
    const baseStats = {
      currentPeriodTotal,
      previousPeriodTotal,
      mostCommonValue,
      currentPeriodAverage: null,
      percentageChange: null,
      previousPeriodAverage: null,
      lastRecordedAt: null,
      weightedAverage: null,
    } satisfies TSummaryStatistics;

    // For SELECT fields, calculate Fibonacci weighted average
    const availableOptions = JSON.parse(moduleField.values) as string[];

    // Calculate Fibonacci weighted averageº
    const fibWeights = this.getFibonacciWeights(availableOptions.length);

    // Get distribution for weighting
    const distribution = await this.getFieldValueDistribution({
      fieldId,
      period,
    });

    // Calculate weighted average: Σ(weight × count) / total_count
    let weightedSum = 0;
    let totalCount = 0;

    availableOptions.forEach((option, index) => {
      const dist = (distribution ?? []).find((d) => d.value === option);
      const count = dist?.count ?? 0;
      const weight = fibWeights[index] ?? 1;

      weightedSum += weight * count;
      totalCount += count;
    });

    const weightedAverage =
      totalCount > 0 ? Math.round((weightedSum / totalCount) * 10) / 10 : null;

    // Check if SELECT options are numeric (e.g., ["1", "2", "3"])
    const allOptionsAreNumeric = availableOptions.every(
      (opt) => !Number.isNaN(parseFloat(opt))
    );

    if (allOptionsAreNumeric) {
      // Calculate numeric average for numeric SELECT fields
      const values = await this.database
        .select({ value: DB_SCHEMA.RECORD_FIELD.value })
        .from(DB_SCHEMA.RECORD_FIELD)
        .innerJoin(
          DB_SCHEMA.RECORD,
          eq(DB_SCHEMA.RECORD_FIELD.recordID, DB_SCHEMA.RECORD.id)
        )
        .where(and(...valueConditions));

      const numericValues = values
        .map((v) => parseFloat(v.value))
        .filter((n) => !Number.isNaN(n));

      if (numericValues.length > 0) {
        const averageValue =
          numericValues.reduce((sum, v) => sum + v, 0) / numericValues.length;

        return {
          ...baseStats,
          currentPeriodAverage: Math.round(averageValue * 10) / 10,
          weightedAverage,
        };
      }
    }

    // For TEXT fields, try to calculate average if values are numeric
    const values = await this.database
      .select({ value: DB_SCHEMA.RECORD_FIELD.value })
      .from(DB_SCHEMA.RECORD_FIELD)
      .innerJoin(
        DB_SCHEMA.RECORD,
        eq(DB_SCHEMA.RECORD_FIELD.recordID, DB_SCHEMA.RECORD.id)
      )
      .where(and(...valueConditions));

    const numericValues = values
      .map((v) => parseFloat(v.value))
      .filter((n) => !Number.isNaN(n));

    let averageValue: number = 0;
    if (numericValues.length > 0) {
      averageValue =
        numericValues.reduce((sum, v) => sum + v, 0) / numericValues.length;
      averageValue = Math.round(averageValue * 10) / 10;
    }

    return baseStats;
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

  private getFibonacciWeights(count: number): number[] {
    if (count === 0) return [];
    if (count === 1) return [1];

    const weights = [1, 2];

    for (let i = 2; i < count; i++) {
      weights.push(weights[i - 1] + weights[i - 2]);
    }

    return weights.slice(0, count);
  }
}
