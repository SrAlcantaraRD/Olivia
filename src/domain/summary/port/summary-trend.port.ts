import type { TSummaryTrend } from '@/domain/summary/entity/summary-trend.entity';

export interface ISummaryTrendPort {
  listSummaryTrends(): Promise<TSummaryTrend[]>;
}
