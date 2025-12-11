import { jest } from '@jest/globals';

// Mock expo-sqlite native bindings for Node test environment
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({})),
}));

import { SQLiteRecordAdapter } from '@/database/adapter/sqlite.record.adapter';

describe('[Adapter] SQLiteRecordAdapter - Aggregations (clean)', () => {
  it('getFieldDistribution uses database.execute when available (no moduleID)', async () => {
    const adapter = new SQLiteRecordAdapter();

    const mockExecute = jest.fn().mockResolvedValue([{ value: 'A', count: 2 }]);
    // inject fake database object with execute
    (adapter as unknown as { database: { execute: unknown } }).database = {
      // using non-strict cast for test convenience
      execute: mockExecute as unknown,
    } as unknown;

    const result = await adapter.getFieldDistribution({
      fieldID: 1,
      start: 0,
      end: 1000,
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
          findMany: jest.fn().mockResolvedValue([
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
      startDate: nowEpoch - 100,
      endDate: nowEpoch,
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ moduleID: 1, count: 2 }),
        expect.objectContaining({ moduleID: 2, count: 1 }),
      ])
    );
  });

  it('getCountsByDay uses database.execute when available', async () => {
    const adapter = new SQLiteRecordAdapter();
    const mockExecute = jest
      .fn()
      .mockResolvedValue([{ day: '2025-12-01', count: 3 }]);
    (adapter as unknown as { database: { execute: unknown } }).database = {
      execute: mockExecute as unknown,
    } as unknown;

    const res = await adapter.getCountsByDay({
      start: 0,
      end: Math.floor(Date.now() / 1000),
    });
    expect(mockExecute).toHaveBeenCalled();
    expect(res).toEqual([{ day: '2025-12-01', count: 3 }]);
  });
});
