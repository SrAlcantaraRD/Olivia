import { CACHE_KEY_ENUM } from '@/domain/core/constant/cache-key.constants';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { TSummarySnapshot } from '@/domain/summary/entity/summary-snapshot.entity';
import type { ISummarySnapshotPort } from '@/domain/summary/port/summary-snapshot.port';

export class CachePortSummarySnapshotAdapter implements ISummarySnapshotPort {
  private readonly cache: ICachePort;
  private readonly cacheKey = CACHE_KEY_ENUM.SUMMARY_SNAPSHOT;

  constructor(cache: ICachePort) {
    this.cache = cache;
  }

  public async getSnapshot(): Promise<TSummarySnapshot | null> {
    const data = await this.cache.get(this.cacheKey);
    if (!data) return null;

    try {
      return JSON.parse(data as string);
    } catch {
      return null;
    }
  }

  public async setSnapshot(snapshot: TSummarySnapshot): Promise<void> {
    await this.cache.set(this.cacheKey, JSON.stringify(snapshot));
  }
}
