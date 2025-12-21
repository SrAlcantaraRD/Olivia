import CryptoJS from 'crypto-js';

import {
  INVITE_BUNDLE_VERSION,
  InviteBundleSchema,
  type TInviteChunk,
  type TInviteBundle,
  type TInviteBundleBody,
  type TInviteBundleMetadata,
  type TInviteBundlePayload,
} from '@/domain/carer/entity/invite-bundle.entity';
import { IInvitePort } from '@/domain/carer/port/invite.port';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { QRCodecAdapter } from '@/database/adapter/qr.codec.adapter';
import {
  INVITE_CHUNK_SIZE,
  INVITE_EXPIRATION_MINUTES,
  INVITE_HMAC_SECRET,
} from '@/config/invite.config';

const DEFAULT_CHUNK_SIZE = Math.max(1, INVITE_CHUNK_SIZE);

export class InvitePortAdapter implements IInvitePort {
  private readonly codec = new QRCodecAdapter(DEFAULT_CHUNK_SIZE);

  constructor(private readonly loggerAdapter: TLoggerPort) {}

  public async createInviteBundle(
    payload: TInviteBundlePayload
  ): Promise<TInviteBundle> {
    const metadata = this.buildMetadata();
    const body: TInviteBundleBody = { metadata, payload };
    const signature = this.sign(body);

    this.loggerAdapter.info('InvitePortAdapter.createInviteBundle', {
      bundleId: metadata.nonce,
      expiresAt: metadata.expiresAt,
    });

    return { ...body, signature };
  }

  public async verifyInviteBundle(bundle: TInviteBundle): Promise<boolean> {
    const parsed = InviteBundleSchema.safeParse(bundle);

    if (!parsed.success) {
      this.loggerAdapter.error('InvitePortAdapter.verifyInviteBundle', {
        reason: 'schema invalid',
        issues: parsed.error.issues,
      });

      return false;
    }

    const { metadata } = parsed.data;
    const isExpired = Date.now() > new Date(metadata.expiresAt).getTime();

    if (isExpired) {
      this.loggerAdapter.error('InvitePortAdapter.verifyInviteBundle', {
        reason: 'bundle expired',
        expiresAt: metadata.expiresAt,
      });

      return false;
    }

    const expected = this.sign(parsed.data);

    if (expected !== parsed.data.signature) {
      this.loggerAdapter.error('InvitePortAdapter.verifyInviteBundle', {
        reason: 'signature mismatch',
        bundleId: metadata.nonce,
      });

      return false;
    }

    return true;
  }

  public async encodeBundleToChunks(
    bundle: TInviteBundle,
    chunkSize?: number
  ): Promise<TInviteChunk[]> {
    const data = JSON.stringify(bundle);

    return this.codec.splitToChunks(data, bundle.metadata.nonce, chunkSize);
  }

  public async decodeChunksToBundle(
    chunks: TInviteChunk[]
  ): Promise<TInviteBundle> {
    const raw = this.codec.joinChunks(chunks);
    const parsed = JSON.parse(raw);

    return InviteBundleSchema.parse(parsed);
  }

  private buildMetadata(): TInviteBundleMetadata {
    const issuedAt = new Date();
    const expiresAt = new Date(
      issuedAt.getTime() + INVITE_EXPIRATION_MINUTES * 60 * 1000
    );

    return {
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      version: INVITE_BUNDLE_VERSION,
      nonce: this.generateNonce(),
    };
  }

  private sign(body: TInviteBundleBody): string {
    const serialized = JSON.stringify(body);

    return CryptoJS.HmacSHA256(serialized, INVITE_HMAC_SECRET).toString(
      CryptoJS.enc.Hex
    );
  }

  private generateNonce(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).slice(2, 10);

    return `${timestamp}-${random}`;
  }
}
