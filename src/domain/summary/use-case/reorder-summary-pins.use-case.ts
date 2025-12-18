import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ISummaryPinsPort } from '@/domain/summary/port/summary-pins.port';
import type {
  TRequestReorderSummaryPins,
  TResponseReorderSummaryPins,
} from '@/domain/summary/use-case-schema/reorder-summary-pins.use-case-schema';

export class ReorderSummaryPinsUseCase extends BaseUseCase<
  TRequestReorderSummaryPins,
  TResponseReorderSummaryPins
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      summaryPinsAdapter: ISummaryPinsPort;
    }
  ) {
    super('reorder-summary-pins', adapters.loggerAdapter);
  }

  public async execute(
    data: TRequestReorderSummaryPins
  ): Promise<IBaseResponse<TResponseReorderSummaryPins>> {
    const next = data.pins.map((pin, index) => ({
      ...pin,
      order: index,
    }));

    await this.adapters.summaryPinsAdapter.replaceAll(next);

    return {
      success: true,
      message: 'common.success',
      details: {
        pins: next,
      },
    };
  }
}
