/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import { GetSummaryDetailUseCase } from '@/domain/summary/use-case/get-summary-detail.use-case';
import { SUMMARY_DETAIL_TYPE_ENUM } from '@/domain/summary/enum/summary-detail-type.enum';
import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockSummaryDetail } from '@/tests/mocks/summary.entity.mock';
import { mockSummaryDetailPort } from '@/tests/mocks/summary.port.mock';

describe('[UseCase] - GetSummaryDetail', () => {
  const prepareSuiteCase = () => {
    const summaryDetailAdapter = mockSummaryDetailPort();
    const loggerAdapter = mockLoggerPort();

    const useCase = new GetSummaryDetailUseCase({
      loggerAdapter,
      summaryDetailAdapter,
    });

    return { useCase, summaryDetailAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  it('returns module detail when module type is requested with a module id', async () => {
    const { useCase, summaryDetailAdapter } = prepareSuiteCase();
    const expectedDetail = mockSummaryDetail({
      type: SUMMARY_DETAIL_TYPE_ENUM.MODULE,
    });
    summaryDetailAdapter.getSummaryDetailByModule.mockResolvedValue(
      expectedDetail
    );

    const response = await useCase.execute({
      type: SUMMARY_DETAIL_TYPE_ENUM.MODULE,
      moduleId: 1,
      period: SUMMARY_PERIOD_ENUM.WEEK,
    });

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success response');
    }

    expect(response.details).toEqual(expectedDetail);
    expect(summaryDetailAdapter.getSummaryDetailByModule).toHaveBeenCalledWith({
      moduleId: 1,
      period: SUMMARY_PERIOD_ENUM.WEEK,
    });
  });

  it('returns field detail when field type is requested with module and field ids', async () => {
    const { useCase, summaryDetailAdapter } = prepareSuiteCase();
    const expectedDetail = mockSummaryDetail({
      type: SUMMARY_DETAIL_TYPE_ENUM.FIELD,
      targetId: 'field-1',
    });
    summaryDetailAdapter.getSummaryDetailByField.mockResolvedValue(
      expectedDetail
    );

    const response = await useCase.execute({
      type: SUMMARY_DETAIL_TYPE_ENUM.FIELD,
      moduleId: 1,
      fieldId: 2,
      period: SUMMARY_PERIOD_ENUM.MONTH,
    });

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success response');
    }

    expect(response.details).toEqual(expectedDetail);
    expect(summaryDetailAdapter.getSummaryDetailByField).toHaveBeenCalledWith({
      moduleId: 1,
      fieldId: 2,
      period: SUMMARY_PERIOD_ENUM.MONTH,
    });
  });

  it('returns trend detail when trend type is requested with a trend id', async () => {
    const { useCase, summaryDetailAdapter } = prepareSuiteCase();
    const expectedDetail = mockSummaryDetail({
      type: SUMMARY_DETAIL_TYPE_ENUM.TREND,
      targetId: 'trend-1',
    });
    summaryDetailAdapter.getSummaryDetailByTrend.mockResolvedValue(
      expectedDetail
    );

    const response = await useCase.execute({
      type: SUMMARY_DETAIL_TYPE_ENUM.TREND,
      trendId: 'trend-1',
      period: SUMMARY_PERIOD_ENUM.YEAR,
    });

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success response');
    }

    expect(response.details).toEqual(expectedDetail);
    expect(summaryDetailAdapter.getSummaryDetailByTrend).toHaveBeenCalledWith({
      trendId: 'trend-1',
      period: SUMMARY_PERIOD_ENUM.YEAR,
    });
  });

  it('returns failure when required parameters are missing', async () => {
    const { useCase, summaryDetailAdapter } = prepareSuiteCase();

    const response = await useCase.execute({
      type: SUMMARY_DETAIL_TYPE_ENUM.MODULE,
      period: SUMMARY_PERIOD_ENUM.DAY,
    });

    expect(response.success).toBe(false);
    expect(response.message).toBe('summary.detail.invalid-params');
    expect(
      summaryDetailAdapter.getSummaryDetailByModule
    ).not.toHaveBeenCalled();
    expect(summaryDetailAdapter.getSummaryDetailByField).not.toHaveBeenCalled();
    expect(summaryDetailAdapter.getSummaryDetailByTrend).not.toHaveBeenCalled();
  });
});
