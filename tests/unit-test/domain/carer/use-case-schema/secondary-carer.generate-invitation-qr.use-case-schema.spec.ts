/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import {
  RequestSecondaryCarerGenerateInvitationQRSchema,
  ResponseSecondaryCarerGenerateInvitationQRSchema,
} from '@/domain/carer/use-case-schema/secondary-carer.generate-invitation-qr.use-case-schema';
import { TIME_TO_LIVE } from '@/domain/core/constant/time-to-live.constants';
import { QRBundlerVersionSchema } from '@/domain/core/enum/qr.enum';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';

describe('[UseCaseSchema] - SecondaryCarerGenerateInvitationQR', () => {
  describe('RequestSecondaryCarerGenerateInvitationQRSchema', () => {
    it('should parse valid request', () => {
      const request = {
        carerID: 1,
        timeToLive: TIME_TO_LIVE.ONE_WEEK,
      };
      const result =
        RequestSecondaryCarerGenerateInvitationQRSchema.parse(request);
      expect(result.carerID).toBe(1);
      expect(result.timeToLive).toBe(TIME_TO_LIVE.ONE_WEEK);
    });

    it('should apply default carerID when missing', () => {
      const request = {
        timeToLive: TIME_TO_LIVE.ONE_WEEK,
      };
      const result =
        RequestSecondaryCarerGenerateInvitationQRSchema.parse(request);
      expect(result.carerID).toBe(1); // default value
      expect(result.timeToLive).toBe(TIME_TO_LIVE.ONE_WEEK);
    });

    it('should throw error for missing timeToLive', () => {
      expect(() =>
        RequestSecondaryCarerGenerateInvitationQRSchema.parse({
          carerID: 1,
        })
      ).toThrow();
    });

    it('should throw error for invalid carerID type', () => {
      expect(() =>
        RequestSecondaryCarerGenerateInvitationQRSchema.parse({
          carerID: 'invalid',
          timeToLive: TIME_TO_LIVE.ONE_WEEK,
        })
      ).toThrow();
    });

    it('should throw error for invalid timeToLive', () => {
      expect(() =>
        RequestSecondaryCarerGenerateInvitationQRSchema.parse({
          carerID: 1,
          timeToLive: 'invalid' as any,
        })
      ).toThrow();
    });
  });

  describe('ResponseSecondaryCarerGenerateInvitationQRSchema', () => {
    it('should parse valid response', () => {
      const response = {
        qrData: {
          [QR_KEY.METADATA]: {
            [QR_KEY.VERSION]: QRBundlerVersionSchema.parse('1'),
          },
          [QR_KEY.PAYLOAD]: {
            [QR_KEY.ORIGIN_CARER_ID]: 1,
            [QR_KEY.ORIGIN_CARER_NAME]: 'John Doe',
            [QR_KEY.ORIGIN_CARER_EXPIRES_AT]: new Date(),
            [QR_KEY.MODULE_LIST]: [
              {
                [QR_KEY.MODULE_ID]: 1,
                [QR_KEY.MODULE_FIELD_LIST]: [1, 2, 3],
              },
            ],
          },
        },
        qrBundle: 'base64-encoded-qr-bundle',
      };
      const result =
        ResponseSecondaryCarerGenerateInvitationQRSchema.parse(response);
      expect(result.qrBundle).toBe('base64-encoded-qr-bundle');
      expect(result.qrData).toBeDefined();
    });

    it('should throw error for missing qrData', () => {
      expect(() =>
        ResponseSecondaryCarerGenerateInvitationQRSchema.parse({
          qrBundle: 'base64-encoded-qr-bundle',
        })
      ).toThrow();
    });

    it('should throw error for missing qrBundle', () => {
      expect(() =>
        ResponseSecondaryCarerGenerateInvitationQRSchema.parse({
          qrData: {},
        })
      ).toThrow();
    });

    it('should throw error for invalid qrBundle type', () => {
      expect(() =>
        ResponseSecondaryCarerGenerateInvitationQRSchema.parse({
          qrData: {},
          qrBundle: 123,
        })
      ).toThrow();
    });
  });
});
