import { useCallback } from 'react';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type {
  IHookResponse,
  IUseHook,
} from '@/domain/core/interface/hook.interface';
import type { INotifyPort } from '@/domain/core/port/notify.port';
import { useListStore } from '@/domain/core/stores/list.store';
import type { Ti18nKeys } from '@/domain/core/types/i18n.types';
import type { TSummaryDetail } from '@/domain/summary/entity/summary-detail.entity';
import { SUMMARY_DETAIL_TYPE_ENUM } from '@/domain/summary/enum/summary-detail-type.enum';
import type { ISummaryDetailPort } from '@/domain/summary/port/summary-detail.port';
import { GetSummaryDetailUseCase } from '@/domain/summary/use-case/get-summary-detail.use-case';
import type { TRequestGetSummaryDetail } from '@/domain/summary/use-case-schema/get-summary-detail.use-case-schema';

export function useGetSummaryDetail(adapters: {
  loggerAdapter: TLoggerPort;
  summaryDetailAdapter: ISummaryDetailPort;
  notifyAdapter: INotifyPort;
}): IUseHook<TRequestGetSummaryDetail, TSummaryDetail> {
  const {
    actions: { saveItems, getItems, isLoading, startLoading, stopLoading },
  } = useListStore<TSummaryDetail>('summary-detail');

  const { loggerAdapter, summaryDetailAdapter, notifyAdapter } = adapters;

  const execute = useCallback(
    async (
      data: TRequestGetSummaryDetail
    ): Promise<IHookResponse<TSummaryDetail>> => {
      startLoading();
      try {
        const useCase = new GetSummaryDetailUseCase({
          loggerAdapter,
          summaryDetailAdapter,
        });

        const response = await useCase.execute(data);

        if (!response.success || !response.details) {
          notifyAdapter.error({
            title: 'hook.get-summary-detail.error' as Ti18nKeys,
            description: response.message,
          });
          return { success: false };
        }

        saveItems([response.details]);

        return { success: true, data: response.details };
      } catch (error) {
        loggerAdapter.error('useGetSummaryDetail.execute', error);
        return { success: false };
      } finally {
        stopLoading();
      }
    },
    [loggerAdapter, summaryDetailAdapter, notifyAdapter]
  );

  const items = getItems()[0] ?? {
    type: SUMMARY_DETAIL_TYPE_ENUM.MODULE,
    targetId: '',
    titleKey: '',
    descriptionKey: '',
    analysisText: null,
    series: [],
    average: null,
    todayValue: null,
    comparisonTextKey: null,
    projectionTextKey: null,
  };

  return {
    execute,
    isExecuting: isLoading(),
    items,
  };
}
