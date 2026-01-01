/// <reference types="jest" />

import type { ISummaryDetailPort } from '@/domain/summary/port/summary-detail.port';
import type { ISummaryHighlightPort } from '@/domain/summary/port/summary-highlight.port';
import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';
import type { ISummaryPinsPort } from '@/domain/summary/port/summary-pins.port';
import type { ISummarySnapshotPort } from '@/domain/summary/port/summary-snapshot.port';
import type { ISummaryTrendPort } from '@/domain/summary/port/summary-trend.port';

export function mockSummaryDetailPort(
  overrides?: Partial<Record<keyof ISummaryDetailPort, jest.Mock>>
): jest.Mocked<ISummaryDetailPort> {
  return {
    getSummaryDetailByModule: jest.fn(),
    getSummaryDetailByField: jest.fn(),
    getSummaryDetailByTrend: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<ISummaryDetailPort>;
}

export function mockSummaryHighlightPort(
  overrides?: Partial<Record<keyof ISummaryHighlightPort, jest.Mock>>
): jest.Mocked<ISummaryHighlightPort> {
  return {
    listSummaryHighlights: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<ISummaryHighlightPort>;
}

export function mockSummaryModulePort(
  overrides?: Partial<Record<keyof ISummaryModulePort, jest.Mock>>
): jest.Mocked<ISummaryModulePort> {
  return {
    getModuleSummaries: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<ISummaryModulePort>;
}

export function mockSummaryPinsPort(
  overrides?: Partial<Record<keyof ISummaryPinsPort, jest.Mock>>
): jest.Mocked<ISummaryPinsPort> {
  return {
    list: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    replaceAll: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<ISummaryPinsPort>;
}

export function mockSummaryTrendPort(
  overrides?: Partial<Record<keyof ISummaryTrendPort, jest.Mock>>
): jest.Mocked<ISummaryTrendPort> {
  return {
    listSummaryTrends: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<ISummaryTrendPort>;
}

export function mockSummarySnapshotPort(
  overrides?: Partial<Record<keyof ISummarySnapshotPort, jest.Mock>>
): jest.Mocked<ISummarySnapshotPort> {
  return {
    getSnapshot: jest.fn(),
    setSnapshot: jest.fn(),
    ...overrides,
  } satisfies jest.Mocked<ISummarySnapshotPort>;
}
