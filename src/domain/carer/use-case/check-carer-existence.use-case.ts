import type {
  TCheckCarerExistenceRequest,
  TCheckCarerExistenceResponse,
} from '@/domain/carer/use-case-schema/check-carer-existence.use-case-schema';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { CACHE_KEY_ENUM } from '@/domain/core/constant/cache-key.constants';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';

export class CheckCarerExistenceUseCase extends BaseUseCase<
  TCheckCarerExistenceRequest,
  TCheckCarerExistenceResponse
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      cacheAdapter: ICachePort;
    }
  ) {
    super('check-carer-existence', adapters.loggerAdapter);
  }

  public async execute(): Promise<IBaseResponse<TCheckCarerExistenceResponse>> {
    const carerID = await this.adapters.cacheAdapter.get<number>(
      CACHE_KEY_ENUM.CARER
    );

    return {
      success: true,
      message: 'common.success',
      details: { exists: carerID !== null },
    } satisfies IBaseResponse<TCheckCarerExistenceResponse>;
  }
}
