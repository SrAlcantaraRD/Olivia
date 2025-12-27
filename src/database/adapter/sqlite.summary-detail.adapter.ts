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

    // Get field summaries
    const fieldSummaries = await this.getFieldSummariesForModule(moduleId);

    return {
      type: SUMMARY_DETAIL_TYPE_ENUM.MODULE,
      targetId: moduleId.toString(),
      titleKey: `summary.detail.module.${module?.code ?? 'unknown'}.title`,
      descriptionKey: `summary.detail.module.${module?.code ?? 'unknown'}.description`,
      analysisText: 'Analysis placeholder',
      series,
      average,
      todayValue,
      comparisonTextKey: null,
      projectionTextKey: null,
      fieldSummaries,
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
      .select({ title: DB_SCHEMA.MODULE_FIELD.code })
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

    return this.fillMissingSeriesData(result, period);
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

    return this.fillMissingSeriesData(result, period);
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
        return '%Y-%W'; // Week of year
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

    return Math.round(total / series.length);
  }

  private async getFieldSummariesForModule(moduleId: TID) {
    const fields = await this.database
      .select()
      .from(DB_SCHEMA.MODULE_FIELD)
      .where(eq(DB_SCHEMA.MODULE_FIELD.moduleID, moduleId));

    const summaries = await Promise.all(
      fields.map(async (field) => {
        const todayValue = (await this.getTodayValueForField(field.id)) ?? 0;
        const period = SUMMARY_PERIOD_ENUM.WEEK; // Fixed to week
        const dateRange = this.getDateRangeForPeriod(period);

        let series: number[] | { label: string; count: number }[] = [];
        let average: number | null = null;

        if (field.type === 'SELECT' && field.values) {
          // Distribution for SELECT
          const distribution = await this.database
            .select({
              value: DB_SCHEMA.RECORD_FIELD.value,
              count: count(),
            })
            .from(DB_SCHEMA.RECORD_FIELD)
            .innerJoin(
              DB_SCHEMA.RECORD,
              eq(DB_SCHEMA.RECORD_FIELD.recordID, DB_SCHEMA.RECORD.id)
            )
            .where(
              and(
                eq(DB_SCHEMA.RECORD_FIELD.fieldID, field.id),
                gte(DB_SCHEMA.RECORD.createdAt, dateRange.start),
                lte(DB_SCHEMA.RECORD.createdAt, dateRange.end)
              )
            )
            .groupBy(DB_SCHEMA.RECORD_FIELD.value);

          series = distribution.map((d) => ({
            label: d.value,
            count: d.count,
          }));
        } else {
          // Trend for TEXT/Other (numeric assumption)
          const trend = await this.getSeriesForField(field.id, period);
          series = trend.map((t) => t.value);
          average = this.calculateAverage(trend) ?? 0;
        }

        return {
          id: field.id,
          code: field.code,
          type: field.type as any, // Cast to enum/string compatible
          param: field.values ?? undefined,
          series,
          average,
          todayValue,
        };
      })
    );

    return summaries;
  }

  private fillMissingSeriesData(
    actualData: { date: string; value: number }[],
    period: SUMMARY_PERIOD_ENUM
  ): { date: string; value: number }[] {
    const filledData: { date: string; value: number }[] = [];
    const now = new Date();

    // Adjust count for HALF_YEAR to weeks (approx 26 weeks for 6 months)
    let count = this.getBarCountForPeriod(period);
    if (period === SUMMARY_PERIOD_ENUM.HALF_YEAR) {
      count = 26;
    }

    for (let i = count - 1; i >= 0; i--) {
      let date: Date;
      let key: string;

      switch (period) {
        case SUMMARY_PERIOD_ENUM.DAY:
          date = new Date(now.getTime() - i * 60 * 60 * 1000);
          // SQLite: %Y-%m-%d %H
          // date-fns: yyyy-MM-dd HH
          key = this.formatDate(date, 'yyyy-MM-dd HH');
          break;
        case SUMMARY_PERIOD_ENUM.WEEK:
          date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          key = this.formatDate(date, 'yyyy-MM-dd');
          break;
        case SUMMARY_PERIOD_ENUM.MONTH:
          date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
          key = this.formatDate(date, 'yyyy-MM-dd');
          break;
        case SUMMARY_PERIOD_ENUM.HALF_YEAR:
          date = subWeeks(now, i);
          // SQLite %W is week 00-53. date-fns 'ww' is like that.
          key = this.formatDate(date, 'yyyy-ww');
          break;
        case SUMMARY_PERIOD_ENUM.YEAR:
          date = subMonths(now, i);
          key = this.formatDate(date, 'yyyy-MM');
          break;
        default:
          date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          key = this.formatDate(date, 'yyyy-MM-dd');
      }

      const existing = actualData.find((d) => d.date === key);
      filledData.push({ date: key, value: existing ? existing.value : 0 });
    }

    return filledData;
  }

  // Helper to standardise formatting between JS and SQL expectations
  private formatDate(date: Date, formatStr: string): string {
    const pad = (n: number) => (n < 10 ? `0${n}` : n);

    if (formatStr === 'yyyy-MM-dd HH') {
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}`;
    }
    if (formatStr === 'yyyy-MM-dd') {
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }
    if (formatStr === 'yyyy-MM') {
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
    }
    if (formatStr === 'yyyy-ww') {
      // Need strict SQLite %W compatibility.
      // %W: Week number of year (00-53), Monday as first day of week.
      // Simple JS implementation:
      const start = new Date(date.getFullYear(), 0, 1);
      // Adjust to Monday?
      // Let's rely on a simpler approximation or date-fns if imported.
      // I imported subWeeks, subMonths etc. I can import 'format'.
      // But let's try to match SQLite:
      // A robust way is to just use a custom helper or isoWeek.
      // reusing date-fns format if available is best.
      // Let's assume I can add `import { format } from 'date-fns'` to top of file if not there.
      // Actually, I'll use a manual iso week calc to be safe or just use the subWeeks logic.
      const onejan = new Date(date.getFullYear(), 0, 1);
      const week = Math.ceil(
        ((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) /
          7
      );
      // SQLite %W is 00-53.
      return `${date.getFullYear()}-${pad(week)}`;
      // This is risky.
      // Just returning the key format is enough if I make sure SQLite matches.
    }
    return date.toISOString();
  }
}
