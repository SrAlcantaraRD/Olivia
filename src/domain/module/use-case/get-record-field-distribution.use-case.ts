import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { IRecordPort } from '@/domain/module/port/record.port';

export type TRequestRecordFieldDistribution = {
  fieldID: number;
  moduleID?: number;
  startDate?: Date;
  endDate?: Date;
};
export type TResponseRecordFieldDistribution = {
  values: { value: string; count: number }[];
};

export class GetRecordFieldDistributionUseCase extends BaseUseCase<
  TRequestRecordFieldDistribution,
  TResponseRecordFieldDistribution
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      recordAdapter: IRecordPort;
    }
  ) {
    super('get-record-field-distribution', adapters.loggerAdapter);
  }

  public async execute(
    data: TRequestRecordFieldDistribution
  ): Promise<IBaseResponse<TResponseRecordFieldDistribution>> {
    const values = await this.adapters.recordAdapter.getFieldDistribution(data);

    return { success: true, message: 'common.success', details: { values } };
  }
}
