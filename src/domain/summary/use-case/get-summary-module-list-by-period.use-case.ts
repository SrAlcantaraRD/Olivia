import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';
import {
  RequestGetSummaryModuleListByPeriodSchema,
  type TRequestGetSummaryModuleListByPeriod,
  type TResponseGetSummaryModuleListByPeriod,
} from '@/domain/summary/use-case-schema/get-summary-module-list-by-period.use-case-schema';

/**
 * Unified use case for getting period-based summaries
 * This replaces multiple specialized use cases with a single flexible one
 */
export class GetSummaryModuleListByPeriodUseCase extends BaseUseCase<
  TRequestGetSummaryModuleListByPeriod,
  TResponseGetSummaryModuleListByPeriod
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      cacheAdapter: ICachePort;
      summaryModuleAdapter: ISummaryModulePort;
    }
  ) {
    super('get-summary-by-period', adapters.loggerAdapter);
  }

  public async execute(
    request: TRequestGetSummaryModuleListByPeriod
  ): Promise<IBaseResponse<TResponseGetSummaryModuleListByPeriod>> {
    this.logDebug('GetSummaryByPeriodUseCase', request);

    const parse = this.parseRequest(
      RequestGetSummaryModuleListByPeriodSchema,
      request
    );

    const { period } = parse.data;

    const list = await this.adapters.summaryModuleAdapter.getAll({
      period,
    });

    //TODO: Sort items by date, today`s bar is the 7th, so the bar chart shows from 7 days ago to today incrementally: day 7, day 6, day 5, day 4, day 3, day 2, day 1, today

    return {
      success: true,
      message: 'common.success',
      details: list,
    };
  }
}
