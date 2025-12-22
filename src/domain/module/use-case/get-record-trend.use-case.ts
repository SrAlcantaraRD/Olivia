import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { TID } from '@/domain/core/schemas/id.schema';
import type { IRecordPort } from '@/domain/module/port/record.port';

export type TRequestRecordTrend = {
  startDate?: Date;
  endDate?: Date;
  moduleID?: TID;
};

export type TResponseRecordTrend = { series: { day: string; count: number }[] };

export class GetRecordTrendUseCase extends BaseUseCase<
  TRequestRecordTrend,
  TResponseRecordTrend
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      recordAdapter: IRecordPort;
    }
  ) {
    super('get-record-trend', adapters.loggerAdapter);
  }

  public async execute(
    data: TRequestRecordTrend
  ): Promise<IBaseResponse<TResponseRecordTrend>> {
    const series = await this.adapters.recordAdapter.getCountsByDay(data);
    return {
      success: true,
      message: 'common.success',
      details: { series },
    };
  }
}
