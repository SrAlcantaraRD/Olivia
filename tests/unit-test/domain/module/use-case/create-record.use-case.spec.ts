import { describe, expect, it } from '@jest/globals';

import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type {
  TRecord,
  TRecordCreate,
} from '@/domain/module/entity/record.entity';
import { CreateRecordUseCase } from '@/domain/module/use-case/create-record.use-case';
import { mockLoggerPort } from '@/tests/mocks/core.port.mock';
import {
  mockRecordCreate,
  mockRecordEntity,
} from '@/tests/mocks/module-field.entity.mock';
import {
  mockRecordFieldPort,
  mockRecordPort,
} from '@/tests/mocks/module-field.port.mock';

describe('[UseCase] - CreateRecord', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const recordAdapter = mockRecordPort();
    const recordFieldAdapter = mockRecordFieldPort();

    const unit = new CreateRecordUseCase({
      loggerAdapter,
      recordAdapter,
      recordFieldAdapter,
    });

    return { unit, loggerAdapter, recordAdapter, recordFieldAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('creates record successfully when adapters succeed', async () => {
      const { recordAdapter, recordFieldAdapter, unit } = prepareSuiteCase();

      const mockRecord: TRecord = mockRecordEntity({
        status: STATUS_ENUM.ACTIVE,
      });

      const payload: TRecordCreate = mockRecordCreate({
        moduleID: 1,
        data: mockRecord.data,
        synchronized: false,
      });

      recordAdapter.create.mockResolvedValue(mockRecord);
      recordFieldAdapter.batchCreate.mockResolvedValue([]);

      // Act
      const resp = await unit.execute(payload);

      // Assert
      expect(resp.success).toBe(true);

      if (!resp.success) {
        throw new Error('Expected success response');
      }
      expect(resp.details).toEqual(mockRecord);
      expect(recordAdapter.create).toHaveBeenCalledWith(payload);
    });
  });
});
