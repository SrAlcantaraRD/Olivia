import { describe, expect, it } from '@jest/globals';

import { GetRecordStatisticsUseCase } from '@/domain/module/use-case/get-record-statistics.use-case';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockRecordPort } from '@/tests/mocks/module-field.port.mock';

describe('[UseCase] - GetRecordStatistics', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const recordAdapter = mockRecordPort();
    const unit = new GetRecordStatisticsUseCase({
      loggerAdapter,
      recordAdapter,
    });
    return { unit, loggerAdapter, recordAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('returns record statistics successfully when adapter succeeds', async () => {
      const { recordAdapter, unit } = prepareSuiteCase();
      const mockCounts = [
        { moduleID: 1, count: 3 },
        { moduleID: 2, count: 2 },
      ];
      recordAdapter.getCountsByModule.mockResolvedValue(mockCounts);

      // Act
      const resp = await unit.execute({
        startDate: new Date(0),
        endDate: new Date(Math.floor(Date.now() / 1000) * 1000),
      });

      // Assert
      expect(resp.success).toBe(true);

      if (!resp.success) {
        throw new Error('Expected success response');
      }
      expect(resp.details.countsByModule).toEqual(mockCounts);
      expect(recordAdapter.getCountsByModule).toHaveBeenCalled();
    });
  });
});
