import * as SecureStore from 'expo-secure-store';

import { CACHE_KEY_ENUM, type ICachePort } from '@/domain/core/port/cache.port';

export class SecureStoreCacheAdapter implements ICachePort {
  public async set<T>(key: string, value: T): Promise<void> {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  }

  public async get<T>(key: string): Promise<T | null> {
    const value = await SecureStore.getItemAsync(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch (_e) {
      return null;
    }
  }

  public async delete(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }

  public async clearAll(): Promise<void> {
    const keys = Object.values(CACHE_KEY_ENUM);

    await Promise.all(
      keys.map(async (k) => {
        await this.delete(String(k));
      })
    );
  }
}
