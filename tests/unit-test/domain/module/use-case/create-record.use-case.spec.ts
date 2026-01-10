import { describe, expect, it } from '@jest/globals';

import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type {
  TRecord,
  TRecordCreate,
} from '@/domain/module/entity/record.entity';
import { CreateRecordUseCase } from '@/domain/module/use-case/create-record.use-case';
import {
  mockCachePort,
  mockLoggerPort,
  mockRecordCreate,
  mockRecordEntity,
  mockRecordFieldPort,
  mockRecordPort,
} from '@/tests/mocks';

describe('[UseCase] - CreateRecord', () => {
  const prepareSuiteCase = () => {
    const loggerAdapter = mockLoggerPort();
    const recordAdapter = mockRecordPort();
    const recordFieldAdapter = mockRecordFieldPort();
    const cacheAdapter = mockCachePort();

    const unit = new CreateRecordUseCase({
      loggerAdapter,
      recordAdapter,
      recordFieldAdapter,
      cacheAdapter,
    });

    return {
      unit,
      loggerAdapter,
      recordAdapter,
      recordFieldAdapter,
      cacheAdapter,
    };
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Happy Path', () => {
    it('creates record successfully when adapters succeed', async () => {
      const { recordAdapter, recordFieldAdapter, cacheAdapter, unit } =
        prepareSuiteCase();

      const mockRecord: TRecord = mockRecordEntity({
        status: STATUS_ENUM.ACTIVE,
      });

      const payload: TRecordCreate = mockRecordCreate({
        moduleID: 1,
        data: mockRecord.data,
        synchronized: false,
      });

      const cachedCarerID = 10;
      cacheAdapter.get.mockResolvedValue(cachedCarerID);
      recordAdapter.upsert.mockResolvedValue(mockRecord);
      recordFieldAdapter.batchUpsert.mockResolvedValue([]);

      // Act
      const resp = await unit.execute(payload);

      // Assert
      expect(resp.success).toBe(true);

      if (!resp.success) {
        throw new Error('Expected success response');
      }
      expect(resp.details).toEqual(mockRecord);
      expect(recordAdapter.upsert).toHaveBeenCalledWith({
        ...payload,
        carerID: cachedCarerID,
      });
    });

    it('fails when carer is missing from cache', async () => {
      const { unit, cacheAdapter } = prepareSuiteCase();
      cacheAdapter.get.mockResolvedValue(null);

      const response = await unit.execute(
        mockRecordCreate({
          moduleID: 1,
          synchronized: false,
          data: '{"field1":"value1"}',
          recordFieldList: [],
        })
      );

      expect(response.success).toBe(false);
      expect(response.message).toBe(
        'use-case.create-record.carer-not-found-in-cache'
      );
    });
  });
});
