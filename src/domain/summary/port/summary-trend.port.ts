import type { TSummaryDetail } from '@/domain/summary/entity/summary-detail.entity';
import type { TSummaryTrend } from '@/domain/summary/entity/summary-trend.entity';
import type { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';

export interface ISummaryTrendPort {
  getList(): Promise<TSummaryTrend[]>;
  getDetails(params: {
    trendID: string;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryDetail>;
}
