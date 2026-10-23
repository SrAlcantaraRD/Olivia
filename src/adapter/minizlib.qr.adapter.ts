import { Buffer } from 'buffer';
import pako from 'pako';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { TQR, TQRBundle } from '@/domain/core/dto/qr.dto';
import type { IQRPort } from '@/domain/core/port/qr.port';

export class QrPortAdapter implements IQRPort {
  private readonly BASE_CODE = 'base64';

  constructor(private readonly loggerAdapter: TLoggerPort) {}

  public async packBundle<T>(bundle: TQR<T>): Promise<TQRBundle> {
    try {
      const json = JSON.stringify(bundle);

      const compressed = pako.deflate(json);
      const base64 = Buffer.from(compressed).toString(this.BASE_CODE);

      return base64;
    } catch (error) {
      this.loggerAdapter.error('Error packing bundle', error);

      throw error;
    }
  }

  public async unpackBundle<T>(bundle: TQRBundle): Promise<TQR<T>> {
    try {
      const compressed = Buffer.from(bundle, this.BASE_CODE);

      const decompressed = pako.inflate(compressed, { toText: true });
      const parsed = JSON.parse(decompressed) as TQR<T>;

      return parsed;
    } catch (error) {
      this.loggerAdapter.error('Error unpacking bundle', error);

      throw error;
    }
  }
}
