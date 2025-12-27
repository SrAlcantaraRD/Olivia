import type { TID } from '@/domain/core/schemas/id.schema';
import type { TModuleField } from '@/domain/module/entity/module-field.entity';

export interface IModuleFieldPort {
  batchDeactivate(): Promise<void>;
  getAllByModuleId(moduleId: TID): Promise<TModuleField[]>;
  batchActivate(moduleFieldIdList: TID[]): Promise<void>;
}
