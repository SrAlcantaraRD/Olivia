import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ISummaryPinsPort } from '@/domain/summary/port/summary-pins.port';
import type {
  TRequestUnpinSummaryItem,
  TResponseUnpinSummaryItem,
} from '@/domain/summary/use-case-schema/unpin-summary-item.use-case-schema';

export class UnpinSummaryItemUseCase extends BaseUseCase<
  TRequestUnpinSummaryItem,
  TResponseUnpinSummaryItem
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      summaryPinsAdapter: ISummaryPinsPort;
    }
  ) {
    super('unpin-summary-item', adapters.loggerAdapter);
  }

  public async execute(
    data: TRequestUnpinSummaryItem
  ): Promise<IBaseResponse<TResponseUnpinSummaryItem>> {
    const current = await this.adapters.summaryPinsAdapter.list();
    const next = current
      .filter(
        (pin) => !(pin.type === data.type && pin.targetId === data.targetId)
      )
      .map((pin, index) => ({
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
