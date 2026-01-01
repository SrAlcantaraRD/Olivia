/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { RefreshSummarySnapshotsUseCase } from '@/domain/summary/use-case/refresh-summary-snapshots.use-case';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import {
  mockSummaryHighlight,
  mockSummaryModule,
  mockSummaryTrend,
} from '@/tests/mocks/summary.entity.mock';
import {
  mockSummaryHighlightPort,
  mockSummaryModulePort,
  mockSummarySnapshotPort,
  mockSummaryTrendPort,
} from '@/tests/mocks/summary.port.mock';

describe('[UseCase] - RefreshSummarySnapshots', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const summaryModuleAdapter = mockSummaryModulePort();
    const summaryTrendAdapter = mockSummaryTrendPort();
    const summaryHighlightAdapter = mockSummaryHighlightPort();
    const summarySnapshotAdapter = mockSummarySnapshotPort();

    const useCase = new RefreshSummarySnapshotsUseCase({
      loggerAdapter,
      summaryModuleAdapter,
      summaryTrendAdapter,
      summaryHighlightAdapter,
      summarySnapshotAdapter,
    });

    return {
      useCase,
      summaryModuleAdapter,
      summaryTrendAdapter,
      summaryHighlightAdapter,
      summarySnapshotAdapter,
    };
  };

  beforeEach(() => jest.clearAllMocks());

  it('stores the refreshed snapshot and returns the persisted details', async () => {
    const {
      useCase,
      summaryModuleAdapter,
      summaryTrendAdapter,
      summaryHighlightAdapter,
      summarySnapshotAdapter,
    } = prepareSuiteCase();

    const modules = [mockSummaryModule({ moduleId: 1 })];
    const trends = [mockSummaryTrend({ id: 'trend-1' })];
    const highlights = [mockSummaryHighlight({ id: 'highlight-1' })];
    summaryModuleAdapter.getModuleSummaries.mockResolvedValue(modules);
    summaryTrendAdapter.listSummaryTrends.mockResolvedValue(trends);
    summaryHighlightAdapter.listSummaryHighlights.mockResolvedValue(highlights);

    const response = await useCase.execute({ moduleIds: [1, 2] });

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success response');
    }

    expect(response.details.modules).toEqual(modules);
    expect(response.details.trends).toEqual(trends);
    expect(response.details.highlights).toEqual(highlights);
    expect(response.details.updatedAt).toEqual(expect.any(String));
    expect(summarySnapshotAdapter.setSnapshot).toHaveBeenCalledWith(
      response.details
    );
    expect(summaryModuleAdapter.getModuleSummaries).toHaveBeenCalledWith([
      1, 2,
    ]);
  });
});
