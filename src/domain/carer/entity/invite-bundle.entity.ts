import { z } from 'zod';

import { CarerTypeSchema } from '@/domain/carer/enum/carer-type.enums';

export const INVITE_BUNDLE_VERSION = '1';

export const InviteBundleMetadataSchema = z.object({
  issuedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  version: z.string(),
  nonce: z.string(),
});

export const InviteCarerPayloadSchema = z.object({
  name: z.string().min(1),
  type: CarerTypeSchema,
  note: z.string().optional(),
});

export const InviteBundlePayloadSchema = z.object({
  carer: InviteCarerPayloadSchema,
});

export const InviteBundleBodySchema = z.object({
  metadata: InviteBundleMetadataSchema,
  payload: InviteBundlePayloadSchema,
});

export const InviteBundleSchema = z.object({
  metadata: InviteBundleMetadataSchema,
  payload: InviteBundlePayloadSchema,
  signature: z.string(),
});

export const InviteChunkSchema = z.object({
  bundleId: z.string(),
  chunkIndex: z.number().min(0),
  chunkTotal: z.number().min(1),
  data: z.string(),
});

export type TInviteBundleMetadata = z.infer<typeof InviteBundleMetadataSchema>;
export type TInviteBundlePayload = z.infer<typeof InviteBundlePayloadSchema>;
export type TInviteBundleBody = z.infer<typeof InviteBundleBodySchema>;
export type TInviteBundle = z.infer<typeof InviteBundleSchema>;
export type TInviteChunk = z.infer<typeof InviteChunkSchema>;
