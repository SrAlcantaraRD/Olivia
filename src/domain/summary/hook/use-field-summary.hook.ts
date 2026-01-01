import { useCallback, useEffect, useState } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import type { TID } from '@/domain/core/schemas/id.schema';
import type { TSummaryModuleField } from '@/domain/summary/entity/summary-field.entity';
import type { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import { GetSummaryModuleListByPeriodUseCase } from '@/domain/summary/use-case/get-summary-module-list-by-period.use-case';

/**
 * Hook for getting field summary with period-based grouping
 * Autonomous hook that directly consumes the use-case
 */
export const useFieldSummary = (params: {
  fieldId: TID;
  period: SUMMARY_PERIOD_ENUM;
  loggerAdapter: TLoggerPort;
  summaryGroupingPort: ISummaryGroupingPort;
  notifyAdapter: INotifyPort;
}) => {
  const { fieldId, period, loggerAdapter, summaryGroupingPort, notifyAdapter } =
    params;

  const [data, setData] = useState<TSummaryModuleField | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      loggerAdapter.info('useFieldSummary: Fetching field summary', {
        fieldId,
        period,
      });

      const useCase = new GetSummaryModuleListByPeriodUseCase(
        summaryGroupingPort
      );
      const result = await useCase.execute({
        fieldId,
        period,
      });

      setData(result);

      loggerAdapter.info(
        'useFieldSummary: Successfully fetched field summary',
        {
          fieldId,
          period,
          totalCount: result.groupedData.metadata.totalCount,
        }
      );
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);

      loggerAdapter.error('useFieldSummary: Failed to fetch field summary', {
        error: errorObj,
        fieldId,
        period,
      });

      notifyAdapter.error('summary.error.failed-to-load-field-summary');
    } finally {
      setLoading(false);
    }
  }, [fieldId, period, loggerAdapter, summaryGroupingPort, notifyAdapter]);

  useEffect(() => {
    void execute();
  }, [execute]);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
};
