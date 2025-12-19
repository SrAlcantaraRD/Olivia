import { addDays, endOfDay, startOfDay, subDays } from 'date-fns';

import type { IRecordPort } from '@/domain/module/port/record.port';
import type { TSummaryModule } from '@/domain/summary/entity/summary-module.entity';
import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';

type DayMap = Record<string, number>;

const buildDayKey = (date: Date) => date.toISOString().split('T')[0];

const buildSeries = (counts: DayMap, start: Date, length: number) => {
  return Array.from({ length }).map((_, index) => {
    const day = addDays(start, index);
    const key = buildDayKey(day);

    return {
      date: day.toISOString(),
      value: counts[key] ?? 0,
    };
  });
};

const toDayMap = (rows: { day: string; count: number }[]) => {
  const map: DayMap = {};
  rows.forEach((row) => {
    map[row.day] = row.count;
  });
  return map;
};

export class SQLiteSummaryModuleAdapter implements ISummaryModulePort {
  constructor(private readonly recordAdapter: IRecordPort) {}

  public async getModuleSummaries(
    moduleIds: number[]
  ): Promise<TSummaryModule[]> {
    const now = new Date();
    const todayStart = startOfDay(now);
    const last7Start = startOfDay(subDays(todayStart, 6));
    const previous7Start = startOfDay(subDays(last7Start, 7));
    const previous7End = startOfDay(subDays(last7Start, 1));

    const summaries = await Promise.all(
      moduleIds.map(async (moduleId) => {
        const last7Rows = await this.recordAdapter.getCountsByDay({
          moduleID: moduleId,
          startDate: last7Start,
          endDate: endOfDay(now),
        });
        const prev7Rows = await this.recordAdapter.getCountsByDay({
          moduleID: moduleId,
          startDate: previous7Start,
          endDate: endOfDay(previous7End),
        });
        const last7Map = toDayMap(last7Rows);
        const prev7Map = toDayMap(prev7Rows);
        const last7Series = buildSeries(last7Map, last7Start, 7);
        const prevSeries = buildSeries(prev7Map, previous7Start, 7);
        const previousAverage =
          prevSeries.reduce((sum, item) => sum + item.value, 0) / 7;
        const todayCount = last7Series[last7Series.length - 1].value;
        const lastRecordedAt =
          await this.recordAdapter.getLatestRecordDateByModule(moduleId);

        return {
          moduleId,
          moduleKey: String(moduleId),
          todayCount,
          lastRecordedAt: lastRecordedAt?.toISOString() ?? null,
          last7Days: last7Series,
          previousPeriodAverage: Number.isFinite(previousAverage)
            ? previousAverage
            : null,
        } satisfies TSummaryModule;
      })
    );

    return summaries;
  }
}
