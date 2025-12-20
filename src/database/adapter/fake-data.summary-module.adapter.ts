import type { TID } from '@/domain/core/schemas/id.schema';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';
import type { TSummaryModule } from '@/domain/summary/entity/summary-module.entity';
import type { TSummarySeriesPoint } from '@/domain/summary/entity/summary-series-point.entity';
import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';

const MODULE_SEED: { id: TID; key: MODULE_KEY_ENUM; base: number }[] = [
  { id: 1, key: MODULE_KEY_ENUM.CIC, base: 4 },
  { id: 2, key: MODULE_KEY_ENUM.URINE, base: 6 },
  { id: 3, key: MODULE_KEY_ENUM.STOOL, base: 2 },
  { id: 4, key: MODULE_KEY_ENUM.MEDICATION, base: 1 },
  { id: 5, key: MODULE_KEY_ENUM.ENEMA, base: 0 },
];

function buildSeries(days: number, base: number): TSummarySeriesPoint[] {
  const now = new Date();

  return Array.from({ length: days }).map((_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (days - 1 - index));

    return {
      date: date.toISOString(),
      value: Math.max(0, base + ((index % 3) - 1)),
    };
  });
}

export class FakeDataSummaryModuleAdapter implements ISummaryModulePort {
  public async getModuleSummaries(moduleIds: TID[]): Promise<TSummaryModule[]> {
    const targetIds = new Set(moduleIds);
    const seed =
      moduleIds.length === 0
        ? MODULE_SEED
        : MODULE_SEED.filter((item) => targetIds.has(item.id));

    return seed.map((item) => {
      const last7Days = buildSeries(7, item.base);
      const todayCount = last7Days[last7Days.length - 1]?.value ?? 0;

      return {
        moduleId: item.id,
        moduleKey: item.key,
        todayCount,
        lastRecordedAt: todayCount > 0 ? new Date().toISOString() : null,
        last7Days,
        previousPeriodAverage: item.base,
      } satisfies TSummaryModule;
    });
  }
}
