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
});
