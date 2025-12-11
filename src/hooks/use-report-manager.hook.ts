import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAdapters } from '@/adapter';
import type { TModule } from '@/domain/module/entity/module.entity';
import { useGetListActiveModule } from '@/domain/module/hook/get-list-active-module.hook';
import { useGetRecordStatistics } from '@/domain/module/hook/get-record-statistics.hook';
import { useGetRecordTrend } from '@/domain/module/hook/get-record-trend.hook';

type RangeKey = 'today' | '7d' | '30d' | '90d';

export function computeTimeRange(range: RangeKey) {
  const end = new Date();
  let start = new Date(end.getTime());

  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case '7d':
      start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
  }

  return { startDate: start, endDate: end } as {
    startDate: Date;
    endDate: Date;
  };
}

export function useReportManager(options?: {
  defaultRange?: RangeKey;
  perModuleConcurrency?: number;
}) {
  const { recordAdapter, notifyAdapter, moduleAdapter, loggerAdapter } =
    useAdapters();

  const defaultRange = options?.defaultRange ?? '7d';
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
    return (activeModules ?? []).filter((module: TModule) => {
      return module.isActive !== false;
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
          const ts = timeRange.startDate.getTime() + i * 24 * 60 * 60 * 1000;
          const day = new Date(ts).toISOString().slice(0, 10);
          return dayMap[day] ?? 0;
        });

        setTrendByModule((prev) => ({ ...prev, [moduleId]: counts }));
      } catch (err) {
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
      await Promise.all(chunk.map((module) => refreshModule(module.id)));
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
    } catch (err) {
      setIsLoadingStats(false);
      setIsLoadingTrend(false);
      notifyAdapter.error({
        title: 'common.error',
        description: 'common.error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    executeGetStats,
    executeGetTrend,
    fetchModuleTrends,
    notifyAdapter,
    timeRange.startDate,
    timeRange.endDate,
    visibleModules,
  ]);

  useEffect(() => {
    // initial load
    executeGetActiveModules();
    // refresh after modules are fetched (effect below handles when visibleModules changes)
  }, [executeGetActiveModules]);

  // when visible modules or timeRange changes, refresh stats/trends
  useEffect(() => {
    // do not block UI — call refresh
    void refresh();
  }, [timeRange.startDate, timeRange.endDate, visibleModules.length, refresh]);

  const getModuleSeries = useCallback(
    (moduleId: number) => trendByModule[moduleId],
    [trendByModule]
  );

  return {
    visibleModules,
    stats: statsItems ?? [],
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

export type TUseReportManager = ReturnType<typeof useReportManager>;
