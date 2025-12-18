import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ISummaryDataPort } from '@/domain/summary/port/summary-data.port';
import type {
  TRequestGetSummaryModules,
  TResponseGetSummaryModules,
} from '@/domain/summary/use-case-schema/get-summary-modules.use-case-schema';

export class GetSummaryModulesUseCase extends BaseUseCase<
  TRequestGetSummaryModules,
  TResponseGetSummaryModules
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      summaryDataAdapter: ISummaryDataPort;
    }
  ) {
    super('get-summary-modules', adapters.loggerAdapter);
  }

  public async execute(
    data: TRequestGetSummaryModules
  ): Promise<IBaseResponse<TResponseGetSummaryModules>> {
    const items = await this.adapters.summaryDataAdapter.getModuleSummaries(
      data.moduleIds
    );

    return {
      success: true,
      message: 'common.success',
      details: {
        items,
      },
    };
  }
}
