/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import {
  RequestSyncWithCarerSchema,
  ResponseSyncWithCarerSchema,
} from '@/domain/carer/use-case-schema/sync-carer.use-case-schema';

describe('[UseCaseSchema] - SyncWithCarer', () => {
  describe('RequestSyncWithCarerSchema', () => {
    it('should parse valid request with all fields', () => {
      const request = {
        carerID: 1,
        recordsImported: 10,
        status: 'success' as const,
        details: 'Sync completed successfully',
        timestamp: '2024-01-01T00:00:00Z',
      };
      const result = RequestSyncWithCarerSchema.parse(request);
      expect(result.carerID).toBe(1);
      expect(result.recordsImported).toBe(10);
      expect(result.status).toBe('success');
      expect(result.details).toBe('Sync completed successfully');
      expect(result.timestamp).toBe('2024-01-01T00:00:00Z');
    });

    it('should parse valid request with minimal fields', () => {
      const request = {
        carerID: 1,
        recordsImported: 0,
        status: 'failure' as const,
      };
      const result = RequestSyncWithCarerSchema.parse(request);
      expect(result.carerID).toBe(1);
      expect(result.recordsImported).toBe(0);
      expect(result.status).toBe('failure');
      expect(result.details).toBeUndefined();
      expect(result.timestamp).toBeUndefined();
    });

    it('should apply default carerID when missing', () => {
      const request = {
        recordsImported: 10,
        status: 'success' as const,
      };
      const result = RequestSyncWithCarerSchema.parse(request);
      expect(result.carerID).toBe(1); // default value
      expect(result.recordsImported).toBe(10);
      expect(result.status).toBe('success');
    });

    it('should throw error for missing recordsImported', () => {
      expect(() =>
        RequestSyncWithCarerSchema.parse({
          carerID: 1,
          status: 'success' as const,
        })
      ).toThrow();
    });

    it('should throw error for missing status', () => {
      expect(() =>
        RequestSyncWithCarerSchema.parse({
          carerID: 1,
          recordsImported: 10,
        })
      ).toThrow();
    });

    it('should throw error for invalid carerID type', () => {
      expect(() =>
        RequestSyncWithCarerSchema.parse({
          carerID: 'invalid',
          recordsImported: 10,
          status: 'success' as const,
        })
      ).toThrow();
    });

    it('should throw error for negative recordsImported', () => {
      expect(() =>
        RequestSyncWithCarerSchema.parse({
          carerID: 1,
          recordsImported: -1,
          status: 'success' as const,
        })
      ).toThrow();
    });

    it('should throw error for invalid status', () => {
      expect(() =>
        RequestSyncWithCarerSchema.parse({
          carerID: 1,
          recordsImported: 10,
          status: 'invalid' as any,
        })
      ).toThrow();
    });
  });

  describe('ResponseSyncWithCarerSchema', () => {
    it('should parse void response', () => {
      const result = ResponseSyncWithCarerSchema.parse(undefined);
      expect(result).toBeUndefined();
    });
  });
});
