/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { GetSummaryTrendsUseCase } from '@/domain/summary/use-case/get-summary-trends.use-case';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockSummaryTrend } from '@/tests/mocks/summary.entity.mock';
import { mockSummaryTrendPort } from '@/tests/mocks/summary.port.mock';

describe('[UseCase] - GetSummaryTrends', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const summaryTrendAdapter = mockSummaryTrendPort();

    const useCase = new GetSummaryTrendsUseCase({
      loggerAdapter,
      summaryTrendAdapter,
    });

    return { useCase, summaryTrendAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  it('returns trend items from the adapter', async () => {
    const { useCase, summaryTrendAdapter } = prepareSuiteCase();
    const trends = [mockSummaryTrend()];
    summaryTrendAdapter.listSummaryTrends.mockResolvedValue(trends);

    const response = await useCase.execute();

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success response');
    }

    expect(response.details.items).toEqual(trends);
    expect(summaryTrendAdapter.listSummaryTrends).toHaveBeenCalled();
  });
});
