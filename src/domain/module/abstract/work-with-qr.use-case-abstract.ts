import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { ENVIRONMENT_VARIABLES } from '@/domain/core/constant/environment-variables.constants';
import type { TQR, TQRBundle, TQRChunk } from '@/domain/core/dto/qr.dto';
import type {
  TRecordFieldSync,
  TRecordSync,
} from '@/domain/core/dto/sync-record.dto';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import { QR_BUNDLER_VERSION } from '@/domain/core/enum/qr.enum';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { IQRPort } from '@/domain/core/port/qr.port';
import type { TRecordField } from '@/domain/module/entity/record-field.entity';
import type { TRecord } from '@/domain/module/entity/record.entity';

/**
 * The chain of responsibility pattern is a behavioral design pattern that allows an object to pass a request along a chain of handlers. Upon receiving a request, each handler decides either to process the request or to pass it along the chain.
 *
 * - Each step, defined by an use-case, has its own `should-execute` conditions and `execute` logic.
 * - The chain request is continues until the final step is reached or an error occurs.
 */
export abstract class WorkWithQRBaseUseCase<
  Request,
  Response,
> extends BaseUseCase<Request, Response> {
  constructor(
    name: string,
    private readonly qrAdapter: IQRPort,
    loggerAdapter: TLoggerPort
  ) {
    super(name, loggerAdapter);
  }

  protected generateQRCode<T>(data: T): TQR<T> {
    return {
      [QR_KEY.METADATA]: {
        [QR_KEY.VERSION]: QR_BUNDLER_VERSION.V1,
      },
      [QR_KEY.PAYLOAD]: data,
    };
  }

  protected async packBundle<T>(bundle: TQR<T>): Promise<TQRBundle> {
    return this.qrAdapter.packBundle(bundle);
  }

  protected async unpackBundle<T>(bundle: TQRBundle): Promise<TQR<T>> {
    return this.qrAdapter.unpackBundle(bundle);
  }

  protected async toChunks<T>(bundle: TQR<T>): Promise<TQRChunk[]> {
    const base64 = await this.packBundle(bundle);

    const parts = this.chunkBase64(base64, ENVIRONMENT_VARIABLES.QR_CHUNK_SIZE);

    const total = parts.length;
    const id = base64.substring(0, 4);

    const chunks: TQRChunk[] = parts.map((dat, index) => ({
      [QR_KEY.BUNDLE_ID]: id,
      [QR_KEY.CHUNK_INDEX]: index,
      [QR_KEY.CHUNK_TOTAL]: total,
      [QR_KEY.CHUNK_DATA]: dat,
    }));

    this.logDebug(`toChunks generated "${total}" chunks for bundle ID "${id}"`);

    return chunks;
  }

  protected async fromChunks<T>(chunks: TQRChunk[]): Promise<TQR<T>> {
    if (chunks.length === 0) {
      this.logError('fromChunks called with no chunks');

      throw new Error('no chunks');
    }

    const chuckList = [...chunks].sort(
      (a, b) => a[QR_KEY.CHUNK_INDEX] - b[QR_KEY.CHUNK_INDEX]
    );

    const total = chuckList[0][QR_KEY.CHUNK_TOTAL];

    if (chuckList.length !== total) {
      this.logError(
        `fromQRChunks called with incomplete chunks: expected "${total}", got "${chuckList.length}"`
      );

      throw new Error('missing chunks');
    }

    const assembledBase64 = this.assembleChunks(
      chuckList.map((chunk) => chunk[QR_KEY.CHUNK_DATA])
    );

    const bundle = await this.unpackBundle<T>(assembledBase64);

    return bundle;
  }

  protected mapRecordToRecordSync(record: TRecord): TRecordSync {
    const fieldList = record.fieldList || [];
    const moduleID = record.module?.id || -1;

    return {
      [QR_KEY.RECORD_MODULE_ID]: moduleID,
      [QR_KEY.RECORD_DATE]: record.createdAt.getTime().toString(),
      [QR_KEY.RECORD_FIELDS]: fieldList.map(
        this.mapRecordFieldToRecordFieldSync
      ),
    };
  }

  protected mapRecordFieldToRecordFieldSync(
    recordField: TRecordField
  ): TRecordFieldSync {
    return {
      [QR_KEY.RECORD_FIELD_ID]: recordField.fieldID,
      [QR_KEY.RECORD_FIELD_VALUE]: recordField.value,
    };
  }

  protected chunkBase64(
    base64: string,
    chunkSize = ENVIRONMENT_VARIABLES.QR_CHUNK_SIZE
  ): string[] {
    const chunks: string[] = [];

    for (let i = 0; i < base64.length; i += chunkSize) {
      chunks.push(base64.slice(i, i + chunkSize));
    }

    return chunks;
  }

  protected assembleChunks(chunks: string[]): string {
    return chunks.join('');
  }
}
