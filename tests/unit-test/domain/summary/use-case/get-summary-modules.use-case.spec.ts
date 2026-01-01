/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { GetSummaryModulesUseCase } from '@/domain/summary/use-case/get-summary-modules.use-case';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockSummaryModule } from '@/tests/mocks/summary.entity.mock';
import { mockSummaryModulePort } from '@/tests/mocks/summary.port.mock';

describe('[UseCase] - GetSummaryModules', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const summaryModuleAdapter = mockSummaryModulePort();

    const useCase = new GetSummaryModulesUseCase({
      loggerAdapter,
      summaryModuleAdapter,
    });

    return { useCase, summaryModuleAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  it('returns module summaries filtered by ids', async () => {
    const { useCase, summaryModuleAdapter } = prepareSuiteCase();
    const modules = [mockSummaryModule({ moduleId: 1 })];
    summaryModuleAdapter.getModuleSummaries.mockResolvedValue(modules);

    const response = await useCase.execute({ moduleIds: [1] });

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success response');
    }

    expect(response.details.items).toEqual(modules);
    expect(summaryModuleAdapter.getModuleSummaries).toHaveBeenCalledWith([1]);
  });
});
