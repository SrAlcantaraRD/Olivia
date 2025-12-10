import type { TModuleField } from '@/domain/module/entity/module-field.entity';

export interface IModuleFieldPort {
  getAll(): Promise<TModuleField[]>;
  getAllByModuleId(moduleId: number): Promise<TModuleField[]>;
}
