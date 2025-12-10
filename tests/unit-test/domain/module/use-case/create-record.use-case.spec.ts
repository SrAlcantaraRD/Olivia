import { describe, expect, it } from '@jest/globals';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type {
  TRecord,
  TRecordCreate,
} from '@/domain/module/entity/record.entity';
import type { IRecordPort } from '@/domain/module/port/record.port';
import { CreateRecordUseCase } from '@/domain/module/use-case/create-record.use-case';

describe('[UseCase] CreateRecordUseCase', () => {
  it('calls adapter.create and returns success', async () => {
    const mockRecord: TRecord = {
      id: 1,
      moduleID: 1,
      data: JSON.stringify({ values: { 1: 'a' } }),
      synced: false,
      status: STATUS_ENUM.ACTIVE,
    } as TRecord;

    const mockAdapter: IRecordPort = {
      create: jest.fn().mockResolvedValue(mockRecord),
    } as unknown as IRecordPort;

    const useCase = new CreateRecordUseCase({
      loggerAdapter: { info: () => {} } as unknown as TLoggerPort,
      recordAdapter: mockAdapter,
    });
    const payload: TRecordCreate = {
      moduleID: 1,
      data: mockRecord.data,
      synced: false,
    } as TRecordCreate;

    const resp = await useCase.execute(payload);
    expect(resp.success).toBe(true);
    if (resp.success) {
      expect(resp.details).toEqual(mockRecord);
    }
    expect(mockAdapter.create).toHaveBeenCalledWith(payload);
  });
});
