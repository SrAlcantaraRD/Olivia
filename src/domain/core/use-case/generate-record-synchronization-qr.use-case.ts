import z from 'zod';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { TQRChunk } from '@/domain/core/dto/qr.dto';
import type {
  TRecordSync,
  TRecordSyncBundle,
} from '@/domain/core/dto/sync-record.dto';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import type { IQRPort } from '@/domain/core/port/qr.port';
import {
  RequestGenerateRecordSynchronizationQRSchema,
  type TRequestGenerateRecordSynchronizationQR,
  type TResponseGenerateRecordSynchronizationQR,
} from '@/domain/core/use-case-schema/generate-record-synchronization-qr.use-case-schema';
import { WorkWithQRBaseUseCase } from '@/domain/module/abstract/work-with-qr.use-case-abstract';
import type { IRecordPort } from '@/domain/module/port/record.port';

export class GenerateRecordSynchronizationQRUseCase extends WorkWithQRBaseUseCase<
  TRequestGenerateRecordSynchronizationQR,
  TResponseGenerateRecordSynchronizationQR
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      recordAdapter: IRecordPort;
      qrAdapter: IQRPort;
    }
  ) {
    super(
      'generate-record-synchronization-qr',
      adapters.qrAdapter,
      adapters.loggerAdapter
    );
  }

  public async execute(
    request: TRequestGenerateRecordSynchronizationQR
  ): Promise<IBaseResponse<TResponseGenerateRecordSynchronizationQR>> {
    const parsed =
      RequestGenerateRecordSynchronizationQRSchema.safeParse(request);

    if (!parsed.success) {
      // TODO: Generate a wrapper to encapsulate safeParse and errors return [avoid code duplication on parsing requests at abstract BaseUseCase]
      const errorList = z.treeifyError(parsed.error).errors;
      this.logError('Error on parsing request', errorList.join(', '));

      return {
        success: false,
        message: 'use-case.delete-carer.invalid-request',
      };
    }

    const { carerID } = parsed.data;

    const list = await this.adapters.recordAdapter.getPendingToSynchronized();

    const syncList: TRecordSync[] = list.map((record) =>
      this.mapRecordToRecordSync(record)
    );

    const bundle: TRecordSyncBundle = {
      [QR_KEY.RECORDS]: syncList,
      [QR_KEY.ORIGIN_CARER_ID]: carerID,
    };

    const qr = this.generateQRCode(bundle);

    const chunkList: TQRChunk[] = await this.toChunks(qr);

    return {
      success: true,
      message: 'use-case.generate-record-synchronization-qr.success',
      details: {
        bundle,
        chunkList,
      },
    };

    // return z
    //   .object({
    //     success: z.boolean(),
    //     message: z.string(),
    //     details: ResponseGenerateRecordSynchronizationQRSchema,
    //   })
    //   .parse({
    //     success: true,
    //     message: 'use-case.generate-record-synchronization-qr.success',
    //     details: {
    //       bundle: bundle,
    //       chunkList: chunkList,
    //     },
    //   });
  }
}
