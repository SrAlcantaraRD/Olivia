import { CheckCarerExistenceUseCase } from '@/domain/carer/use-case/check-carer-existence.use-case';
import { CACHE_KEY_ENUM } from '@/domain/core/port/cache.port';
import { mockCachePort, mockLoggerPort } from '@/tests/mocks/core.port.mock';

describe('[UseCase] - CheckCarerExistence', () => {
  const prepareSuiteCase = () => {
    const cacheAdapter = mockCachePort();
    const loggerAdapter = mockLoggerPort();

    const useCase = new CheckCarerExistenceUseCase({
      loggerAdapter,
      cacheAdapter,
    });

    return { useCase, cacheAdapter, loggerAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('returns exists true when carer exists', async () => {
      const { useCase, cacheAdapter } = prepareSuiteCase();
      cacheAdapter.get.mockResolvedValue(1);

      const response = await useCase.execute();

      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.details.exists).toBe(true);
      }
      expect(cacheAdapter.get).toHaveBeenCalledWith(CACHE_KEY_ENUM.CARER);
    });

    it('returns exists false when no carer exists', async () => {
      const { useCase, cacheAdapter } = prepareSuiteCase();
      cacheAdapter.get.mockResolvedValue(null);

      const response = await useCase.execute();

      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.details.exists).toBe(false);
      }
      expect(cacheAdapter.get).toHaveBeenCalledWith(CACHE_KEY_ENUM.CARER);
    });
  });

  describe('Negative Path', () => {
    it('throws error when port fails', async () => {
      const { useCase, cacheAdapter } = prepareSuiteCase();
      cacheAdapter.get.mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute()).rejects.toThrow('Database error');
      expect(cacheAdapter.get).toHaveBeenCalledWith(CACHE_KEY_ENUM.CARER);
    });
  });
});
