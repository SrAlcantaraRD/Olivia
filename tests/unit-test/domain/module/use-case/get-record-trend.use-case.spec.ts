import { describe, expect, it } from '@jest/globals';

import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IRecordPort } from '@/domain/module/port/record.port';
import { GetRecordTrendUseCase } from '@/domain/module/use-case/get-record-trend.use-case';

describe('[UseCase] GetRecordTrendUseCase', () => {
  it('calls adapter.getCountsByDay and returns the series', async () => {
    const mockSeries = [
      { day: '2025-12-08', count: 2 },
      { day: '2025-12-09', count: 1 },
    ];
    const mockAdapter: IRecordPort = {
      create: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      getCountsByModule: jest.fn(),
      getCountsByDay: jest.fn().mockResolvedValue(mockSeries),
      getFieldDistribution: jest.fn(),
    } as unknown as IRecordPort;

    const useCase = new GetRecordTrendUseCase({
      loggerAdapter: { info: () => {} } as unknown as TLoggerPort,
      recordAdapter: mockAdapter,
    });
    const resp = await useCase.execute({
      startDate: new Date(0),
      endDate: new Date(Math.floor(Date.now() / 1000) * 1000),
    });
    expect(resp.success).toBe(true);
    if (resp.success) expect(resp.details.series).toEqual(mockSeries);
    expect(mockAdapter.getCountsByDay).toHaveBeenCalled();
  });
});
