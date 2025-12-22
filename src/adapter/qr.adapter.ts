import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { TQR, TQRBundle, TQRChunk } from '@/domain/core/dto/qr.dto';
import { QR_BUNDLE_VERSION } from '@/domain/core/enum/qr.enum';
import { QRMapper } from '@/domain/core/mapper/qr.mapper';
import type { IQRPort } from '@/domain/core/port/qr.port';

export class QrPortAdapter implements IQRPort {
  private readonly codec = new QRMapper();

  constructor(private readonly loggerAdapter: TLoggerPort) {}

  public async generateQRCode<T>(payload: T): Promise<TQR<T>> {
    try {
      const nonce = this.generateNonce();
      const qr: TQR<T> = {
        metadata: {
          version: QR_BUNDLE_VERSION.V1,
          nonce,
        },
        payload,
      };
      this.loggerAdapter.info('QR code generated', { nonce });
      return qr;
    } catch (error) {
      this.loggerAdapter.error('Error generating QR code', error);
      throw error;
    }
  }

  public async generateBundle<T extends TQR<unknown>>(
    payload: T
  ): Promise<string> {
    try {
      const jsonString = JSON.stringify(payload);
      return jsonString;
    } catch (error) {
      this.loggerAdapter.error('Error generating QR bundle', error);
      throw error;
    }
  }

  public async decodeBundle<T extends TQR<unknown>>(
    bundle: TQRBundle
  ): Promise<T> {
    try {
      const qr: T = JSON.parse(bundle);
      return qr;
    } catch (error) {
      this.loggerAdapter.error('Error decoding QR bundle', error);
      throw error;
    }
  }

  public async encodeToChunks(
    bundle: TQRBundle,
    chunkSize?: number
  ): Promise<TQRChunk[]> {
    try {
      const bundleID = this.generateBundleID();
      const chunks = this.codec.splitToChunks(bundle, bundleID, chunkSize);
      this.loggerAdapter.info('QR bundle encoded to chunks', {
        bundleID,
        chunkCount: chunks.length,
      });
      return chunks;
    } catch (error) {
      this.loggerAdapter.error('Error encoding QR bundle to chunks', error);
      throw error;
    }
  }

  public async decodeFromChunks(chunks: TQRChunk[]): Promise<TQRBundle> {
    try {
      const bundle = this.codec.joinChunks(chunks);
      this.loggerAdapter.info('QR chunks decoded to bundle', {
        bundleLength: bundle.length,
      });
      return bundle;
    } catch (error) {
      this.loggerAdapter.error('Error decoding QR chunks to bundle', error);
      throw error;
    }
  }

  private generateNonce(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private generateBundleID(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
