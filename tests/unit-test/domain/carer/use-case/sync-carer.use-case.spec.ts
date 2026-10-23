/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { SyncWithCarerUseCase } from '@/domain/carer/use-case/sync-carer.use-case';
import type { TRequestSyncWithCarer } from '@/domain/carer/use-case-schema/sync-carer.use-case-schema';
import { mockCachePort, mockLoggerPort } from '@/tests/mocks/core.port.mock';

describe('[UseCase] - SyncWithCarer', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const cacheAdapter = mockCachePort();

    const useCase = new SyncWithCarerUseCase({
      loggerAdapter,
      cacheAdapter,
    });

    return { useCase, loggerAdapter, cacheAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('should sync with carer successfully', async () => {
      const { useCase, loggerAdapter } = prepareSuiteCase();

      const request: TRequestSyncWithCarer = {
        carerID: 1,
        recordsImported: 5,
        status: 'success',
      };

      const response = await useCase.execute(request);

      // TResponseSyncWithCarer is void: the success branch carries no data.
      expect(response).toEqual({
        success: true,
        message: 'common.success',
        details: undefined,
      });

      expect(loggerAdapter.debug).toHaveBeenCalledWith(
        expect.objectContaining({
          useCase: 'sync-with-carer',
          message: 'SyncWithCarerUseCase',
          details: request,
        })
      );
    });

    it('should sync with carer accepting optional details and timestamp', async () => {
      const { useCase } = prepareSuiteCase();

      const request: TRequestSyncWithCarer = {
        carerID: 1,
        recordsImported: 2,
        status: 'failure',
        details: 'chunk-3 corrupted',
        timestamp: '2026-10-22T10:00:00.000Z',
      };

      const response = await useCase.execute(request);

      expect(response.success).toBe(true);
      expect(response.message).toBe('common.success');
    });
  });

  describe('Negative Path', () => {
    it('should return error when request validation fails', async () => {
      const { useCase, loggerAdapter } = prepareSuiteCase();

      const invalidRequest = { invalidField: 'invalid' };

      const response = await useCase.execute(
        invalidRequest as unknown as TRequestSyncWithCarer
      );

      expect(response.success).toBe(false);
      expect(response.message).toBe('use-case.sync-with-carer.invalid-request');

      expect(loggerAdapter.error).toHaveBeenCalledWith(
        expect.objectContaining({
          useCase: 'sync-with-carer',
          message: 'SyncWithCarerUseCase',
        })
      );
    });

    it('should return error when recordsImported is negative', async () => {
      const { useCase } = prepareSuiteCase();

      const invalidRequest: TRequestSyncWithCarer = {
        carerID: 1,
        recordsImported: -1,
        status: 'success',
      };

      const response = await useCase.execute(invalidRequest);

      expect(response.success).toBe(false);
      expect(response.message).toBe('use-case.sync-with-carer.invalid-request');
    });
  });
});
