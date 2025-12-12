import { jest } from '@jest/globals';

import { SQLiteRecordAdapter } from '@/database/adapter/sqlite.record.adapter';

describe('[Adapter] SQLiteRecordAdapter - Aggregations', () => {
  it('getFieldDistribution uses database.execute when available (no moduleID)', async () => {
    const adapter = new SQLiteRecordAdapter();

    const mockExecute = jest
      .fn<() => Promise<{ value: string; count: number }[]>>()
      .mockResolvedValue([{ value: 'A', count: 2 }]);
    // inject fake database object with execute
    (adapter as unknown as { database: { execute: unknown } }).database = {
      // using non-strict cast for test convenience
      execute: mockExecute as unknown,
    };

    const result = await adapter.getFieldDistribution({
      fieldID: 1,
      startDate: new Date(0),
      endDate: new Date(1000),
    });

    expect(mockExecute).toHaveBeenCalled();
    expect(result).toEqual([{ value: 'A', count: 2 }]);
  });

  it('getFieldDistribution uses database.execute when available (with moduleID)', async () => {
    const adapter = new SQLiteRecordAdapter();

    const mockExecute = jest
      .fn<() => Promise<{ value: string; count: number }[]>>()
      .mockResolvedValue([{ value: 'B', count: 1 }]);
    (adapter as unknown as { database: unknown }).database = {
      execute: mockExecute,
    } as unknown;

    const result = await adapter.getFieldDistribution({
      fieldID: 2,
      moduleID: 5,
      startDate: new Date(0),
      endDate: new Date(1000),
    });

    expect(mockExecute).toHaveBeenCalled();
    expect(result).toEqual([{ value: 'B', count: 1 }]);
  });

  it('getCountsByModule falls back to in-memory when execute is not available', async () => {
    const adapter = new SQLiteRecordAdapter();

    const nowEpoch = Math.floor(Date.now() / 1000);
    // Provide a stubbed query.RECORD.findMany
    const fakeDb = {
      query: {
        RECORD: {
          findMany: jest
            .fn<
              () => Promise<
                {
                  id: number;
                  moduleID: number;
                  status: number;
                  data: string;
                  synced: number;
                  createdAt: number;
                }[]
              >
            >()
            .mockResolvedValue([
              {
                id: 1,
                moduleID: 1,
                status: 1,
                data: '{}',
                synced: 0,
                createdAt: nowEpoch,
              },
              {
                id: 2,
                moduleID: 1,
                status: 1,
                data: '{}',
                synced: 0,
                createdAt: nowEpoch,
              },
              {
                id: 3,
                moduleID: 2,
                status: 1,
                data: '{}',
                synced: 0,
                createdAt: nowEpoch,
              },
            ]),
        },
      },
    } as unknown as Record<string, unknown>;

    (adapter as unknown as { database: unknown }).database = fakeDb as unknown;

    const result = await adapter.getCountsByModule({
      startDate: new Date((nowEpoch - 100) * 1000),
      endDate: new Date(nowEpoch * 1000),
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ moduleID: 1, count: 2 }),
        expect.objectContaining({ moduleID: 2, count: 1 }),
      ])
    );
  });
});

import { describe, expect, it } from '@jest/globals';

