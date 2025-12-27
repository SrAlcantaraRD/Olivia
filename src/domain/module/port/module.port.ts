import type { TID } from '@/domain/core/schemas/id.schema';
import type { TModule } from '@/domain/module/entity/module.entity';

export interface IModulePort {
  batchDeactivate(): Promise<void>;
  batchActivate(idList: TID[]): Promise<void>;
  getAll(): Promise<TModule[]>;
}
