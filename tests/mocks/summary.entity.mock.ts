/// <reference types="jest" />

import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';
import type { TSummaryDetail } from '@/domain/summary/entity/summary-detail.entity';
import type { TSummaryHighlight } from '@/domain/summary/entity/summary-highlight.entity';
import type { TSummaryModule } from '@/domain/summary/entity/summary-module.entity';
import type { TSummaryPin } from '@/domain/summary/entity/summary-pin.entity';
import type { TSummarySnapshot } from '@/domain/summary/entity/summary-snapshot.entity';
import type { TSummaryTrend } from '@/domain/summary/entity/summary-trend.entity';
import { SUMMARY_DETAIL_TYPE_ENUM } from '@/domain/summary/enum/summary-detail-type.enum';
import { SUMMARY_PIN_TYPE_ENUM } from '@/domain/summary/enum/summary-pin-type.enum';

const defaultSeriesPoint = { date: '2025-01-01T00:00:00Z', value: 1 };

export const mockSummaryDetail = (
  overrides: Partial<TSummaryDetail> = {}
): TSummaryDetail =>
  ({
    type: SUMMARY_DETAIL_TYPE_ENUM.MODULE,
    targetId: 'module-1',
    titleKey: 'summary.detail.title',
    descriptionKey: 'summary.detail.description',
    analysisText: 'analysis',
    series: [defaultSeriesPoint],
    average: 1,
    todayValue: 2,
    comparisonTextKey: 'summary.detail.comparison',
    projectionTextKey: 'summary.detail.projection',
    ...overrides,
  }) satisfies TSummaryDetail;

export const mockSummaryHighlight = (
  overrides: Partial<TSummaryHighlight> = {}
): TSummaryHighlight =>
  ({
    id: 'highlight-1',
    titleKey: 'summary.highlight.title',
    descriptionKey: 'summary.highlight.description',
    moduleId: overrides.moduleId ?? 'module-1',
    fieldId: overrides.fieldId,
    ...overrides,
  }) satisfies TSummaryHighlight;

export const mockSummaryModule = (
  overrides: Partial<TSummaryModule> = {}
): TSummaryModule =>
  ({
    moduleId: 'module-1',
    moduleKey: MODULE_KEY_ENUM.CIC,
    todayCount: 5,
    lastRecordedAt: '2025-12-01T00:00:00Z',
    last7Days: [defaultSeriesPoint],
    previousPeriodAverage: 3,
    ...overrides,
  }) satisfies TSummaryModule;

export const mockSummaryPin = (
  overrides: Partial<TSummaryPin> = {}
): TSummaryPin =>
  ({
    type: SUMMARY_PIN_TYPE_ENUM.MODULE,
    targetId: 'module-1',
    order: 0,
    pinnedAt: '2025-01-01T00:00:00Z',
    ...overrides,
  }) satisfies TSummaryPin;

export const mockSummaryTrend = (
  overrides: Partial<TSummaryTrend> = {}
): TSummaryTrend =>
  ({
    id: 'trend-1',
    titleKey: 'summary.trend.title',
    descriptionKey: 'summary.trend.description',
    moduleId: overrides.moduleId ?? 'module-1',
    fieldId: overrides.fieldId,
    ...overrides,
  }) satisfies TSummaryTrend;

export const mockSummarySnapshot = (
  overrides: Partial<TSummarySnapshot> = {}
): TSummarySnapshot =>
  ({
    modules: [mockSummaryModule()],
    trends: [mockSummaryTrend()],
    highlights: [mockSummaryHighlight()],
    updatedAt: '2025-12-31T00:00:00Z',
    ...overrides,
  }) satisfies TSummarySnapshot;
