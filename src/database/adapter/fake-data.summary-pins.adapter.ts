import type { TSummaryPin } from '@/domain/summary/entity/summary-pin.entity';
import type { SUMMARY_PIN_TYPE_ENUM } from '@/domain/summary/enum/summary-pin-type.enum';
import type { ISummaryPinsPort } from '@/domain/summary/port/summary-pins.port';

const PINS_STORE: TSummaryPin[] = [];

export class FakeDataSummaryPinsAdapter implements ISummaryPinsPort {
  public async list(): Promise<TSummaryPin[]> {
    return [...PINS_STORE].sort((a, b) => a.order - b.order);
  }

  public async add(pin: TSummaryPin): Promise<void> {
    const exists = PINS_STORE.find(
      (item) => item.type === pin.type && item.targetId === pin.targetId
    );

    if (!exists) {
      PINS_STORE.push(pin);
    }
  }

  public async remove(params: {
    type: SUMMARY_PIN_TYPE_ENUM;
    targetId: string;
  }): Promise<void> {
    const index = PINS_STORE.findIndex(
      (item) => item.type === params.type && item.targetId === params.targetId
    );

    if (index >= 0) {
      PINS_STORE.splice(index, 1);
    }
  }

  public async replaceAll(pins: TSummaryPin[]): Promise<void> {
    PINS_STORE.length = 0;
    PINS_STORE.push(...pins);
  }
}
