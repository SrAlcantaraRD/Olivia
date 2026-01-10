import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import { CACHE_KEY_ENUM, type ICachePort } from '@/domain/core/port/cache.port';
import type {
  TRecord,
  TRecordCreate,
} from '@/domain/module/entity/record.entity';
import type { IRecordPort } from '@/domain/module/port/record.port';
import type { IRecordFieldPort } from '@/domain/module/port/record-field.port';

export class CreateRecordUseCase extends BaseUseCase<TRecordCreate, TRecord> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      recordAdapter: IRecordPort;
      recordFieldAdapter: IRecordFieldPort;
      cacheAdapter: ICachePort;
    }
  ) {
    super('create-record', adapters.loggerAdapter);
  }

  public async execute(data: TRecordCreate): Promise<IBaseResponse<TRecord>> {
    const carerID = await this.adapters.cacheAdapter.get<number>(
      CACHE_KEY_ENUM.CARER
    );

    if (carerID === null) {
      this.logError('Carer not found in cache');

      return {
        success: false,
        message: 'use-case.create-record.carer-not-found-in-cache',
      };
    }

    const { createdAt, moduleID, recordFieldList } = data;

    const record = await this.adapters.recordAdapter.upsert({
      ...data,
      carerID,
      createdAt,
      moduleID,
    });

    this.adapters.loggerAdapter.info(`Record created with ID: ${record.id}`);

    this.adapters.loggerAdapter.error(data);

    await this.adapters.recordFieldAdapter.batchUpsert(
      record.id,
      recordFieldList,
      record.createdAt
    );

    return {
      success: true,
      message: 'common.success',
      details: record,
    };
  }
}
