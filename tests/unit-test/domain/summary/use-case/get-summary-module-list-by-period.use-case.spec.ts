import { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import { GetSummaryModuleListByPeriodUseCase } from '@/domain/summary/use-case/get-summary-module-list-by-period.use-case';
import { mockCachePort, mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockSummaryModule } from '@/tests/mocks/summary.entity.mock';
import { mockSummaryModulePort } from '@/tests/mocks/summary.port.mock';

describe('[UseCase] - GetSummaryModuleListByPeriod', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const cacheAdapter = mockCachePort();
    const summaryModuleAdapter = mockSummaryModulePort();

    const useCase = new GetSummaryModuleListByPeriodUseCase({
      loggerAdapter,
      cacheAdapter,
      summaryModuleAdapter,
    });

    return { useCase, summaryModuleAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  it('fetches summary module list for the requested period', async () => {
    const { useCase, summaryModuleAdapter } = prepareSuiteCase();
    const modules = [mockSummaryModule({ moduleId: 1 })];
    summaryModuleAdapter.getAll.mockResolvedValue(modules);

    const response = await useCase.execute({
      period: SUMMARY_PERIOD_ENUM.WEEK,
    });

    expect(response.success).toBe(true);
    if (!response.success) {
      throw new Error('Expected success response');
    }

    expect(response.details).toEqual(modules);
    expect(summaryModuleAdapter.getAll).toHaveBeenCalledWith({
      period: SUMMARY_PERIOD_ENUM.WEEK,
    });
  });
});
