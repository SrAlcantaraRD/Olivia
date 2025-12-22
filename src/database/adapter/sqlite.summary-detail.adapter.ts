import { subDays, subMonths, subWeeks, subYears } from 'date-fns';
import { and, count, eq, gte, lte, sql } from 'drizzle-orm';

import {
  buildAdapterClient,
  type TAppDatabase,
} from '@/database/config/database.config';
import * as DB_SCHEMA from '@/database/schema';
import type { TID } from '@/domain/core/schemas/id.schema';
import type { TSummaryDetail } from '@/domain/summary/entity/summary-detail.entity';
import { SUMMARY_DETAIL_TYPE_ENUM } from '@/domain/summary/enum/summary-detail-type.enum';
import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import type { ISummaryDetailPort } from '@/domain/summary/port/summary-detail.port';

export class SQLiteSummaryDetailAdapter implements ISummaryDetailPort {
  private readonly database: TAppDatabase;

  constructor(database?: TAppDatabase) {
    this.database = database ?? buildAdapterClient('SummaryDetail');
  }

  public async getSummaryDetailByModule(params: {
    moduleId: TID;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryDetail> {
    const { moduleId, period } = params;

    const series = await this.getSeriesForModule(moduleId, period);
    const average = this.calculateAverage(series);
    const todayValue = await this.getTodayValueForModule(moduleId);

    // Get module info
    const moduleResult = await this.database
      .select({ code: DB_SCHEMA.MODULE.code, name: DB_SCHEMA.MODULE.name })
      .from(DB_SCHEMA.MODULE)
      .where(eq(DB_SCHEMA.MODULE.id, moduleId))
      .limit(1);

    const module = moduleResult[0];

    return {
      type: SUMMARY_DETAIL_TYPE_ENUM.MODULE,
      targetId: moduleId.toString(),
      titleKey: `summary.detail.module.${module?.code ?? 'unknown'}.title`,
      descriptionKey: `summary.detail.module.${module?.code ?? 'unknown'}.description`,
      analysisText: 'Analysis placeholder', // TODO: integrate analysis port
      series,
      average,
      todayValue,
      comparisonTextKey: null,
      projectionTextKey: null,
    };
  }

  public async getSummaryDetailByField(params: {
    moduleId: TID;
    fieldId: TID;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryDetail> {
    const { moduleId, fieldId, period } = params;

    const series = await this.getSeriesForField(fieldId, period);
    const average = this.calculateAverage(series);
    const todayValue = await this.getTodayValueForField(fieldId);

    // Get field info
    const fieldResult = await this.database
      .select({ title: DB_SCHEMA.MODULE_FIELD.title })
      .from(DB_SCHEMA.MODULE_FIELD)
      .where(eq(DB_SCHEMA.MODULE_FIELD.id, fieldId))
      .limit(1);

    const field = fieldResult[0];

    return {
      type: SUMMARY_DETAIL_TYPE_ENUM.FIELD,
      targetId: `${moduleId}-${fieldId}`,
      titleKey: `summary.detail.field.${field?.title ?? 'unknown'}.title`,
      descriptionKey: `summary.detail.field.${field?.title ?? 'unknown'}.description`,
      analysisText: 'Analysis placeholder',
      series,
      average,
      todayValue,
      comparisonTextKey: null,
      projectionTextKey: null,
    };
  }

  public async getSummaryDetailByTrend(params: {
    trendId: string;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryDetail> {
    const { trendId, period } = params;

    // For trends, since no specific data, use placeholder series
    const series = this.getPlaceholderSeries(period);

    return {
      type: SUMMARY_DETAIL_TYPE_ENUM.TREND,
      targetId: trendId,
      titleKey: `summary.detail.trend.${trendId}.title`,
      descriptionKey: `summary.detail.trend.${trendId}.description`,
      analysisText: 'Analysis placeholder',
      series,
      average: this.calculateAverage(series),
      todayValue: null,
      comparisonTextKey: null,
      projectionTextKey: null,
    };
  }

  private async getSeriesForModule(
    moduleId: TID,
    period: SUMMARY_PERIOD_ENUM
  ): Promise<{ date: string; value: number }[]> {
    const dateRange = this.getDateRangeForPeriod(period);
    const dateFormat = this.getDateFormatForPeriod(period);

    const result = await this.database
      .select({
        date: sql<string>`strftime('${sql.raw(dateFormat)}', datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch'))`,
        value: count(),
      })
      .from(DB_SCHEMA.RECORD)
      .where(
        and(
          eq(DB_SCHEMA.RECORD.moduleID, moduleId),
          gte(DB_SCHEMA.RECORD.createdAt, dateRange.start),
          lte(DB_SCHEMA.RECORD.createdAt, dateRange.end)
        )
      )
      .groupBy(
        sql`strftime('${sql.raw(dateFormat)}', datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch'))`
      )
      .orderBy(
        sql`strftime('${sql.raw(dateFormat)}', datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch'))`
      );

    return result;
  }

  private async getSeriesForField(
    fieldId: TID,
    period: SUMMARY_PERIOD_ENUM
  ): Promise<{ date: string; value: number }[]> {
    const dateRange = this.getDateRangeForPeriod(period);
    const dateFormat = this.getDateFormatForPeriod(period);

    const result = await this.database
      .select({
        date: sql<string>`strftime('${sql.raw(dateFormat)}', datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch'))`,
        value: count(),
      })
      .from(DB_SCHEMA.RECORD_FIELD)
      .innerJoin(
        DB_SCHEMA.RECORD,
        eq(DB_SCHEMA.RECORD_FIELD.recordID, DB_SCHEMA.RECORD.id)
      )
      .where(
        and(
          eq(DB_SCHEMA.RECORD_FIELD.fieldID, fieldId),
          gte(DB_SCHEMA.RECORD.createdAt, dateRange.start),
          lte(DB_SCHEMA.RECORD.createdAt, dateRange.end)
        )
      )
      .groupBy(
        sql`strftime('${sql.raw(dateFormat)}', datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch'))`
      )
      .orderBy(
        sql`strftime('${sql.raw(dateFormat)}', datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch'))`
      );

    return result;
  }

  private getPlaceholderSeries(
    period: SUMMARY_PERIOD_ENUM
  ): { date: string; value: number }[] {
    // Placeholder for trends - generate correct number of bars per period
    const count = this.getBarCountForPeriod(period);
    const now = new Date();

    return Array.from({ length: count }, (_, i) => {
      let date: Date;
      let dateStr: string;

      switch (period) {
        case SUMMARY_PERIOD_ENUM.DAY:
          // 24 hours
          date = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
          dateStr = date.toISOString().slice(0, 13); // YYYY-MM-DDTHH
          break;
        case SUMMARY_PERIOD_ENUM.WEEK:
          // 7 days
          date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
          dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
          break;
        case SUMMARY_PERIOD_ENUM.MONTH: {
          // Days in current month
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          date = new Date(monthStart.getTime() + i * 24 * 60 * 60 * 1000);
          dateStr = date.toISOString().split('T')[0];
          break;
        }
        case SUMMARY_PERIOD_ENUM.HALF_YEAR:
          // 6 months
          date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
          dateStr = date.toISOString().slice(0, 7); // YYYY-MM
          break;
        case SUMMARY_PERIOD_ENUM.YEAR:
          // 12 months
          date = new Date(now.getFullYear(), i, 1);
          dateStr = date.toISOString().slice(0, 7); // YYYY-MM
          break;
        default:
          date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
          dateStr = date.toISOString().split('T')[0];
      }

      return {
        date: dateStr,
        value: Math.floor(Math.random() * 10), // Random placeholder
      };
    });
  }

  private getBarCountForPeriod(period: SUMMARY_PERIOD_ENUM): number {
    switch (period) {
      case SUMMARY_PERIOD_ENUM.DAY:
        return 24; // Hours
      case SUMMARY_PERIOD_ENUM.WEEK:
        return 7; // Days
      case SUMMARY_PERIOD_ENUM.MONTH: {
        // Days in current month
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      }
      case SUMMARY_PERIOD_ENUM.HALF_YEAR:
        return 6; // Months
      case SUMMARY_PERIOD_ENUM.YEAR:
        return 12; // Months
      default:
        return 7;
    }
  }

  private async getTodayValueForModule(moduleId: TID): Promise<number | null> {
    const result = await this.database
      .select({ count: count() })
      .from(DB_SCHEMA.RECORD)
      .where(
        and(
          eq(DB_SCHEMA.RECORD.moduleID, moduleId),
          sql`strftime('%Y-%m-%d', datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch')) = strftime('%Y-%m-%d', 'now')`
        )
      );

    return result[0]?.count ?? null;
  }

  private async getTodayValueForField(fieldId: TID): Promise<number | null> {
    const result = await this.database
      .select({ count: count() })
      .from(DB_SCHEMA.RECORD_FIELD)
      .innerJoin(
        DB_SCHEMA.RECORD,
        eq(DB_SCHEMA.RECORD_FIELD.recordID, DB_SCHEMA.RECORD.id)
      )
      .where(
        and(
          eq(DB_SCHEMA.RECORD_FIELD.fieldID, fieldId),
          sql`strftime('%Y-%m-%d', datetime(${DB_SCHEMA.RECORD.createdAt}, 'unixepoch')) = strftime('%Y-%m-%d', 'now')`
        )
      );

    return result[0]?.count ?? null;
  }

  private getDateRangeForPeriod(period: SUMMARY_PERIOD_ENUM): {
    start: Date;
    end: Date;
  } {
    const now = new Date();
    let start: Date;

    switch (period) {
      case SUMMARY_PERIOD_ENUM.DAY:
        start = subDays(now, 1);
        break;
      case SUMMARY_PERIOD_ENUM.WEEK:
        start = subWeeks(now, 1);
        break;
      case SUMMARY_PERIOD_ENUM.MONTH:
        start = subMonths(now, 1);
        break;
      case SUMMARY_PERIOD_ENUM.HALF_YEAR:
        start = subMonths(now, 6);
        break;
      case SUMMARY_PERIOD_ENUM.YEAR:
        start = subYears(now, 1);
        break;
      default:
        start = subWeeks(now, 7);
    }

    return {
      start,
      end: now,
    };
  }

  private getDaysForPeriod(period: SUMMARY_PERIOD_ENUM): number {
    switch (period) {
      case SUMMARY_PERIOD_ENUM.DAY:
        return 1;
      case SUMMARY_PERIOD_ENUM.WEEK:
        return 7;
      case SUMMARY_PERIOD_ENUM.MONTH:
        return 30;
      case SUMMARY_PERIOD_ENUM.HALF_YEAR:
        return 180;
      case SUMMARY_PERIOD_ENUM.YEAR:
        return 365;
      default:
        return 7;
    }
  }

  private getDateFormatForPeriod(period: SUMMARY_PERIOD_ENUM): string {
    switch (period) {
      case SUMMARY_PERIOD_ENUM.DAY:
        return '%Y-%m-%d %H'; // Hour
      case SUMMARY_PERIOD_ENUM.WEEK:
        return '%Y-%m-%d'; // Day
      case SUMMARY_PERIOD_ENUM.MONTH:
        return '%Y-%m-%d'; // Day
      case SUMMARY_PERIOD_ENUM.HALF_YEAR:
        return '%Y-%m'; // Month
      case SUMMARY_PERIOD_ENUM.YEAR:
        return '%Y-%m'; // Month
      default:
        return '%Y-%m-%d';
    }
  }

  private calculateAverage(
    series: { date: string; value: number }[]
  ): number | null {
    if (series.length === 0) return null;
    const total = series.reduce((sum, point) => sum + point.value, 0);
    return total / series.length;
  }
}
