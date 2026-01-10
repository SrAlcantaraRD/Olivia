/// <reference types="jest" />

import { describe, expect, it } from '@jest/globals';

import {
  SQLiteRecordAdapter,
  type TRecordAdapterEntity,
} from '@/database/adapter/sqlite.record.adapter';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';

const buildEntity = (
  overrides: Partial<TRecordAdapterEntity> = {}
): TRecordAdapterEntity => {
  const base: TRecordAdapterEntity = {
    id: 1,
    status: STATUS_ENUM.ACTIVE,
    createdAt: new Date('2025-12-18T00:00:00.000Z'), // seconds
    moduleID: 10,
    carerID: 20,
    data: '{"field1":"value1"}',
    synced: 0,
  };

  return { ...base, ...overrides };
};

describe('[Adapter] - SQLiteRecordAdapter.toDomainEntity', () => {
  it('maps scalar fields and converts status + synced', () => {
    // Arrange
    const entity = buildEntity({
      id: 99,
      status: STATUS_ENUM.INACTIVE,
      synced: 1,
    });

    // Act
    const result = SQLiteRecordAdapter.toDomainEntity(entity);

    // Assert
    expect(result.id).toBe(99);
    expect(result.status).toBe(STATUS_ENUM.INACTIVE);
    expect(result.moduleID).toBe(10);
    expect(result.carerID).toBe(20);
    expect(result.synchronized).toBe(true);
  });

  it('converts createdAt from unix seconds to Date', () => {
    // Arrange
    const seconds = 1_700_000_000;
    const entity = buildEntity({ createdAt: new Date(seconds * 1000) });

    // Act
    const result = SQLiteRecordAdapter.toDomainEntity(entity);

    // Assert
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.createdAt.getTime()).toBe(seconds * 1000);
  });

  it('converts createdAt from unix milliseconds to Date', () => {
    // Arrange
    const ms = 1_700_000_000_000;
    const entity = buildEntity({ createdAt: new Date(ms) });

    // Act
    const result = SQLiteRecordAdapter.toDomainEntity(entity);

    // Assert
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.createdAt.getTime()).toBe(ms);
  });

  it('keeps createdAt as Date when already a Date', () => {
    // Arrange
    const date = new Date('2025-12-18T00:00:00.000Z');
    const entity = buildEntity({ createdAt: date });

    // Act
    const result = SQLiteRecordAdapter.toDomainEntity(entity);

    // Assert
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.createdAt.getTime()).toBe(date.getTime());
  });

  it('throws when status is not a valid STATUS_ENUM', () => {
    // Arrange
    const entity = buildEntity({ status: 999 });

    // Act + Assert
    expect(() => SQLiteRecordAdapter.toDomainEntity(entity)).toThrow();
  });
});
