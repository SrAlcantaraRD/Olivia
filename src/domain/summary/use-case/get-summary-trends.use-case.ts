import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ISummaryTrendPort } from '@/domain/summary/port/summary-trend.port';
import type {
  TRequestGetSummaryTrends,
  TResponseGetSummaryTrends,
} from '@/domain/summary/use-case-schema/get-summary-trends.use-case-schema';

export class GetSummaryTrendsUseCase extends BaseUseCase<
  TRequestGetSummaryTrends,
  TResponseGetSummaryTrends
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      summaryTrendAdapter: ISummaryTrendPort;
    }
  ) {
    super('get-summary-trends', adapters.loggerAdapter);
  }

  public async execute(): Promise<IBaseResponse<TResponseGetSummaryTrends>> {
    const items = await this.adapters.summaryTrendAdapter.listSummaryTrends();

    return {
      success: true,
      message: 'common.success',
      details: {
        items,
      },
    };
  }
}
