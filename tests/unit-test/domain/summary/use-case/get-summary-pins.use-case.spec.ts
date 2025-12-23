/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { GetSummaryPinsUseCase } from '@/domain/summary/use-case/get-summary-pins.use-case';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockSummaryPin } from '@/tests/mocks/summary.entity.mock';
import { mockSummaryPinsPort } from '@/tests/mocks/summary.port.mock';

describe('[UseCase] - GetSummaryPins', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const summaryPinsAdapter = mockSummaryPinsPort();

    const useCase = new GetSummaryPinsUseCase({
      loggerAdapter,
      summaryPinsAdapter,
    });

    return { useCase, summaryPinsAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  it('returns pin list from adapter', async () => {
    const { useCase, summaryPinsAdapter } = prepareSuiteCase();
    const pins = [mockSummaryPin({ targetId: 'module-1' })];
    summaryPinsAdapter.list.mockResolvedValue(pins);

    const response = await useCase.execute();

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success response');
    }

    expect(response.details.items).toEqual(pins);
    expect(summaryPinsAdapter.list).toHaveBeenCalled();
  });
});
