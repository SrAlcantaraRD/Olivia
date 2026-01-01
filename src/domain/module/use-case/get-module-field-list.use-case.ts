import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { IModuleFieldPort } from '@/domain/module/port/module-field.port';
import type {
  TRequestGetModuleFieldList,
  TResponseGetModuleFieldList,
} from '@/domain/module/use-case-schema/get-module-field-list.use-case-schema';

export class GetModuleFieldListUseCase extends BaseUseCase<
  TRequestGetModuleFieldList,
  TResponseGetModuleFieldList
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      moduleFieldAdapter: IModuleFieldPort;
    }
  ) {
    super('module-field-list', adapters.loggerAdapter);
  }

  public async execute(
    data: TRequestGetModuleFieldList
  ): Promise<IBaseResponse<TResponseGetModuleFieldList>> {
    const list = await this.adapters.moduleFieldAdapter.getAllByModuleId(
      data.moduleID
    );

    const targetList = list.filter(
      (field) => field.status === STATUS_ENUM.ACTIVE
    );

    return {
      success: true,
      message: 'common.success',
      details: {
        items: targetList,
      },
    };
  }
}
