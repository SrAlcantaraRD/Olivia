import type { TCacheKey } from '@/domain/core/constant/cache-key.constants';

export {
  CACHE_KEY_ENUM,
  type TCacheKey,
} from '@/domain/core/constant/cache-key.constants';

export interface ICachePort {
  delete(key: TCacheKey): Promise<void>;
  get<T>(key: TCacheKey): Promise<T | null>;
  set<T>(key: TCacheKey, value: T): Promise<void>;
  clearAll(): Promise<void>;
}
