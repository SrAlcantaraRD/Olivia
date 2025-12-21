import type { TQR, TQRBundle, TQRChunk } from '@/domain/core/dto/qr.dto';

export interface IQRPort {
  generateQRCode<T>(payload: T): Promise<TQR<T>>;
  generateBundle<T extends TQR<unknown>>(payload: T): Promise<TQRBundle>;
  decodeBundle<T extends TQR<unknown>>(bundle: TQRBundle): Promise<T>;
  encodeToChunks(bundle: TQRBundle, chunkSize?: number): Promise<TQRChunk[]>;
  decodeFromChunks(chunks: TQRChunk[]): Promise<TQRBundle>;
}
