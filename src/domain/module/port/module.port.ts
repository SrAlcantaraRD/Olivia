import type { TID } from '@/domain/core';

export interface IModulePort {
  batchActivate(idList: TID[]): Promise<void>;
}
