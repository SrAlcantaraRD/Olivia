import { describe, expect, it } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { useWipeLocalData } from '@/domain/core/hook/use-wipe-local-data.hook';
import {
  mockCachePort,
  mockLoggerPort,
  mockSecureStorePort,
} from '@/tests/mocks/core.port.mock';

describe('[Hook] - UseWipeLocalData', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const cacheAdapter = mockCachePort();
    const secureStoreAdapter = mockSecureStorePort();
    return { loggerAdapter, cacheAdapter, secureStoreAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  it('executes wipe successfully when called', async () => {
    const { loggerAdapter, cacheAdapter, secureStoreAdapter } =
      prepareSuiteCase();

    // Act
    const { result } = renderHook(() =>
      useWipeLocalData({
        loggerAdapter,
        cacheAdapter,
        secureStoreAdapter,
      })
    );

    let response;
    await act(async () => {
      response = await result.current.execute();
    });

    // Assert
    expect(response.success).toBe(true);
    expect(cacheAdapter.clearAll).toHaveBeenCalled();
    expect(secureStoreAdapter.clearAll).toHaveBeenCalled();
  });
});
