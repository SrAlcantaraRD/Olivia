import { describe, expect, it } from '@jest/globals';

import { GetRecordTrendUseCase } from '@/domain/module/use-case/get-record-trend.use-case';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockRecordPort } from '@/tests/mocks/module-field.port.mock';

describe('[UseCase] - GetRecordTrend', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const recordAdapter = mockRecordPort();
    const unit = new GetRecordTrendUseCase({
      loggerAdapter,
      recordAdapter,
    });
    return { unit, loggerAdapter, recordAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('returns record trend series successfully when adapter succeeds', async () => {
      const { recordAdapter, unit } = prepareSuiteCase();
      const mockSeries = [
        { day: '2025-12-08', count: 2 },
        { day: '2025-12-09', count: 1 },
      ];
      recordAdapter.getCountsByDay.mockResolvedValue(mockSeries);

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
      expect(resp.details.series).toEqual(mockSeries);
      expect(recordAdapter.getCountsByDay).toHaveBeenCalled();
    });
  });
});
