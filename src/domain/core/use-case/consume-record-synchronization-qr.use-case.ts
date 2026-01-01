import z from 'zod';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import {
  RecordSyncBundleSchema,
  type TRecordSyncBundle,
} from '@/domain/core/dto/sync-record.dto';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import type { IQRPort } from '@/domain/core/port/qr.port';
import { WorkWithQRBaseUseCase } from '@/domain/module/abstract/work-with-qr.use-case-abstract';
import type { TRecordFieldCreate } from '@/domain/module/entity/record-field.entity';
import type { IRecordFieldPort } from '@/domain/module/port/record-field.port';
import type { IRecordPort } from '@/domain/module/port/record.port';
import {
  RequestConsumeRecordSynchronizationQRSchema,
  type TRequestConsumeRecordSynchronizationQR,
  type TResponseConsumeRecordSynchronizationQR,
} from '../use-case-schema/consume-record-synchronization-qr.use-case-schema';

export class ConsumeRecordSynchronizationQRUseCase extends WorkWithQRBaseUseCase<
  TRequestConsumeRecordSynchronizationQR,
  TResponseConsumeRecordSynchronizationQR
> {
  constructor(
    private readonly adapters: {
      recordAdapter: IRecordPort;
      recordFieldAdapter: IRecordFieldPort;
      qrAdapter: IQRPort;
      loggerAdapter: TLoggerPort;
    }
  ) {
    super(
      'generate-record-synchronization-qr',
      adapters.qrAdapter,
      adapters.loggerAdapter
    );
  }

  public async execute(
    request: TRequestConsumeRecordSynchronizationQR
  ): Promise<IBaseResponse<TResponseConsumeRecordSynchronizationQR>> {
    const parsed =
      RequestConsumeRecordSynchronizationQRSchema.safeParse(request);

    if (!parsed.success) {
      // TODO: Generate a wrapper to encapsulate safeParse and errors return [avoid code duplication on parsing requests at abstract BaseUseCase]
      const errorList = z.treeifyError(parsed.error).errors;
      this.logError('Error on parsing request', errorList.join(', '));

      return {
        success: false,
        message: 'use-case.delete-carer.invalid-request',
      };
    }

    const { chunkList } = parsed.data;

    const bundle = await this.fromChunks<TRecordSyncBundle>(chunkList);

    const parsedBundle = RecordSyncBundleSchema.safeParse(
      bundle[QR_KEY.PAYLOAD]
    );

    if (!parsedBundle.success) {
      const errorList = z.treeifyError(parsedBundle.error).errors;
      this.logError(
        'Error on parsing bundle from chunks',
        errorList.join(', ')
      );

      return {
        success: false,
        message: 'use-case.consume-record-synchronization-qr.invalid-bundle',
      };
    }

    for (const record of bundle[QR_KEY.PAYLOAD][QR_KEY.RECORDS]) {
      const {
        [QR_KEY.RECORD_MODULE_ID]: moduleID,
        [QR_KEY.RECORD_DATE]: rawRecordDate,
        [QR_KEY.RECORD_FIELDS]: recordFields,
      } = record;

      const recordDate = new Date(Number(rawRecordDate));

      const existingRecord = await this.adapters.recordAdapter.upsert({
        moduleID,
        carerID: bundle[QR_KEY.PAYLOAD][QR_KEY.ORIGIN_CARER_ID],
        synchronized: true,
        createdAt: recordDate,
        recordFieldList: [],
      });

      const fieldData: TRecordFieldCreate[] = recordFields.map((field) => ({
        recordID: existingRecord.id,
        fieldID: field[QR_KEY.RECORD_FIELD_ID],
        value: field[QR_KEY.RECORD_FIELD_VALUE],
      }));

      await this.adapters.recordFieldAdapter.batchUpsert(
        existingRecord.id,
        fieldData,
        recordDate
      );
    }

    return {
      success: true,
      message: 'use-case.consume-record-synchronization-qr.success',
      details: {
        applied: true,
        appliedCount: bundle[QR_KEY.PAYLOAD][QR_KEY.RECORDS].length,
      },
    };
  }
}
