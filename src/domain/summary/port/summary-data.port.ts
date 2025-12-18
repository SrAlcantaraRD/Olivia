import type { TID } from '@/domain/core/schemas/id.schema';
import type { TSummaryDetail } from '@/domain/summary/entity/summary-detail.entity';
import type { TSummaryHighlight } from '@/domain/summary/entity/summary-highlight.entity';
import type { TSummaryModule } from '@/domain/summary/entity/summary-module.entity';
import type { TSummaryTrend } from '@/domain/summary/entity/summary-trend.entity';
import type { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';

export interface ISummaryDataPort {
  getModuleSummaries(moduleIds: TID[]): Promise<TSummaryModule[]>;
  getSummaryTrends(): Promise<TSummaryTrend[]>;
  getSummaryHighlights(): Promise<TSummaryHighlight[]>;
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
