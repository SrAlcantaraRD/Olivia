import { createMMKV } from 'react-native-mmkv';

import type { ICachePort } from '@/domain/core/port/cache.port';

export class MMKVCacheAdapter implements ICachePort {
  private storage = createMMKV({
    id: 'storage-id',
    encryptionKey: 'encryption-key',
  });

  async set<T>(key: string, value: T): Promise<void> {
    const payload = JSON.stringify(value);

    this.storage.set(key, payload);
  }

  async get<T>(key: string): Promise<T | null> {
    const item = this.storage.getString(key);

    return item ? (JSON.parse(item) as T) : null;
  }

  async delete(key: string): Promise<void> {
    this.storage.remove(key);
  }

  async clearAll(): Promise<void> {
    this.storage.clearAll();
  }
}
