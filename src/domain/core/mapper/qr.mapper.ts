import { Buffer } from 'buffer';

import { INVITE_CHUNK_SIZE } from '@/domain/core/constant/qr-chunk-size.constants';
import type { TQRBundle, TQRChunk } from '@/domain/core/dto/qr.dto';

// TODO: Move to a PORT
export class QRMapper {
  constructor(private readonly chunkSize: number = INVITE_CHUNK_SIZE) {}

  public splitToChunks(
    payload: TQRBundle,
    bundleID: string,
    chunkSize: number = this.chunkSize
  ): TQRChunk[] {
    if (chunkSize <= 0) {
      throw new Error('Invalid chunk size provided to QRCodecAdapter');
    }

    const encoded = this.encodeToBase64(payload);
    const totalChunks = Math.max(1, Math.ceil(encoded.length / chunkSize));
    const chunks: TQRChunk[] = [];

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex += 1) {
      const start = chunkIndex * chunkSize;
      const data = encoded.slice(start, start + chunkSize);

      chunks.push({
        bundleID: bundleID,
        chunkIndex,
        chunkTotal: totalChunks,
        data,
      });
    }

    return chunks;
  }

  public joinChunks(chunks: TQRChunk[]): TQRBundle {
    if (!chunks.length) {
      throw new Error('No chunks provided to QRCodecAdapter.joinChunks');
    }

    const sortedChunks = [...chunks].sort(
      (a, b) => a.chunkIndex - b.chunkIndex
    );

    const [{ bundleID, chunkTotal }] = sortedChunks;

    if (!sortedChunks.every((chunk) => chunk.bundleID === bundleID)) {
      throw new Error('Chunk bundleId mismatch');
    }

    if (!sortedChunks.every((chunk) => chunk.chunkTotal === chunkTotal)) {
      throw new Error('Chunk total mismatch');
    }

    if (sortedChunks.length !== chunkTotal) {
      throw new Error('Missing chunk while reassembling QR payload');
    }

    const combined = sortedChunks.map((chunk) => chunk.data).join('');

    return this.decodeFromBase64(combined);
  }

  private encodeToBase64(value: string): string {
    return Buffer.from(value, 'utf-8').toString('base64');
  }

  private decodeFromBase64(value: string): string {
    return Buffer.from(value, 'base64').toString('utf-8');
  }
}
