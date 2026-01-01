import { type TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { ISummaryModuleFieldPort } from '@/domain/summary/port/summary-module-field.port';
import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';
import {
  RequestGetSummaryModuleDetailByPeriodSchema,
  type TRequestGetSummaryModuleDetailByPeriod,
  type TResponseGetSummaryModuleDetailByPeriod,
} from '@/domain/summary/use-case-schema/get-summary-module-detail-by-period.use-case-schema';

/**
 * Unified use case for getting period-based summaries
 * This replaces multiple specialized use cases with a single flexible one
 */
export class GetSummaryModuleDetailByPeriodUseCase extends BaseUseCase<
  TRequestGetSummaryModuleDetailByPeriod,
  TResponseGetSummaryModuleDetailByPeriod
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      cacheAdapter: ICachePort;
      summaryModuleAdapter: ISummaryModulePort;
      summaryModuleFieldAdapter: ISummaryModuleFieldPort;
    }
  ) {
    super('get-summary-by-period', adapters.loggerAdapter);
  }

  public async execute(
    request: TRequestGetSummaryModuleDetailByPeriod
  ): Promise<IBaseResponse<TResponseGetSummaryModuleDetailByPeriod>> {
    this.logDebug('GetSummaryByPeriodUseCase', request);

    const parse = this.parseRequest(
      RequestGetSummaryModuleDetailByPeriodSchema,
      request
    );

    const { period, moduleID } = parse.data;

    const detail = await this.adapters.summaryModuleAdapter.getDetails({
      id: moduleID,
      period,
    });

    const summaryModuleFieldList =
      await this.adapters.summaryModuleFieldAdapter.getByModuleID({
        moduleID,
        period,
      });
    // this.adapters.loggerAdapter.error({ summaryModuleFieldList });

    detail.summaryModuleFieldList = summaryModuleFieldList;

    return {
      success: true,
      message: 'common.success',
      details: detail,
    };
  }
}
