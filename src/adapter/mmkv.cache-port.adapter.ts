import { MMKV } from 'react-native-mmkv';

import type { ICachePort } from '@/domain/core/port/cache.port';

const storage = new MMKV({ id: 'app_cache' });

export class MMKVCacheAdapter implements ICachePort {
  async set<T>(key: string, value: T): Promise<void> {
    const payload = JSON.stringify(value);

    storage.set(key, payload);
  }

  async get<T>(key: string): Promise<T | null> {
    const item = storage.getString(key);

    return item ? (JSON.parse(item) as T) : null;
  }

  async delete(key: string): Promise<void> {
    storage.delete(key);
  }
}
