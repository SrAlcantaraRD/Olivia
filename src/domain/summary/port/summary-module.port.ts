import type { TID } from '@/domain/core/schemas/id.schema';
import type { TSummaryModule } from '@/domain/summary/entity/summary-module.entity';
import type { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';

export interface ISummaryModulePort {
  getAll(params: { period: SUMMARY_PERIOD_ENUM }): Promise<TSummaryModule[]>;

  getInList(params: {
    idList: TID[];
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryModule[]>;

  getDetails(params: {
    id: TID;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryModule>;
}
