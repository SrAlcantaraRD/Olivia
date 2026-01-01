import type { TID } from '@/domain/core/schemas/id.schema';
import type { TSummaryModuleField } from '@/domain/summary/entity/summary-field.entity';
import type { SUMMARY_PERIOD_ENUM } from '@/domain/summary/enum/summary-period.enum';

export interface ISummaryModuleFieldPort {
  getByModuleID(params: {
    moduleID: TID;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryModuleField[]>;

  getDetails(params: {
    id: TID;
    period: SUMMARY_PERIOD_ENUM;
  }): Promise<TSummaryModuleField>;
}
