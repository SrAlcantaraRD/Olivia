import type { TID } from '@/domain/core/schemas/id.schema';
import type { TModuleField } from '@/domain/module/entity/module-field.entity';

export interface IModuleFieldPort {
  batchDesactivate(): Promise<void>;
  getAll(): Promise<TModuleField[]>;
  getAllByModuleId(moduleId: TID): Promise<TModuleField[]>;
  batchActivate(moduleFieldIdList: TID[]): Promise<void>;
}
