import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { IRecordPort } from '@/domain/module/port/record.port';

export type TRequestRecordStatistics = { startDate?: Date; endDate?: Date };
export type TResponseRecordStatistics = {
  countsByModule: { moduleID: number; count: number }[];
};

export class GetRecordStatisticsUseCase extends BaseUseCase<
  TRequestRecordStatistics,
  TResponseRecordStatistics
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      recordAdapter: IRecordPort;
    }
  ) {
    super('get-record-statistics', adapters.loggerAdapter);
  }

  public async execute(
    data: TRequestRecordStatistics
  ): Promise<IBaseResponse<TResponseRecordStatistics>> {
    const counts = await this.adapters.recordAdapter.getCountsByModule(data);
    return {
      success: true,
      message: 'common.success',
      details: {
        countsByModule: counts,
      },
    };
  }
}
