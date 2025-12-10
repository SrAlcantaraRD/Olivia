import { describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { useWipeLocalData } from '@/domain/core/hook/use-wipe-local-data.hook';
import {
  mockCachePort,
  mockLoggerPort,
  mockSecureStorePort,
} from '/Users/gabriel/Documents/personal/UOC/2025_2026_01/TFG/tests/unit-test/domain/core/mocks/mock.port';

// mock dropDatabase to avoid touching real DB
jest.mock('@/database/config/drop-database.config', () => ({
  dropDatabase: jest.fn().mockResolvedValue(undefined),
}));

describe('useWipeLocalData', () => {
  it('executes wipe and returns success', async () => {
    const mockCache = mockCachePort();
    const mockSecure = mockSecureStorePort();
    const mockLogger = mockLoggerPort();

    const { result } = renderHook(() =>
      useWipeLocalData({
        loggerAdapter: mockLogger,
        cacheAdapter: mockCache,
        secureStoreAdapter: mockSecure,
      })
    );

    let resp: unknown;
    await act(async () => {
      resp = await result.current.execute();
    });

    expect((resp as { success: boolean }).success).toBe(true);
    expect(mockCache.delete).toHaveBeenCalled();
    expect(mockSecure.delete).toHaveBeenCalled();
  });
});
