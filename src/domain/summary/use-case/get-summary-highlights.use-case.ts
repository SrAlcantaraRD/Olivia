import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ISummaryHighlightPort } from '@/domain/summary/port/summary-highlight.port';
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
      summaryHighlightAdapter: ISummaryHighlightPort;
    }
  ) {
    super('get-summary-highlights', adapters.loggerAdapter);
  }

  public async execute(): Promise<
    IBaseResponse<TResponseGetSummaryHighlights>
  > {
    const items =
      await this.adapters.summaryHighlightAdapter.listSummaryHighlights();

    return {
      success: true,
      message: 'common.success',
      details: {
        items,
      },
    };
  }
}
