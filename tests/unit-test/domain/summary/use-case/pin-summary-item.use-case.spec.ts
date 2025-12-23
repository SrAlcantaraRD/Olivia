/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { PinSummaryItemUseCase } from '@/domain/summary/use-case/pin-summary-item.use-case';
import { SUMMARY_PIN_TYPE_ENUM } from '@/domain/summary/enum/summary-pin-type.enum';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockSummaryPin } from '@/tests/mocks/summary.entity.mock';
import { mockSummaryPinsPort } from '@/tests/mocks/summary.port.mock';

describe('[UseCase] - PinSummaryItem', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const summaryPinsAdapter = mockSummaryPinsPort();

    const useCase = new PinSummaryItemUseCase({
      loggerAdapter,
      summaryPinsAdapter,
    });

    return { useCase, summaryPinsAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  it('returns current pins when the item is already pinned', async () => {
    const { useCase, summaryPinsAdapter } = prepareSuiteCase();
    const pinnedItem = mockSummaryPin({
      type: SUMMARY_PIN_TYPE_ENUM.MODULE,
      targetId: 'module-1',
    });
    summaryPinsAdapter.list.mockResolvedValue([pinnedItem]);

    const response = await useCase.execute({
      type: SUMMARY_PIN_TYPE_ENUM.MODULE,
      targetId: 'module-1',
    });

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success response');
    }

    expect(response.details.pins).toEqual([pinnedItem]);
    expect(summaryPinsAdapter.replaceAll).not.toHaveBeenCalled();
  });

  it('adds a new pin when the item is not yet pinned', async () => {
    const { useCase, summaryPinsAdapter } = prepareSuiteCase();
    const currentPins = [
      mockSummaryPin({
        type: SUMMARY_PIN_TYPE_ENUM.MODULE,
        targetId: 'module-1',
      }),
    ];
    summaryPinsAdapter.list.mockResolvedValue(currentPins);

    const response = await useCase.execute({
      type: SUMMARY_PIN_TYPE_ENUM.MODULE,
      targetId: 'module-2',
    });

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success response');
    }

    expect(summaryPinsAdapter.replaceAll).toHaveBeenCalledTimes(1);
    const [nextPins] = summaryPinsAdapter.replaceAll.mock.calls[0];
    expect(nextPins).toHaveLength(2);
    expect(nextPins[1]).toMatchObject({
      type: SUMMARY_PIN_TYPE_ENUM.MODULE,
      targetId: 'module-2',
      order: 1,
      pinnedAt: expect.any(String),
    });
    expect(response.details.pins).toEqual(nextPins);
  });
});
