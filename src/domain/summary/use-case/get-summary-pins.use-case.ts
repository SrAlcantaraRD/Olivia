import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ISummaryPinsPort } from '@/domain/summary/port/summary-pins.port';
import type {
  TRequestGetSummaryPins,
  TResponseGetSummaryPins,
} from '@/domain/summary/use-case-schema/get-summary-pins.use-case-schema';

export class GetSummaryPinsUseCase extends BaseUseCase<
  TRequestGetSummaryPins,
  TResponseGetSummaryPins
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      summaryPinsAdapter: ISummaryPinsPort;
    }
  ) {
    super('get-summary-pins', adapters.loggerAdapter);
  }

  public async execute(): Promise<IBaseResponse<TResponseGetSummaryPins>> {
    const items = await this.adapters.summaryPinsAdapter.list();

    return {
      success: true,
      message: 'common.success',
      details: {
        items,
      },
    };
  }
}
