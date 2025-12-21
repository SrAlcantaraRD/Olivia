import {
  TInviteBundle,
  TInviteBundlePayload,
  TInviteChunk,
} from '@/domain/carer/entity/invite-bundle.entity';

export interface IInvitePort {
  createInviteBundle(payload: TInviteBundlePayload): Promise<TInviteBundle>;
  verifyInviteBundle(bundle: TInviteBundle): Promise<boolean>;
  encodeBundleToChunks(
    bundle: TInviteBundle,
    chunkSize?: number
  ): Promise<TInviteChunk[]>;
  decodeChunksToBundle(chunks: TInviteChunk[]): Promise<TInviteBundle>;
}
