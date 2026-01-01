import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { IRecordFieldPort } from '@/domain/module/port/record-field.port';
import type {
  TRequestGetRecordFieldList,
  TResponseGetRecordFieldList,
} from '@/domain/module/use-case-schema/get-record-field-list.use-case-schema';

export class GetRecordFieldListUseCase extends BaseUseCase<
  TRequestGetRecordFieldList,
  TResponseGetRecordFieldList
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      recordFieldAdapter: IRecordFieldPort;
    }
  ) {
    super('get-record-field-list', adapters.loggerAdapter);
  }

  public async execute(
    request: TRequestGetRecordFieldList
  ): Promise<IBaseResponse<TResponseGetRecordFieldList>> {
    try {
      const records = await this.adapters.recordFieldAdapter.getAllByFieldID(
        request.fieldId
      );

      return {
        success: true,
        message: 'common.success',
        details: records,
      };
    } catch (error) {
      this.loggerAdapter.error({
        message: 'Error fetching record fields',
        error,
      });

      return {
        success: false,
        message: 'common.error',
      };
    }
  }
}
