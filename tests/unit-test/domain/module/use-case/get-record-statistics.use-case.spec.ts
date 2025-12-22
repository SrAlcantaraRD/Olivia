import { describe, expect, it } from '@jest/globals';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IRecordPort } from '@/domain/module/port/record.port';
import { GetRecordStatisticsUseCase } from '@/domain/module/use-case/get-record-statistics.use-case';

describe('[UseCase] GetRecordStatisticsUseCase', () => {
  it('calls adapter.getCountsByModule and returns data', async () => {
    const mockCounts = [
      { moduleID: 1, count: 3 },
      { moduleID: 2, count: 2 },
    ];
    const mockAdapter: IRecordPort = {
      create: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      getCountsByModule: jest.fn().mockResolvedValue(mockCounts),
      getCountsByDay: jest.fn(),
      getFieldDistribution: jest.fn(),
    } as unknown as IRecordPort;

    const useCase = new GetRecordStatisticsUseCase({
      loggerAdapter: { info: () => {} } as unknown as TLoggerPort,
      recordAdapter: mockAdapter,
    });

    const resp = await useCase.execute({
      startDate: new Date(0),
      endDate: new Date(Math.floor(Date.now() / 1000) * 1000),
    });
    expect(resp.success).toBe(true);
    if (resp.success) {
      expect(resp.details.countsByModule).toEqual(mockCounts);
    }
    expect(mockAdapter.getCountsByModule).toHaveBeenCalled();
  });
});
