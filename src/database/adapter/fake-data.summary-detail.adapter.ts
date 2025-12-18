import type { TID } from '@/domain/core/schemas/id.schema';
import type { TSummaryDetail } from '@/domain/summary/entity/summary-detail.entity';
import type { TSummarySeriesPoint } from '@/domain/summary/entity/summary-series-point.entity';
import { SUMMARY_DETAIL_TYPE_ENUM } from '@/domain/summary/enum/summary-detail-type.enum';
import type { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';
import type { ISummaryDetailPort } from '@/domain/summary/port/summary-detail.port';

function buildSeries(days: number, base: number): TSummarySeriesPoint[] {
  const now = new Date();

  return Array.from({ length: days }).map((_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (days - 1 - index));

    return {
      date: date.toISOString(),
      value: Math.max(0, base + ((index % 4) - 1)),
    };
  });
}

function buildDetail(params: {
  type: SUMMARY_DETAIL_TYPE_ENUM;
  targetId: string;
  period: SUMMARY_PERIOD_ENUM;
}): TSummaryDetail {
  const series = buildSeries(7, 3);
  const todayValue = series[series.length - 1]?.value ?? null;

  return {
    type: params.type,
    targetId: params.targetId,
    titleKey: `summary.detail.${params.type}.title.${params.targetId}`,
    descriptionKey: `summary.detail.${params.type}.description.${params.targetId}`,
    analysisText: null,
    series,
    average: 3,
    todayValue,
    comparisonTextKey: 'summary.detail.comparison.default',
    projectionTextKey: 'summary.detail.projection.default',
  } satisfies TSummaryDetail;
}

export class FakeDataSummaryDetailAdapter implements ISummaryDetailPort {
  public async getSummaryDetailByModule(params: {
    moduleId: TID;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryDetail> {
    return buildDetail({
      type: SUMMARY_DETAIL_TYPE_ENUM.MODULE,
      targetId: String(params.moduleId),
      period: params.period,
    });
  }

  public async getSummaryDetailByField(params: {
    moduleId: TID;
    fieldId: TID;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryDetail> {
    return buildDetail({
      type: SUMMARY_DETAIL_TYPE_ENUM.FIELD,
      targetId: `${params.moduleId}:${params.fieldId}`,
      period: params.period,
    });
  }

  public async getSummaryDetailByTrend(params: {
    trendId: string;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryDetail> {
    return buildDetail({
      type: SUMMARY_DETAIL_TYPE_ENUM.TREND,
      targetId: params.trendId,
      period: params.period,
    });
  }
}
