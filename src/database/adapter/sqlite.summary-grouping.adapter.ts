import { and, count, eq, gte, lte, sql } from 'drizzle-orm';

import { SQLiteModuleFieldAdapter } from '@/database/adapter/sqlite.module-field.adapter';
import {
  buildAdapterClient,
  type TAppDatabase,
} from '@/database/config/database.config';
import * as DB_SCHEMA from '@/database/schema';
import type { TID } from '@/domain/core/schemas/id.schema';
import { getModuleFieldTypeFromValue } from '@/domain/module/enum/module-field-type.enum';
import { getModuleKeyFromValue } from '@/domain/module/enum/module-key.enum';
import type {
  TDaySummaryResult,
  THalfYearSummaryResult,
  TMonthSummaryResult,
  TSummaryPeriodResult,
  TWeekSummaryResult,
  TYearSummaryResult,
} from '@/domain/summary/dto/summary-period.dto';
import type { TSummaryModuleField } from '@/domain/summary/entity/summary-field.entity';
import type { TSummaryModule } from '@/domain/summary/entity/summary-module.entity';
import type { TSummaryStatistics } from '@/domain/summary/entity/summary-statistics.entity';
import type {
  TSummaryTimeBucketMetadata,
  TTimeBucketItem,
} from '@/domain/summary/entity/summary-time-bucket.entity';
import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

/**
 * SQLite adapter for grouping RecordFields by period
 * Implements clean SQL-based aggregation with type-safe results
 */
export class SqliteSummaryGroupingAdapter implements ISummaryGroupingPort {
  private readonly database: TAppDatabase;

  constructor(database?: TAppDatabase) {
    this.database = database ?? buildAdapterClient('SummaryGrouping');
  }

  /**
   * Get module summary with period-based grouping
   */
  async GetSummaryModuleListByPeriod(params: {
    moduleId: TID;
    period: SUMMARY_PERIOD_ENUM;
    carerID?: TID;
  }): Promise<TSummaryModule> {
    const { moduleId, period, carerID } = params;

    // 1. Get module info
    const [module] = await this.database
      .select()
      .from(DB_SCHEMA.MODULE)
      .where(eq(DB_SCHEMA.MODULE.id, moduleId))
      .limit(1);

    if (!module) {
      throw new Error(`Module ${moduleId} not found`);
    }

    // 1.5 Get module fields
    const moduleFields = await this.database
      .select()
      .from(DB_SCHEMA.MODULE_FIELD)
      .where(eq(DB_SCHEMA.MODULE_FIELD.moduleID, moduleId));

    // 2. Get grouped data
    const groupedData = await this.getGroupedRecordFieldsByModule({
      moduleId,
      period,
      carerID,
    });

    // 3. Calculate statistics
    const statistics = await this.calculateModuleStatistics({
      moduleId,
      period,
      groupedData,
      carerID,
    });

    return {
      module: {
        id: module.id,
        status: module.status,
        createdAt: module.createdAt, // Drizzle timestamp mode returns Date already
        code: getModuleKeyFromValue(module.code),
        name: module.name,
        description: module.description,
        isActive: module.active === 1, // DB uses active (0/1), domain uses isActive (boolean)
        moduleFieldList: moduleFields.map(
          SQLiteModuleFieldAdapter.toDomainEntity
        ),
      },
      groupedData,
      statistics,
    };
  }

  /**
   * Get field summary with period-based grouping
   */
  async getFieldSummary(params: {
    fieldId: TID;
    period: SUMMARY_PERIOD_ENUM;
    carerID?: TID;
  }): Promise<TSummaryModuleField> {
    const { fieldId, period, carerID } = params;

    // 1. Get field info with module
    const [moduleField] = await this.database
      .select()
      .from(DB_SCHEMA.MODULE_FIELD)
      .where(eq(DB_SCHEMA.MODULE_FIELD.id, fieldId))
      .limit(1);

    if (!moduleField) {
      throw new Error(`Field ${fieldId} not found`);
    }

    const [module] = await this.database
      .select()
      .from(DB_SCHEMA.MODULE)
      .where(eq(DB_SCHEMA.MODULE.id, moduleField.moduleID))
      .limit(1);

    if (!module) {
      throw new Error(`Module ${moduleField.moduleID} not found`);
    }

    // 2. Get grouped data
    const groupedData = await this.getGroupedRecordFieldsByField({
      fieldId,
      period,
      carerID,
    });

    // 3. Get value distribution (if applicable)
    const distribution = await this.getFieldValueDistribution({
      fieldId,
      period,
      carerID,
    });

    // 4. Calculate statistics
    const statistics = await this.calculateFieldStatistics({
      fieldId,
      period,
      groupedData,
      carerID,
    });

    return {
      moduleField: {
        id: moduleField.id,
        status: moduleField.status,
        createdAt: moduleField.createdAt,
        moduleId: moduleField.moduleID,
        code: moduleField.code,
        description: moduleField.description ?? '',
        type: getModuleFieldTypeFromValue(moduleField.type),
        values: moduleField.values ?? '',
        required: moduleField.required === 1,
        order: moduleField.order,
      },
      module: {
        id: module.id,
        status: module.status,
        createdAt: module.createdAt,
        code: getModuleKeyFromValue(module.code),
        name: module.name,
        description: module.description,
        isActive: module.active === 1,
      },
      groupedData,
      distribution,
      statistics,
    };
  }

