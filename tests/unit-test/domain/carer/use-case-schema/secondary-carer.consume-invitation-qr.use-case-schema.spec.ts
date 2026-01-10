/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import {
  RequestSecondaryCarerConsumeInvitationQRSchema,
  ResponseSecondaryCarerConsumeInvitationQRSchema,
} from '@/domain/carer/use-case-schema/secondary-carer.consume-invitation-qr.use-case-schema';
import { mockCarerEntity } from '@/tests/mocks/carer.entity.mock';

describe('[UseCaseSchema] - SecondaryCarerConsumeInvitationQR', () => {
  describe('RequestSecondaryCarerConsumeInvitationQRSchema', () => {
    it('should parse valid request', () => {
      const request = {
        qrBundle: 'base64-encoded-qr-bundle',
      };
      const result =
        RequestSecondaryCarerConsumeInvitationQRSchema.parse(request);
      expect(result.qrBundle).toBe('base64-encoded-qr-bundle');
    });

    it('should throw error for missing qrBundle', () => {
      expect(() =>
        RequestSecondaryCarerConsumeInvitationQRSchema.parse({})
      ).toThrow();
    });

    it('should throw error for invalid qrBundle type', () => {
      expect(() =>
        RequestSecondaryCarerConsumeInvitationQRSchema.parse({
          qrBundle: 123,
        })
      ).toThrow();
    });
  });

  describe('ResponseSecondaryCarerConsumeInvitationQRSchema', () => {
    it('should parse valid response', () => {
      const mockCarer = mockCarerEntity();
      const result =
        ResponseSecondaryCarerConsumeInvitationQRSchema.parse(mockCarer);
      expect(result).toMatchObject({
        id: 1,
        name: 'Test Carer',
        type: 'ADMIN',
        isPrimary: true,
        status: 1,
      });
    });

    it('should throw error for invalid carer data', () => {
      expect(() =>
        ResponseSecondaryCarerConsumeInvitationQRSchema.parse({
          invalidField: 'value',
        })
      ).toThrow();
    });
  });
});
