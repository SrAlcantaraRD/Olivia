import { describe, expect, it } from '@jest/globals';

import { CACHE_KEY_ENUM } from '@/domain/core/port/cache.port';
import { WipeLocalDataUseCase } from '@/domain/core/use-case/wipe-local-data.use-case';
import {
  mockCachePort,
  mockLoggerPort,
  mockSecureStorePort,
} from '../mocks/mock.port';

describe('[UseCase] WipeLocalDataUseCase', () => {
  it('deletes cache keys, secure keys and drops the database', async () => {
    const mockCache = mockCachePort();
    const mockSecure = mockSecureStorePort();
    const mockLogger = mockLoggerPort();

    const usecase = new WipeLocalDataUseCase(mockLogger, mockCache, mockSecure);

    const resp = await usecase.execute();

    expect(resp.success).toBe(true);

    const keys = Object.values(CACHE_KEY_ENUM);
    // ensure delete called for each key on both adapters
    expect(mockCache.delete).toHaveBeenCalledTimes(keys.length);
    expect(mockSecure.delete).toHaveBeenCalledTimes(keys.length);
  });
});
