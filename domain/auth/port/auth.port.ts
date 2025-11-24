import type { TAuthEntity } from '@/domain/auth';

export interface IAuthPort {
  findByEmail(email: string): Promise<TAuthEntity | null>;
}
