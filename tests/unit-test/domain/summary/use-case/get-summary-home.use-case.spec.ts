/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { GetSummaryHomeUseCase } from '@/domain/summary/use-case/get-summary-home.use-case';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import {
  mockSummaryModule,
  mockSummaryPin,
} from '@/tests/mocks/summary.entity.mock';
import {
  mockSummaryModulePort,
  mockSummaryPinsPort,
} from '@/tests/mocks/summary.port.mock';

describe('[UseCase] - GetSummaryHome', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const summaryModuleAdapter = mockSummaryModulePort();
    const summaryPinsAdapter = mockSummaryPinsPort();

    const useCase = new GetSummaryHomeUseCase({
      loggerAdapter,
      summaryModuleAdapter,
      summaryPinsAdapter,
    });

    return { useCase, summaryModuleAdapter, summaryPinsAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  it('returns combined modules and pins', async () => {
    const { useCase, summaryModuleAdapter, summaryPinsAdapter } =
      prepareSuiteCase();
    const modules = [mockSummaryModule({ moduleId: 1 })];
    const pins = [mockSummaryPin({ targetId: 'module-1' })];
    summaryModuleAdapter.getModuleSummaries.mockResolvedValue(modules);
    summaryPinsAdapter.list.mockResolvedValue(pins);

    const response = await useCase.execute({ moduleIds: [1] });

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success response');
    }

    expect(response.details.modules).toEqual(modules);
    expect(response.details.pins).toEqual(pins);
    expect(summaryModuleAdapter.getModuleSummaries).toHaveBeenCalledWith([1]);
    expect(summaryPinsAdapter.list).toHaveBeenCalled();
  });
});
