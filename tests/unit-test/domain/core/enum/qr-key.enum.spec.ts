import { describe, expect, it } from '@jest/globals';

import {
  getQRKeyFromValue,
  QR_KEY,
  QRKeySchema,
} from '@/domain/core/enum/qr-key.enum';
import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

describe('[Enum] - QRKey', () => {
  describe('QR_KEY enum', () => {
    it('should have correct METADATA value', () => {
      expect(QR_KEY.METADATA).toBe('m');
    });

    it('should have correct PAYLOAD value', () => {
      expect(QR_KEY.PAYLOAD).toBe('p');
    });

    it('should have correct RECORD_FIELD_ID value', () => {
      expect(QR_KEY.RECORD_FIELD_ID).toBe('f');
    });

    it('should have correct RECORD_FIELD_VALUE value', () => {
      expect(QR_KEY.RECORD_FIELD_VALUE).toBe('v');
    });

    it('should have correct RECORD_MODULE_ID value', () => {
      expect(QR_KEY.RECORD_MODULE_ID).toBe('rm');
    });

    it('should have correct RECORD_DATE value', () => {
      expect(QR_KEY.RECORD_DATE).toBe('d');
    });

    it('should have correct RECORD_FIELDS value', () => {
      expect(QR_KEY.RECORD_FIELDS).toBe('rs');
    });

    it('should have correct ORIGIN_CARER_ID value', () => {
      expect(QR_KEY.ORIGIN_CARER_ID).toBe('oi');
    });

    it('should have correct ORIGIN_CARER_NAME value', () => {
      expect(QR_KEY.ORIGIN_CARER_NAME).toBe('on');
    });

    it('should have correct ORIGIN_CARER_EXPIRES_AT value', () => {
      expect(QR_KEY.ORIGIN_CARER_EXPIRES_AT).toBe('oe');
    });

    it('should have correct BUNDLE_ID value', () => {
      expect(QR_KEY.BUNDLE_ID).toBe('b');
    });

    it('should have correct RECORDS value', () => {
      expect(QR_KEY.RECORDS).toBe('rs');
    });

    it('should have correct MODULE_LIST value', () => {
      expect(QR_KEY.MODULE_LIST).toBe('ml');
    });

    it('should have correct MODULE_ID value', () => {
      expect(QR_KEY.MODULE_ID).toBe('mi');
    });

    it('should have correct MODULE_FIELD_LIST value', () => {
      expect(QR_KEY.MODULE_FIELD_LIST).toBe('mf');
    });

    it('should have correct CHUNK_INDEX value', () => {
      expect(QR_KEY.CHUNK_INDEX).toBe('i');
    });

    it('should have correct CHUNK_TOTAL value', () => {
      expect(QR_KEY.CHUNK_TOTAL).toBe('t');
    });

    it('should have correct CHUNK_DATA value', () => {
      expect(QR_KEY.CHUNK_DATA).toBe('d');
    });

    it('should have correct VERSION value', () => {
      expect(QR_KEY.VERSION).toBe('v');
    });
  });

  describe('QRKeySchema', () => {
    it('should parse valid QR_KEY values', () => {
      expect(QRKeySchema.parse('m')).toBe('m');
      expect(QRKeySchema.parse('p')).toBe('p');
      expect(QRKeySchema.parse('f')).toBe('f');
      expect(QRKeySchema.parse('v')).toBe('v');
      expect(QRKeySchema.parse('rs')).toBe('rs');
    });

    it('should throw error for invalid values', () => {
      expect(() => QRKeySchema.parse('invalid')).toThrow();
      expect(() => QRKeySchema.parse('')).toThrow();
      expect(() => QRKeySchema.parse('xyz')).toThrow();
    });
  });

  describe('getQRKeyFromValue', () => {
    it('should return correct QR_KEY for valid values', () => {
      expect(getQRKeyFromValue('m')).toBe(QR_KEY.METADATA);
      expect(getQRKeyFromValue('p')).toBe(QR_KEY.PAYLOAD);
      expect(getQRKeyFromValue('f')).toBe(QR_KEY.RECORD_FIELD_ID);
      expect(getQRKeyFromValue('rs')).toBe(QR_KEY.RECORDS);
      expect(getQRKeyFromValue('v')).toBe(QR_KEY.VERSION);
    });

    it('should throw ErrorCannotParseSchema for invalid values', () => {
      expect(() => getQRKeyFromValue('invalid')).toThrow(
        ErrorCannotParseSchema
      );
      expect(() => getQRKeyFromValue('')).toThrow(ErrorCannotParseSchema);
      expect(() => getQRKeyFromValue('xyz')).toThrow(ErrorCannotParseSchema);
    });
  });
});
