/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { ReorderSummaryPinsUseCase } from '@/domain/summary/use-case/reorder-summary-pins.use-case';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockSummaryPin } from '@/tests/mocks/summary.entity.mock';
import { mockSummaryPinsPort } from '@/tests/mocks/summary.port.mock';

describe('[UseCase] - ReorderSummaryPins', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const summaryPinsAdapter = mockSummaryPinsPort();

    const useCase = new ReorderSummaryPinsUseCase({
      loggerAdapter,
      summaryPinsAdapter,
    });

    return { useCase, summaryPinsAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  it('assigns sequential order to the provided pin list', async () => {
    const { useCase, summaryPinsAdapter } = prepareSuiteCase();
    const pins = [
      mockSummaryPin({ targetId: 'module-1', order: 5 }),
      mockSummaryPin({ targetId: 'module-2', order: 2 }),
    ];

    const response = await useCase.execute({ pins });

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success response');
    }

    expect(summaryPinsAdapter.replaceAll).toHaveBeenCalledTimes(1);
    const [nextPins] = summaryPinsAdapter.replaceAll.mock.calls[0];
    expect(nextPins[0].order).toBe(0);
    expect(nextPins[1].order).toBe(1);
    expect(response.details.pins).toEqual(nextPins);
  });
});
