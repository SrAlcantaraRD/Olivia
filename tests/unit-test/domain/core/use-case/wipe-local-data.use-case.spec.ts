import { describe, expect, it } from '@jest/globals';

import { WipeLocalDataUseCase } from '@/domain/core/use-case/wipe-local-data.use-case';
import {
  mockCachePort,
  mockLoggerPort,
  mockSecureStorePort,
} from '@/tests/mocks/core.port.mock';

describe('[UseCase] - WipeLocalData', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const cacheAdapter = mockCachePort();
    const secureStoreAdapter = mockSecureStorePort();
    const unit = new WipeLocalDataUseCase(
      loggerAdapter,
      cacheAdapter,
      secureStoreAdapter
    );
    return { unit, loggerAdapter, cacheAdapter, secureStoreAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  it('clears cache, secure keys and drops the database', async () => {
    const { unit, cacheAdapter, secureStoreAdapter } = prepareSuiteCase();

    // Act
    const resp = await unit.execute();

    // Assert
    expect(resp.success).toBe(true);
    expect(cacheAdapter.clearAll).toHaveBeenCalled();
    expect(secureStoreAdapter.clearAll).toHaveBeenCalled();
  });

  it('handles cache clear error gracefully', async () => {
    const { unit, cacheAdapter, loggerAdapter } = prepareSuiteCase();

    cacheAdapter.clearAll.mockRejectedValue(new Error('Cache clear failed'));

    // Act
    const resp = await unit.execute();

    // Assert
    expect(resp.success).toBe(false);
    expect(resp.message).toBe('common.error');
    expect(loggerAdapter.error).toHaveBeenCalled();
  });

  it('handles secure store clear error gracefully', async () => {
    const { unit, secureStoreAdapter, loggerAdapter } = prepareSuiteCase();

    secureStoreAdapter.clearAll.mockRejectedValue(
      new Error('Secure store clear failed')
    );

    // Act
    const resp = await unit.execute();

    // Assert
    expect(resp.success).toBe(false);
    expect(resp.message).toBe('common.error');
    expect(loggerAdapter.error).toHaveBeenCalled();
  });
});