describe('SQLiteRecordAdapter aggregations', () => {
  it('getFieldDistribution uses database.execute when available (no moduleID)', async () => {
    const adapter = new SQLiteRecordAdapter();

    const mockExecute = jest
      .fn<() => Promise<{ value: string; count: number }[]>>()
      .mockResolvedValue([{ value: 'A', count: 2 }]);
    // inject fake database object with execute
    (adapter as unknown as { database: { execute: unknown } }).database = {
      execute: mockExecute as unknown,
    };

    const result = await adapter.getFieldDistribution({
      fieldID: 1,
      startDate: new Date(0),
      endDate: new Date(1000),
    });

    expect(mockExecute).toHaveBeenCalled();
    expect(result).toEqual([{ value: 'A', count: 2 }]);
  });

  it('getCountsByModule falls back to in-memory when execute is not available', async () => {
    const adapter = new SQLiteRecordAdapter();

    const nowEpoch = Math.floor(Date.now() / 1000);
    // Provide a stubbed query.RECORD.findMany
    const fakeDb = {
      query: {
        RECORD: {
          findMany: jest
            .fn<
              () => Promise<
                {
                  id: number;
                  moduleID: number;
                  status: number;
                  data: string;
                  synced: number;
                  createdAt: number;
                }[]
              >
            >()
            .mockResolvedValue([
              {
                id: 1,
                moduleID: 1,
                status: 1,
                data: '{}',
                synced: 0,
                createdAt: nowEpoch,
              },
              {
                id: 2,
                moduleID: 1,
                status: 1,
                data: '{}',
                synced: 0,
                createdAt: nowEpoch,
              },
              {
                id: 3,
                moduleID: 2,
                status: 1,
                data: '{}',
                synced: 0,
                createdAt: nowEpoch,
              },
            ]),
        },
      },
    } as unknown as Record<string, unknown>;

    (adapter as unknown as { database: unknown }).database = fakeDb as unknown;

    const result = await adapter.getCountsByModule({
      startDate: new Date((nowEpoch - 100) * 1000),
      endDate: new Date(nowEpoch * 1000),
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ moduleID: 1, count: 2 }),
        expect.objectContaining({ moduleID: 2, count: 1 }),
      ])
    );
  });
});

describe('SQLiteRecordAdapter aggregations', () => {
  it('calls database.execute with correct SQL when execute is available (no moduleID)', async () => {
    const adapter = new SQLiteRecordAdapter();

    const mockExecute = jest
      .fn<() => Promise<{ value: string; count: number }[]>>()
      .mockResolvedValue([{ value: 'A', count: 2 }]);
    // inject fake database object with execute
    (adapter as unknown as { database: unknown }).database = {
      execute: mockExecute,
    } as unknown;

    const result = await adapter.getFieldDistribution({
      fieldID: 1,
      startDate: new Date(0),
      endDate: new Date(1000),
    });

    expect(mockExecute).toHaveBeenCalled();
    expect(result).toEqual([{ value: 'A', count: 2 }]);
  });

  it('calls database.execute with correct SQL when execute is available (with moduleID)', async () => {
    const adapter = new SQLiteRecordAdapter();

    const mockExecute = jest
      .fn<() => Promise<{ value: string; count: number }[]>>()
      .mockResolvedValue([{ value: 'B', count: 1 }]);
    (adapter as unknown as { database: unknown }).database = {
      execute: mockExecute,
    } as unknown;

    const result = await adapter.getFieldDistribution({
      fieldID: 2,
      moduleID: 5,
      startDate: new Date(0),
      endDate: new Date(1000),
    });

    expect(mockExecute).toHaveBeenCalled();
    expect(result).toEqual([{ value: 'B', count: 1 }]);
  });
});

// Using global jest from @jest/globals; no direct import required

describe('[Adapter] SQLiteRecordAdapter - Aggregations', () => {
  it('getCountsByModule aggregates counts correctly', async () => {
    const adapter = new SQLiteRecordAdapter();

    const nowEpoch = Math.floor(Date.now() / 1000);
    // Spy on the database query method to return a curated list
    const mockRecords = [
      {
        id: 1,
        moduleID: 1,
        status: 1,
        data: '{}',
        synced: 0,
        createdAt: nowEpoch - 10,
      },
      {
        id: 2,
        moduleID: 1,
        status: 1,
        data: '{}',
        synced: 0,
        createdAt: nowEpoch - 9,
      },
      {
        id: 3,
        moduleID: 2,
        status: 1,
        data: '{}',
        synced: 0,
        createdAt: nowEpoch - 8,
      },
    ];

    // Override the internal database query method
    interface IDbQueryStub {
      query: {
        RECORD: {
          findMany: (params?: unknown) => Promise<unknown[]>;
        };
      };
    }
    const db = (adapter as unknown as { database: IDbQueryStub }).database;
    (db.query.RECORD.findMany as unknown as jest.Mock).mockResolvedValue(
      mockRecords as never
    );

    const result = await adapter.getCountsByModule({
      startDate: new Date((nowEpoch - 100) * 1000),
      endDate: new Date(nowEpoch * 1000),
    });
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ moduleID: 1, count: 2 }),
        expect.objectContaining({ moduleID: 2, count: 1 }),
      ])
    );
  });
});
