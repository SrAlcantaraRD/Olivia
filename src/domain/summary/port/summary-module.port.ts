import type { TID } from '@/domain/core/schemas/id.schema';
import type { TSummaryModule } from '@/domain/summary/entity/summary-module.entity';

export interface ISummaryModulePort {
  getModuleSummaries(moduleIds: TID[]): Promise<TSummaryModule[]>;
}
