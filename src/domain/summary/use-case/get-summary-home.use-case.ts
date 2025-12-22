import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';
import type { ISummaryPinsPort } from '@/domain/summary/port/summary-pins.port';
import type {
  TRequestGetSummaryHome,
  TResponseGetSummaryHome,
} from '@/domain/summary/use-case-schema/get-summary-home.use-case-schema';

export class GetSummaryHomeUseCase extends BaseUseCase<
  TRequestGetSummaryHome,
  TResponseGetSummaryHome
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      summaryModuleAdapter: ISummaryModulePort;
      summaryPinsAdapter: ISummaryPinsPort;
    }
  ) {
    super('get-summary-home', adapters.loggerAdapter);
  }

  public async execute(
    data: TRequestGetSummaryHome
  ): Promise<IBaseResponse<TResponseGetSummaryHome>> {
    const [modules, pins] = await Promise.all([
      this.adapters.summaryModuleAdapter.getModuleSummaries(data.moduleIds),
      this.adapters.summaryPinsAdapter.list(),
    ]);

    return {
      success: true,
      message: 'common.success',
      details: {
        modules,
        pins,
      },
    };
  }
}
