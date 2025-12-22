import { describe, expect, it } from '@jest/globals';

import { GetRecordFieldDistributionUseCase } from '@/domain/module/use-case/get-record-field-distribution.use-case';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import { mockRecordPort } from '@/tests/mocks/module-field.port.mock';

describe('[UseCase] - GetRecordFieldDistribution', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const recordAdapter = mockRecordPort();
    const unit = new GetRecordFieldDistributionUseCase({
      loggerAdapter,
      recordAdapter,
    });
    return { unit, loggerAdapter, recordAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('returns field distribution successfully when adapter succeeds', async () => {
      const { recordAdapter, unit } = prepareSuiteCase();
      const mockValues = [
        { value: 'value1', count: 3 },
        { value: 'value2', count: 1 },
      ];
      recordAdapter.getFieldDistribution.mockResolvedValue(mockValues);

      // Act
      const resp = await unit.execute({ fieldID: 1 });

      // Assert
      expect(resp.success).toBe(true);

      if (!resp.success) {
        throw new Error('Expected success response');
      }
      expect(resp.details.values).toEqual(mockValues);
      expect(recordAdapter.getFieldDistribution).toHaveBeenCalledWith({
        fieldID: 1,
      });
    });
  });
});
