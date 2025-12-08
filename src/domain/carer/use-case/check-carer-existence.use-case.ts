import type { ICarerPort } from '@/domain/carer/port/carer.port';
import type {
  TCheckCarerExistenceRequest,
  TCheckCarerExistenceResponse,
} from '@/domain/carer/use-case-schema/check-carer-existence.use-case-schema';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';

export class CheckCarerExistenceUseCase extends BaseUseCase<
  TCheckCarerExistenceRequest,
  TCheckCarerExistenceResponse
> {
  constructor(
    loggerAdapter: TLoggerPort,
    private readonly carerAdapter: ICarerPort
  ) {
    super('check-carer-existence', loggerAdapter);
  }

  public async execute(
    request: TCheckCarerExistenceRequest
  ): Promise<IBaseResponse<TCheckCarerExistenceResponse>> {
    const exists = await this.carerAdapter.existsAny();
    this.loggerAdapter.info(
      `[CheckCarerExistenceUseCase] existsAny result: ${exists}`
    );

    return {
      success: true,
      message: 'common.success',
      details: { exists },
    } satisfies IBaseResponse<TCheckCarerExistenceResponse>;
  }
}
