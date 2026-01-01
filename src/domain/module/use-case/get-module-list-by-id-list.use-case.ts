import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { IModulePort } from '@/domain/module/port/module.port';
import type {
  TRequestModuleListByIDList,
  TResponseModuleListByIDList,
} from '@/domain/module/use-case-schema/get-active-module-list-by-id-list.use-case-schema';

export class GetModuleListByIDListUseCase extends BaseUseCase<
  TRequestModuleListByIDList,
  TResponseModuleListByIDList
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      moduleAdapter: IModulePort;
    }
  ) {
    super('setup-parent', adapters.loggerAdapter);
  }

  public async execute(
    request: TRequestModuleListByIDList
  ): Promise<IBaseResponse<TResponseModuleListByIDList>> {
    const { idList } = request;

    const list = await this.adapters.moduleAdapter.getAll();

    const targetList = list.filter((module) => idList.includes(module.id));

    return {
      success: true,
      message: 'common.success',
      details: {
        items: targetList,
      },
    };
  }
}
