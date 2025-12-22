import type { TID } from '@/domain/core/schemas/id.schema';
import type { TSummaryDetail } from '@/domain/summary/entity/summary-detail.entity';
import type { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';

export interface ISummaryDetailPort {
  getSummaryDetailByModule(params: {
    moduleId: TID;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryDetail>;
  getSummaryDetailByField(params: {
    moduleId: TID;
    fieldId: TID;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryDetail>;
  getSummaryDetailByTrend(params: {
    trendId: string;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryDetail>;
}
