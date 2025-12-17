import { describe, expect, it } from '@jest/globals';

import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type {
  TRecord,
  TRecordCreate,
} from '@/domain/module/entity/record.entity';
import { CreateRecordUseCase } from '@/domain/module/use-case/create-record.use-case';
import { mockLoggerPort } from '../../core/mocks/mock.port';
import { mockRecordCreate, mockRecordEntity } from '../mocks/mock.entities';
import { mockRecordFieldPort, mockRecordPort } from '../mocks/mock.port';

describe('[UseCase] CreateRecordUseCase', () => {
  const prepareSuiteCase = () => {
    // Arrange
    const loggerAdapter = mockLoggerPort();
    const recordAdapter = mockRecordPort();
    const recordFieldAdapter = mockRecordFieldPort();

    const useCase = new CreateRecordUseCase({
      loggerAdapter,
      recordAdapter,
      recordFieldAdapter,
    });

    return { useCase, loggerAdapter, recordAdapter, recordFieldAdapter };
  };

  beforeEach(() => jest.clearAllMocks());

  it('calls adapter.create and returns success', async () => {
    const { recordAdapter, recordFieldAdapter, useCase } = prepareSuiteCase();

    const mockRecord: TRecord = mockRecordEntity({
      status: STATUS_ENUM.ACTIVE,
    });

    const payload: TRecordCreate = mockRecordCreate({
      moduleID: 1,
      data: mockRecord.data,
      synced: false,
    });

    recordAdapter.create.mockResolvedValue(mockRecord);
    recordFieldAdapter.batchCreate.mockResolvedValue([]);

    const resp = await useCase.execute(payload);
    expect(resp.success).toBe(true);
    if (resp.success) {
      expect(resp.details).toEqual(mockRecord);
    }
    expect(recordAdapter.create).toHaveBeenCalledWith(payload);
  });
});
