/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { SyncWithCarerUseCase } from '@/domain/carer/use-case/sync-carer.use-case';
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

      const request = {}; // Empty request as per schema

      const response = await useCase.execute(request);

      expect(response.success).toBe(true);
      expect(response.message).toBe('common.success');
      expect(response.details).toBeUndefined();

      expect(loggerAdapter.debug).toHaveBeenCalledWith(
        'SyncWithCarerUseCase',
        request
      );
    });
  });

  describe('Negative Path', () => {
    it('should return error when request validation fails', async () => {
      const { useCase, loggerAdapter } = prepareSuiteCase();

      const invalidRequest = { invalidField: 'invalid' };

      const response = await useCase.execute(invalidRequest);

      expect(response.success).toBe(false);
      expect(response.message).toBe('use-case.sync-with-carer.invalid-request');

      expect(loggerAdapter.error).toHaveBeenCalledWith(
        'SyncWithCarerUseCase',
        expect.any(String)
      );
    });
  });
});
