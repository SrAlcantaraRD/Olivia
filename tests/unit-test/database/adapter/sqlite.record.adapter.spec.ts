import { describe, expect, it } from '@jest/globals';

// Using global jest from @jest/globals; no direct import required

import { SQLiteRecordAdapter } from '@/database/adapter/sqlite.record.adapter';

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
      mockRecords
    );

    const result = await adapter.getCountsByModule({
      start: nowEpoch - 100,
      end: nowEpoch,
    });
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ moduleID: 1, count: 2 }),
        expect.objectContaining({ moduleID: 2, count: 1 }),
      ])
    );
  });
});