  /**
   * Get multiple modules summary (for home screen)
   */
  async getModulesSummary(params: {
    moduleIdList: TID[];
    period: SUMMARY_PERIOD_ENUM;
    carerID?: TID;
  }): Promise<TSummaryModule[]> {
    const { moduleIdList: moduleIds, period, carerID } = params;

    return Promise.all(
      moduleIds.map((moduleId) =>
        this.GetSummaryModuleListByPeriod({ moduleId, period, carerID })
      )
    );
  }

  // ====================================================================
  // PRIVATE HELPER METHODS
  // ====================================================================

  /**
   * Get grouped RecordFields by module and period
   */
  private async getGroupedRecordFieldsByModule(params: {
    moduleId: TID;
    period: SUMMARY_PERIOD_ENUM;
    carerID?: TID;
  }): Promise<TSummaryPeriodResult> {
    const { moduleId, period, carerID } = params;

    const { startDate, endDate } = this.getDateRangeForPeriod(period);
    const groupByClause = this.buildGroupByClause(period);

    const conditions = [
      eq(DB_SCHEMA.MODULE_FIELD.moduleID, moduleId),
      gte(DB_SCHEMA.RECORD.createdAt, startDate),
      lte(DB_SCHEMA.RECORD.createdAt, endDate),
    ];

    if (carerID) {
      conditions.push(eq(DB_SCHEMA.RECORD.carerID, carerID));
    }

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
      .innerJoin(
        DB_SCHEMA.MODULE_FIELD,
        eq(DB_SCHEMA.RECORD_FIELD.fieldID, DB_SCHEMA.MODULE_FIELD.id)
      )
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

  /**
   * Get grouped RecordFields by field and period
   */
  private async getGroupedRecordFieldsByField(params: {
    fieldId: TID;
    period: SUMMARY_PERIOD_ENUM;
    carerID?: TID;
  }): Promise<TSummaryPeriodResult> {
    const { fieldId, period, carerID } = params;

    const { startDate, endDate } = this.getDateRangeForPeriod(period);
    const groupByClause = this.buildGroupByClause(period);

    const conditions = [
      eq(DB_SCHEMA.RECORD_FIELD.fieldID, fieldId),
      gte(DB_SCHEMA.RECORD.createdAt, startDate),
      lte(DB_SCHEMA.RECORD.createdAt, endDate),
    ];

    if (carerID) {
      conditions.push(eq(DB_SCHEMA.RECORD.carerID, carerID));
    }

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

  /**
   * Calculate module statistics
   */
  private async calculateModuleStatistics(params: {
    moduleId: TID;
    period: SUMMARY_PERIOD_ENUM;
    groupedData: TSummaryPeriodResult;
    carerID?: TID;
  }): Promise<TSummaryStatistics> {
    const { moduleId, period, groupedData, carerID } = params;

    const currentPeriodTotal = groupedData.metadata.totalCount;

    // Get previous period data
    const { startDate: prevStart, endDate: prevEnd } =
      this.getPreviousPeriodDateRange(period);

    const prevConditions = [
      eq(DB_SCHEMA.RECORD.moduleID, moduleId),
      gte(DB_SCHEMA.RECORD.createdAt, prevStart),
      lte(DB_SCHEMA.RECORD.createdAt, prevEnd),
    ];

    if (carerID) {
      prevConditions.push(eq(DB_SCHEMA.RECORD.carerID, carerID));
    }

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
      .where(
        carerID
          ? and(
              eq(DB_SCHEMA.RECORD.moduleID, moduleId),
              eq(DB_SCHEMA.RECORD.carerID, carerID)
            )
          : eq(DB_SCHEMA.RECORD.moduleID, moduleId)
      )
      .orderBy(sql`${DB_SCHEMA.RECORD.createdAt} DESC`)
      .limit(1);

    const lastRecordedAt = lastRecord ? lastRecord.createdAt : new Date(0);

    // TODO: ¿Duplicated code?
    return {
      currentPeriodTotal,
      previousPeriodTotal,
      percentageChange: Math.round(percentageChange * 10) / 10,
      lastRecordedAt,
      currentPeriodAverage: -1,
      previousPeriodAverage: -1,
    };
  }

  /**
   * Calculate field statistics
   */
  private async calculateFieldStatistics(params: {
    fieldId: TID;
    period: SUMMARY_PERIOD_ENUM;
    groupedData: TSummaryPeriodResult;
    carerID?: TID;
  }): Promise<TSummaryStatistics> {
    const { fieldId, period, groupedData, carerID } = params;

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

    if (carerID) {
      prevConditions.push(eq(DB_SCHEMA.RECORD.carerID, carerID));
    }

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

    if (carerID) {
      valueConditions.push(eq(DB_SCHEMA.RECORD.carerID, carerID));
    }

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
    };

    // For SELECT fields, calculate Fibonacci weighted average
    if (moduleField?.type.toUpperCase() === 'SELECT' && moduleField.values) {
      try {
        const availableOptions = JSON.parse(moduleField.values) as string[];

        // Calculate Fibonacci weighted average
        const fibWeights = this.getFibonacciWeights(availableOptions.length);

        // Get distribution for weighting
        const distribution = await this.getFieldValueDistribution({
          fieldId,
          period,
          carerID,
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
          totalCount > 0
            ? Math.round((weightedSum / totalCount) * 10) / 10
            : null;

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
              numericValues.reduce((sum, v) => sum + v, 0) /
              numericValues.length;

            return {
              ...baseStats,
              averageValue: Math.round(averageValue * 10) / 10,
              weightedAverage,
            };
          }
        }

        // Non-numeric SELECT field
        return {
          ...baseStats,
          averageValue: null,
          weightedAverage,
        };
      } catch {
        // Fallback if JSON parsing fails
        return {
          ...baseStats,
          averageValue: null,
          weightedAverage: null,
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

    let averageValue: number | null = null;
    if (numericValues.length > 0) {
      averageValue =
        numericValues.reduce((sum, v) => sum + v, 0) / numericValues.length;
      averageValue = Math.round(averageValue * 10) / 10;
    }

    return {
      ...baseStats,
      averageValue,
      weightedAverage: null, // Only SELECT fields get weighted average
    };
  }

  /**
   * Get field value distribution
   */
  private async getFieldValueDistribution(params: {
    fieldId: TID;
    period: SUMMARY_PERIOD_ENUM;
    carerID?: TID;
  }): Promise<TSummaryModuleField['distribution']> {
    const { fieldId, period, carerID } = params;

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

    if (carerID) {
      conditions.push(eq(DB_SCHEMA.RECORD.carerID, carerID));
    }

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
    if (moduleField?.type === 'SELECT' && moduleField.values) {
      try {
        const availableOptions = JSON.parse(moduleField.values) as string[];

        // Create a map of existing counts
        const countMap = new Map(results.map((r) => [r.value, r.count]));

        // Ensure all options are present, maintaining their original order
        return availableOptions.map((option) => ({
          value: option,
          count: countMap.get(option) ?? 0,
          percentage:
            total > 0
              ? Math.round(((countMap.get(option) ?? 0) / total) * 100 * 10) /
                10
              : 0,
        }));
      } catch {
        // Fallback to regular distribution if JSON parsing fails
      }
    }

    // Regular distribution for non-SELECT fields
    return results.map((r) => ({
      value: r.value,
      count: r.count,
      percentage: total > 0 ? Math.round((r.count / total) * 100 * 10) / 10 : 0,
    }));
  }

  // ====================================================================
  // PERIOD-SPECIFIC HELPERS
  // ====================================================================

  /**
   * Build SQL GROUP BY clause based on period
   */
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

  /**
   * Get date range for period
   */
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
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;

      case SUMMARY_PERIOD_ENUM.WEEK:
        // Last 7 days
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;

      case SUMMARY_PERIOD_ENUM.MONTH:
        // Last 30 days
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;

      case SUMMARY_PERIOD_ENUM.HALF_YEAR:
        // Last 24 weeks
        startDate = new Date(now.getTime() - 24 * 7 * 24 * 60 * 60 * 1000);
        break;

      case SUMMARY_PERIOD_ENUM.YEAR:
        // Last 12 months
        startDate = new Date(now.getFullYear(), 0, 1);
        break;

      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    return { startDate, endDate };
  }

  /**
   * Get previous period date range (for comparison)
   */
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

  /**
   * Fill missing buckets with zero values
   */
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
        const monthNames = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
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

  /**
   * Build typed period result based on period enum
   */
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

  /**
   * Generate Fibonacci weights for SELECT field positions
   * Returns array of Fibonacci numbers: [1, 2, 3, 5, 8, 13, 21, ...]
   */
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
