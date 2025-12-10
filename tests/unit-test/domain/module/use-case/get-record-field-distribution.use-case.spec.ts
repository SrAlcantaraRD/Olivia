import { describe, expect, it } from '@jest/globals';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IRecordPort } from '@/domain/module/port/record.port';
import { GetRecordFieldDistributionUseCase } from '@/domain/module/use-case/get-record-field-distribution.use-case';

describe('[UseCase] GetRecordFieldDistributionUseCase', () => {
  it('calls adapter.getFieldDistribution and returns values', async () => {
    const mockValues = [
      { value: 'value1', count: 3 },
      { value: 'value2', count: 1 },
    ];
    const mockAdapter: IRecordPort = {
      create: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      getCountsByModule: jest.fn(),
      getCountsByDay: jest.fn(),
      getFieldDistribution: jest.fn().mockResolvedValue(mockValues),
    } as unknown as IRecordPort;

    const useCase = new GetRecordFieldDistributionUseCase({
      loggerAdapter: { info: () => {} } as unknown as TLoggerPort,
      recordAdapter: mockAdapter,
    });

    const resp = await useCase.execute({ fieldID: 1 });
    expect(resp.success).toBe(true);
    if (resp.success) expect(resp.details.values).toEqual(mockValues);
    expect(mockAdapter.getFieldDistribution).toHaveBeenCalledWith({
      fieldID: 1,
    });
  });
});
