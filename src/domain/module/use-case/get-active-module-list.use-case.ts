import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { IModulePort } from '@/domain/module/port/module.port';
import type {
  TRequestGetActiveModuleList,
  TResponseGetActiveModuleList,
} from '@/domain/module/use-case-schema/get-active-module-list.use-case-schema';

export class GetActiveModuleListUseCase extends BaseUseCase<
  TRequestGetActiveModuleList,
  TResponseGetActiveModuleList
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      moduleAdapter: IModulePort;
    }
  ) {
    super('setup-parent', adapters.loggerAdapter);
  }

  public async execute(): Promise<IBaseResponse<TResponseGetActiveModuleList>> {
    const list = await this.adapters.moduleAdapter.getAll();

    const targetList = list
      .filter(
        (module) => module.isActive && module.status === STATUS_ENUM.ACTIVE
      )
      .map((module) => ({
        ...module,
        fieldList:
          module.fieldList?.filter(
            (field) => field.status === STATUS_ENUM.ACTIVE
          ) || [],
      }));

    this.adapters.loggerAdapter.error({ targetList });

    return {
      success: true,
      message: 'common.success',
      details: {
        items: targetList,
      },
    };
  }
}
