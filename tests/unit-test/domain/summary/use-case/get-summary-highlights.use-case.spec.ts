/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { GetSummaryHighlightsUseCase } from '@/domain/summary/use-case/get-summary-highlights.use-case';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockSummaryHighlight } from '@/tests/mocks/summary.entity.mock';
import { mockSummaryHighlightPort } from '@/tests/mocks/summary.port.mock';

describe('[UseCase] - GetSummaryHighlights', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const summaryHighlightAdapter = mockSummaryHighlightPort();

    const useCase = new GetSummaryHighlightsUseCase({
      loggerAdapter,
      summaryHighlightAdapter,
    });

    return { useCase, summaryHighlightAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  it('returns highlight items when the adapter succeeds', async () => {
    const { useCase, summaryHighlightAdapter } = prepareSuiteCase();
    const highlights = [mockSummaryHighlight({ id: 'highlight-1' })];
    summaryHighlightAdapter.listSummaryHighlights.mockResolvedValue(highlights);

    const response = await useCase.execute();

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success response');
    }

    expect(response.details.items).toEqual(highlights);
    expect(summaryHighlightAdapter.listSummaryHighlights).toHaveBeenCalled();
  });
});
