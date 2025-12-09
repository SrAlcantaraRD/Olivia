import type {
  TGetListActiveModuleRequest,
  TGetListActiveModuleResponse,
} from '@/domain/carer/use-case-schema/get-list-active-module.use-case-schema';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { TModuleDTO } from '@/domain/module/dto/module.dto';
import type { IModulePort } from '@/domain/module/port/module.port';

export class GetListActiveModuleUseCase extends BaseUseCase<
  TGetListActiveModuleRequest,
  TGetListActiveModuleResponse
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      moduleAdapter: IModulePort;
    }
  ) {
    super('get-list-active-module', adapters.loggerAdapter);
  }

  public async execute(
    request: TGetListActiveModuleRequest
  ): Promise<IBaseResponse<TGetListActiveModuleResponse>> {
    let items: TModuleDTO[] = [];

    try {
      const exists = await this.adapters.moduleAdapter.getAll();
      items = exists.filter((module) => module.isActive);
    } catch (error) {
      this.adapters.loggerAdapter.error(
        `Error getting active module list: ${error}`
      );
    }

    return {
      success: true,
      message: 'common.success',
      details: { items },
    } satisfies IBaseResponse<TGetListActiveModuleResponse>;
  }
}
