import type {
  TModuleFieldCreateDTO,
  TModuleFieldEntity,
} from '@/domain/module/entity/module-field.entity';

export interface IModuleFieldPort {
  getById(id: number): Promise<TModuleFieldEntity | null>;
  getAll(): Promise<TModuleFieldEntity[]>;
  create(data: TModuleFieldCreateDTO): Promise<TModuleFieldEntity>;
}
