import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { TSummaryPin } from '@/domain/summary/entity/summary-pin.entity';
import type { ISummaryPinsPort } from '@/domain/summary/port/summary-pins.port';
import type {
  TRequestPinSummaryItem,
  TResponsePinSummaryItem,
} from '@/domain/summary/use-case-schema/pin-summary-item.use-case-schema';

export class PinSummaryItemUseCase extends BaseUseCase<
  TRequestPinSummaryItem,
  TResponsePinSummaryItem
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      summaryPinsAdapter: ISummaryPinsPort;
    }
  ) {
    super('pin-summary-item', adapters.loggerAdapter);
  }

  public async execute(
    data: TRequestPinSummaryItem
  ): Promise<IBaseResponse<TResponsePinSummaryItem>> {
    const current = await this.adapters.summaryPinsAdapter.list();
    const exists = current.find(
      (pin) => pin.type === data.type && pin.targetId === data.targetId
    );

    if (exists) {
      return {
        success: true,
        message: 'common.success',
        details: {
          pins: current,
        },
      };
    }

    const order = current.length;
    const nextPin: TSummaryPin = {
      type: data.type,
      targetId: data.targetId,
      order,
      pinnedAt: new Date().toISOString(),
    };

    const next = [...current, nextPin];
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
