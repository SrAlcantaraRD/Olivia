/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import {
  RequestRefreshSummarySchema,
  ResponseRefreshSummarySchema,
} from '@/domain/summary/use-case-schema/refresh-summary.use-case-schema';

describe('[UseCaseSchema] - RefreshSummary', () => {
  describe('RequestRefreshSummarySchema', () => {
    it('should parse valid request', () => {
      const request = {
        moduleIds: [1, 2, 3],
      };
      const result = RequestRefreshSummarySchema.parse(request);
      expect(result.moduleIds).toEqual([1, 2, 3]);
    });

    it('should parse empty moduleIds array', () => {
      const request = {
        moduleIds: [],
      };
      const result = RequestRefreshSummarySchema.parse(request);
      expect(result.moduleIds).toEqual([]);
    });

    it('should throw error for missing moduleIds', () => {
      expect(() => RequestRefreshSummarySchema.parse({})).toThrow();
    });

    it('should throw error for invalid moduleIds type', () => {
      expect(() =>
        RequestRefreshSummarySchema.parse({
          moduleIds: 'invalid',
        })
      ).toThrow();
    });

    it('should throw error for invalid moduleId in array', () => {
      expect(() =>
        RequestRefreshSummarySchema.parse({
          moduleIds: [1, 'invalid', 3],
        })
      ).toThrow();
    });
  });

  describe('ResponseRefreshSummarySchema', () => {
    it('should parse void response', () => {
      const result = ResponseRefreshSummarySchema.parse(undefined);
      expect(result).toBeUndefined();
    });
  });
});
