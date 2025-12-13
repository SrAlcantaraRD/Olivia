import { addDays, endOfDay, format, startOfDay, subDays } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAdapters } from '@/adapter';
import { TIME_RANGE_ENUM } from '@/domain/core/enum/time-range.enum';
import type { TModule } from '@/domain/module/entity/module.entity';
import { useGetListActiveModule } from '@/domain/module/hook/get-list-active-module.hook';
import { useGetRecordStatistics } from '@/domain/module/hook/get-record-statistics.hook';
import { useGetRecordTrend } from '@/domain/module/hook/get-record-trend.hook';

export type RangeKey = TIME_RANGE_ENUM;

interface ModuleStatisticsData {
  count: number;
  trend: number[];
  numDays: number;
}

interface ReportData {
  stats?: Array<{ moduleID: number; count: number }>;
  trendByModule: Record<number, number[]>;
  timeRange: { startDate: Date; endDate: Date };
}

/**
 * Calculate statistics data for a given module within a report.
 * Encapsulates the logic for count, trend, and numDays calculations.
 */
export function getModuleStatisticsData(
  module: TModule,
  report: ReportData
): ModuleStatisticsData {
  const moduleId = module.id;
  const item = report.stats?.find((s) => s.moduleID === moduleId);
  const count = item?.count ?? 0;
  const moduleTrend = report.trendByModule[moduleId];

  const numDays =
    Math.floor(
      (report.timeRange.endDate.getTime() -
        report.timeRange.startDate.getTime()) /
        (24 * 60 * 60 * 1000)
    ) + 1;

  const trend = moduleTrend?.length ? moduleTrend : Array(numDays).fill(0);

  return { count, trend, numDays };
}

export function computeTimeRange(range: RangeKey) {
  const end = endOfDay(new Date());
  const today = startOfDay(end);

  let start: Date;
  switch (range) {
    case TIME_RANGE_ENUM.TODAY:
      start = today;
      break;
    case TIME_RANGE_ENUM.WEEK_7D:
      // include today + previous 6 full days
      start = subDays(today, 6);
      break;
    case TIME_RANGE_ENUM.MONTH_30D:
      // include today + previous 29 full days
      start = subDays(today, 29);
      break;
    case TIME_RANGE_ENUM.QUARTER_90D:
      // include today + previous 89 full days
      start = subDays(today, 89);
      break;
  }

  return { startDate: start, endDate: end } as {
    startDate: Date;
    endDate: Date;
  };
}

export function useModuleStatistics(options?: {
  defaultRange?: RangeKey;
  perModuleConcurrency?: number;
}) {
  const { recordAdapter, notifyAdapter, moduleAdapter, loggerAdapter } =
    useAdapters();

  const defaultRange = options?.defaultRange ?? TIME_RANGE_ENUM.WEEK_7D;
  const concurrency = options?.perModuleConcurrency ?? 4;

  // domain hooks (they expect adapters)
  const {
    isExecuting: isLoadingModules,
    execute: executeGetActiveModules,
    items: activeModules,
  } = useGetListActiveModule({ loggerAdapter, moduleAdapter, notifyAdapter });

  const { execute: executeGetStats, items: statsItems } =
    useGetRecordStatistics({
      loggerAdapter,
      recordAdapter,
      notifyAdapter,
    });

  const { execute: executeGetTrend, items: trendItems } = useGetRecordTrend({
    loggerAdapter,
    recordAdapter,
    notifyAdapter,
  });

  const [range, setRange] = useState<RangeKey>(defaultRange);
  const timeRange = useMemo(() => computeTimeRange(range), [range]);

  const visibleModules = useMemo(() => {
    return (activeModules ?? []).filter((m: TModule) => {
      const maybe = m as unknown as { isActive?: boolean };
      return maybe.isActive !== false;
    }) as TModule[];
  }, [activeModules]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(false);
  const [isLoadingTrend, setIsLoadingTrend] = useState<boolean>(false);

  // per-module numeric series ready for sparklines
  const [trendByModule, setTrendByModule] = useState<Record<number, number[]>>(
    {}
  );

  const refreshModule = useCallback(
    async (moduleId: number) => {
      try {
        const resp = await executeGetTrend({
          startDate: timeRange.startDate,
          endDate: timeRange.endDate,
          moduleID: moduleId,
        });
        const series = resp.success ? (resp.data ?? []) : [];

        const numDays =
          Math.floor(
            (timeRange.endDate.getTime() - timeRange.startDate.getTime()) /
              (24 * 60 * 60 * 1000)
          ) + 1;
        const dayMap: Record<string, number> = {};
        series.forEach((s: { day: string; count: number }) => {
          dayMap[s.day] = s.count;
        });

        const counts = Array.from({ length: numDays }, (_, i) => {
          const d = addDays(timeRange.startDate, i);
          const day = format(d, 'yyyy-MM-dd');
          return dayMap[day] ?? 0;
        });

        setTrendByModule((prev) => ({ ...prev, [moduleId]: counts }));
      } catch (_err) {
        // on failure, keep previous or set zeros
        setTrendByModule((prev) => ({
          ...prev,
          [moduleId]: prev[moduleId] ?? [],
        }));
        // notify if needed
        notifyAdapter.error({
          title: 'common.error',
          description: 'common.error',
        });
      }
    },
    [executeGetTrend, notifyAdapter, timeRange.startDate, timeRange.endDate]
  );

  // simple concurrency-limited fetch by chunking
  async function fetchModuleTrends(modules: TModule[]) {
    const chunks: TModule[][] = [];
    for (let i = 0; i < modules.length; i += concurrency)
      chunks.push(modules.slice(i, i + concurrency));

    for (const chunk of chunks) {
      await Promise.all(chunk.map((m) => refreshModule(m.id as number)));
    }
  }

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      setIsLoadingStats(true);
      await executeGetStats({
        startDate: timeRange.startDate,
        endDate: timeRange.endDate,
      });
      setIsLoadingStats(false);

      setIsLoadingTrend(true);
      // global trend
      await executeGetTrend({
        startDate: timeRange.startDate,
        endDate: timeRange.endDate,
      });

      // per-module trends for visible modules
      await fetchModuleTrends(visibleModules ?? []);
      setIsLoadingTrend(false);
    } catch (_err) {
      setIsLoadingStats(false);
      setIsLoadingTrend(false);
      notifyAdapter.error({
        title: 'common.error',
        description: 'common.error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [notifyAdapter, timeRange.startDate, timeRange.endDate, visibleModules]);

  useEffect(() => {
    // initial load
    executeGetActiveModules();
  }, []);

  // when visible modules or timeRange changes, refresh stats/trends
  useEffect(() => {
    // do not block UI — call refresh
    void refresh();
  }, [timeRange.startDate, timeRange.endDate, visibleModules.length]);

  const getModuleSeries = useCallback(
    (moduleId: number) => trendByModule[moduleId],
    [trendByModule]
  );

  return {
    visibleModules,
    stats: statsItems?.countsByModule ?? [],
    globalTrend: trendItems ?? [],
    trendByModule,
    timeRange,
    range,
    setRange,
    isLoading,
    isLoadingModules,
    isLoadingStats,
    isLoadingTrend,
    refresh,
    refreshModule,
    getModuleSeries,
  } as const;
}
