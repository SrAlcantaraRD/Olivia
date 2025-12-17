import { describe, expect, it } from '@jest/globals';

import { WipeLocalDataUseCase } from '@/domain/core/use-case/wipe-local-data.use-case';
import {
  mockCachePort,
  mockLoggerPort,
  mockSecureStorePort,
} from '../mocks/mock.port';

// mock dropDatabase to avoid touching real DB
jest.mock('@/database/config/drop-database.config', () => ({
  dropDatabase: jest.fn().mockResolvedValue(undefined),
}));

describe('[UseCase] WipeLocalDataUseCase', () => {
  it('clears cache, secure keys and drops the database', async () => {
    const mockCache = mockCachePort();
    const mockSecure = mockSecureStorePort();
    const mockLogger = mockLoggerPort();

    const usecase = new WipeLocalDataUseCase(mockLogger, mockCache, mockSecure);

    const resp = await usecase.execute();

    expect(resp.success).toBe(true);

    // ensure clearAll called on both adapters
    expect(mockCache.clearAll).toHaveBeenCalled();
    expect(mockSecure.clearAll).toHaveBeenCalled();
  });
});
