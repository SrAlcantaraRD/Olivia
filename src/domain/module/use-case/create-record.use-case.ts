import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type {
  TRecord,
  TRecordCreate,
} from '@/domain/module/entity/record.entity';
import type { IRecordPort } from '@/domain/module/port/record.port';

export class CreateRecordUseCase extends BaseUseCase<TRecordCreate, TRecord> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      recordAdapter: IRecordPort;
    }
  ) {
    super('create-record', adapters.loggerAdapter);
  }

  public async execute(data: TRecordCreate): Promise<IBaseResponse<TRecord>> {
    const created = await this.adapters.recordAdapter.create(data);

    return {
      success: true,
      message: 'common.success',
      details: created,
    };
  }
}
