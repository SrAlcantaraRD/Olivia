import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ISummaryDataPort } from '@/domain/summary/port/summary-data.port';
import type {
  TRequestGetSummaryHighlights,
  TResponseGetSummaryHighlights,
} from '@/domain/summary/use-case-schema/get-summary-highlights.use-case-schema';

export class GetSummaryHighlightsUseCase extends BaseUseCase<
  TRequestGetSummaryHighlights,
  TResponseGetSummaryHighlights
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      summaryDataAdapter: ISummaryDataPort;
    }
  ) {
    super('get-summary-highlights', adapters.loggerAdapter);
  }

  public async execute(): Promise<
    IBaseResponse<TResponseGetSummaryHighlights>
  > {
    const items = await this.adapters.summaryDataAdapter.getSummaryHighlights();

    return {
      success: true,
      message: 'common.success',
      details: {
        items,
      },
    };
  }
}
