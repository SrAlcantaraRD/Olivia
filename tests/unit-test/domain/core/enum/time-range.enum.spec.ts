import { describe, expect, it } from '@jest/globals';

import {
  TIME_RANGE_ENUM,
  TIME_RANGE_I18N_MAP,
  TIME_RANGE_VALUES,
} from '@/domain/core/enum/time-range.enum';

describe('[Enum] - TimeRange', () => {
  describe('TIME_RANGE_ENUM enum', () => {
    it('should have correct TODAY value', () => {
      expect(TIME_RANGE_ENUM.TODAY).toBe('today');
    });

    it('should have correct WEEK_7D value', () => {
      expect(TIME_RANGE_ENUM.WEEK_7D).toBe('7d');
    });

    it('should have correct MONTH_30D value', () => {
      expect(TIME_RANGE_ENUM.MONTH_30D).toBe('30d');
    });

    it('should have correct QUARTER_90D value', () => {
      expect(TIME_RANGE_ENUM.QUARTER_90D).toBe('90d');
    });

    it('should contain all expected values', () => {
      const expectedValues = ['today', '7d', '30d', '90d'];
      const actualValues = Object.values(TIME_RANGE_ENUM);
      expect(actualValues).toEqual(expectedValues);
    });
  });

  describe('TIME_RANGE_I18N_MAP', () => {
    it('should map TODAY to correct i18n key', () => {
      expect(TIME_RANGE_I18N_MAP[TIME_RANGE_ENUM.TODAY]).toBe(
        'page.history-detail.range.today'
      );
    });

    it('should map WEEK_7D to correct i18n key', () => {
      expect(TIME_RANGE_I18N_MAP[TIME_RANGE_ENUM.WEEK_7D]).toBe(
        'page.history-detail.range.7d'
      );
    });

    it('should map MONTH_30D to correct i18n key', () => {
      expect(TIME_RANGE_I18N_MAP[TIME_RANGE_ENUM.MONTH_30D]).toBe(
        'page.history-detail.range.30d'
      );
    });

    it('should map QUARTER_90D to correct i18n key', () => {
      expect(TIME_RANGE_I18N_MAP[TIME_RANGE_ENUM.QUARTER_90D]).toBe(
        'page.history-detail.range.90d'
      );
    });
  });

  describe('TIME_RANGE_VALUES', () => {
    it('should contain all TIME_RANGE_ENUM values', () => {
      const expectedValues = ['today', '7d', '30d', '90d'];
      expect(TIME_RANGE_VALUES).toEqual(expectedValues);
    });

    it('should be an array of TIME_RANGE_ENUM values', () => {
      TIME_RANGE_VALUES.forEach((value) => {
        expect(Object.values(TIME_RANGE_ENUM)).toContain(value);
      });
    });
  });
});
