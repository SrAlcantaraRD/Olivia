import { CACHE_KEY_ENUM } from '@/domain/core/constant/cache-key.constants';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { TSummaryPin } from '@/domain/summary/entity/summary-pin.entity';
import type { SUMMARY_PIN_TYPE_ENUM } from '@/domain/summary/enum/summary-pin-type.enum';
import type { ISummaryPinsPort } from '@/domain/summary/port/summary-pins.port';

export class SecureStoreSummaryPinsAdapter implements ISummaryPinsPort {
  private readonly cache: ICachePort;
  private readonly cacheKey = CACHE_KEY_ENUM.SUMMARY_PINS;

  constructor(cache: ICachePort) {
    this.cache = cache;
  }

  public async list(): Promise<TSummaryPin[]> {
    const data = await this.cache.get(this.cacheKey);
    if (!data) return [];

    try {
      const pins: TSummaryPin[] = JSON.parse(data as string);
      // Sort by order
      return pins.sort((a, b) => a.order - b.order);
    } catch {
      return [];
    }
  }

  public async add(pin: TSummaryPin): Promise<void> {
    const pins = await this.list();
    pins.push(pin);
    await this.cache.set(this.cacheKey, JSON.stringify(pins));
  }

  public async remove(params: {
    type: SUMMARY_PIN_TYPE_ENUM;
    targetId: string;
  }): Promise<void> {
    const pins = await this.list();
    const filtered = pins.filter(
      (pin) => !(pin.type === params.type && pin.targetId === params.targetId)
    );
    await this.cache.set(this.cacheKey, JSON.stringify(filtered));
  }

  public async replaceAll(pins: TSummaryPin[]): Promise<void> {
    await this.cache.set(this.cacheKey, JSON.stringify(pins));
  }
}
