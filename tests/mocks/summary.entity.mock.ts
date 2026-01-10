/// <reference types="jest" />

import { MODULE_FIELD_TYPE_ENUM } from '@/domain/module/enum/module-field-type.enum';
import { MODULE_KEY_ENUM } from '@/domain/module/enum/module-key.enum';
import type { TSummaryDetail } from '@/domain/summary/entity/summary-detail.entity';
import type { TSummaryModuleField } from '@/domain/summary/entity/summary-field.entity';
import type { TSummaryModule } from '@/domain/summary/entity/summary-module.entity';
import { SUMMARY_PERIOD_VALUES } from '@/domain/summary/entity/summary-period.entity';
import { BASE_SUMMARY_STATISTICS } from '@/domain/summary/entity/summary-statistics.entity';
import { SUMMARY_DETAIL_TYPE_ENUM } from '@/domain/summary/enum/summary-detail-type.enum';

const defaultSeriesPoint = { date: '2024-01-01T00:00:00Z', value: 1 };

export function mockSummaryDetail(
  overrides?: Partial<TSummaryDetail>
): TSummaryDetail {
  return {
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
    fieldSummaries: [
      {
        id: 1,
        code: 'field-1',
        type: MODULE_FIELD_TYPE_ENUM.TEXT,
        series: [1, 2, 3],
        average: 2,
        todayValue: 3,
      },
    ],
    ...overrides,
  } satisfies TSummaryDetail;
}

export function mockSummaryModule(
  overrides?: Partial<TSummaryModule>
): TSummaryModule {
  return {
    groupedData: SUMMARY_PERIOD_VALUES,
    metadata: {
      module: {
        id: 'test-module-id',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        code: MODULE_KEY_ENUM.CIC,
        description: 'Test module',
        isActive: true,
        name: 'Test Module',
      },
      moduleFieldList: [],
    },
    statistics: BASE_SUMMARY_STATISTICS,
    summaryModuleFieldList: [],
    ...overrides,
  } satisfies TSummaryModule;
}

export function mockSummaryModuleField(
  overrides?: Partial<TSummaryModuleField>
): TSummaryModuleField {
  return {
    id: 'field-1',
    code: 'field-code',
    type: MODULE_FIELD_TYPE_ENUM.TEXT,
    param: 'param-value',
    series: [defaultSeriesPoint],
    average: 1.5,
    todayValue: 2,
    ...overrides,
  } satisfies TSummaryModuleField;
}

// Legacy exports for backward compatibility
export const mockSummaryDetailLegacy = mockSummaryDetail;
export const mockSummaryModuleLegacy = mockSummaryModule;
