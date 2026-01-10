import { BASE_SUMMARY_MODULE } from '@/domain/summary/entity/summary-module.entity';
import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import { GetSummaryModuleDetailByPeriodUseCase } from '@/domain/summary/use-case/get-summary-module-detail-by-period.use-case';
import { mockCachePort, mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockSummaryModuleField } from '@/tests/mocks/summary.entity.mock';
import {
  mockSummaryModuleFieldPort,
  mockSummaryModulePort,
} from '@/tests/mocks/summary.port.mock';

describe('[UseCase] - GetSummaryModuleDetailByPeriod', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const cacheAdapter = mockCachePort();
    const summaryModuleAdapter = mockSummaryModulePort();
    const summaryModuleFieldAdapter = mockSummaryModuleFieldPort();

    const useCase = new GetSummaryModuleDetailByPeriodUseCase({
      loggerAdapter,
      cacheAdapter,
      summaryModuleAdapter,
      summaryModuleFieldAdapter,
    });

    return {
      useCase,
      summaryModuleAdapter,
      summaryModuleFieldAdapter,
    };
  };

  const buildModuleDetail = () => ({
    ...BASE_SUMMARY_MODULE,
    metadata: {
      ...BASE_SUMMARY_MODULE.metadata,
      module: {
        ...BASE_SUMMARY_MODULE.metadata.module,
        id: 1,
      },
    },
  });

  beforeEach(() => jest.clearAllMocks());

  it('fetches module details and enriches fields', async () => {
    const { useCase, summaryModuleAdapter, summaryModuleFieldAdapter } =
      prepareSuiteCase();

    const detail = buildModuleDetail();
    const fields = [mockSummaryModuleField({ metadata: { moduleID: 1 } })];
    summaryModuleAdapter.getDetails.mockResolvedValue(detail);
    summaryModuleFieldAdapter.getByModuleID.mockResolvedValue(fields);

    const response = await useCase.execute({
      moduleID: 1,
      period: SUMMARY_PERIOD_ENUM.WEEK,
    });

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success response');
    }

    expect(response.details).toEqual(detail);
    expect(response.details.summaryModuleFieldList).toEqual(fields);
    expect(summaryModuleAdapter.getDetails).toHaveBeenCalledWith({
      id: 1,
      period: SUMMARY_PERIOD_ENUM.WEEK,
    });
    expect(summaryModuleFieldAdapter.getByModuleID).toHaveBeenCalledWith({
      moduleID: 1,
      period: SUMMARY_PERIOD_ENUM.WEEK,
    });
  });
});
