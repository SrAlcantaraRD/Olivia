/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { UnpinSummaryItemUseCase } from '@/domain/summary/use-case/unpin-summary-item.use-case';
import { SUMMARY_PIN_TYPE_ENUM } from '@/domain/summary/enum/summary-pin-type.enum';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockSummaryPin } from '@/tests/mocks/summary.entity.mock';
import { mockSummaryPinsPort } from '@/tests/mocks/summary.port.mock';

describe('[UseCase] - UnpinSummaryItem', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const summaryPinsAdapter = mockSummaryPinsPort();

    const useCase = new UnpinSummaryItemUseCase({
      loggerAdapter,
      summaryPinsAdapter,
    });

    return { useCase, summaryPinsAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  it('removes the specified pin and reorders the list', async () => {
    const { useCase, summaryPinsAdapter } = prepareSuiteCase();
    const pinnedList = [
      mockSummaryPin({
        type: SUMMARY_PIN_TYPE_ENUM.MODULE,
        targetId: 'module-1',
      }),
      mockSummaryPin({
        type: SUMMARY_PIN_TYPE_ENUM.MODULE,
        targetId: 'module-2',
      }),
    ];
    summaryPinsAdapter.list.mockResolvedValue(pinnedList);

    const response = await useCase.execute({
      type: SUMMARY_PIN_TYPE_ENUM.MODULE,
      targetId: 'module-1',
    });

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success response');
    }

    expect(summaryPinsAdapter.replaceAll).toHaveBeenCalledTimes(1);
    const [updatedPins] = summaryPinsAdapter.replaceAll.mock.calls[0];
    expect(updatedPins).toHaveLength(1);
    expect(updatedPins[0].targetId).toBe('module-2');
    expect(updatedPins[0].order).toBe(0);
    expect(response.details.pins).toEqual(updatedPins);
  });
});
