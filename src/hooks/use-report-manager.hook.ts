import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAdapters } from '@/adapter';
import type { TModule } from '@/domain/module/entity/module.entity';
import { useGetListActiveModule } from '@/domain/module/hook/get-list-active-module.hook';
import { useGetRecordStatistics } from '@/domain/module/hook/get-record-statistics.hook';
import { useGetRecordTrend } from '@/domain/module/hook/get-record-trend.hook';

type RangeKey = 'today' | '7d' | '30d' | '90d';

export function computeTimeRange(range: RangeKey) {
  const end = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const startOfToday = new Date(end.getTime());
  startOfToday.setHours(0, 0, 0, 0);

  let start = new Date(startOfToday.getTime());
  switch (range) {
    case 'today':
      start = startOfToday;
      break;
    case '7d':
      // include today + previous 6 full days
      start = new Date(startOfToday.getTime() - 6 * dayMs);
      break;
    case '30d':
      // include today + previous 29 full days
      start = new Date(startOfToday.getTime() - 29 * dayMs);
      break;
    case '90d':
      // include today + previous 89 full days
      start = new Date(startOfToday.getTime() - 89 * dayMs);
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
          const ts = timeRange.startDate.getTime() + i * 24 * 60 * 60 * 1000;
          const d = new Date(ts);
          const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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

export type TUseReportManager = ReturnType<typeof useReportManager>;
