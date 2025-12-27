import type { TSummaryPin } from '@/domain/summary/entity/summary-pin.entity';
import type { SUMMARY_PIN_TYPE_ENUM } from '@/domain/summary/enum/summary-pin-type.enum';

export interface ISummaryPinsPort {
  // TODO: Integrate summary-pins port adding real functionality
  list(): Promise<TSummaryPin[]>;
  add(pin: TSummaryPin): Promise<void>;
  remove(params: {
    type: SUMMARY_PIN_TYPE_ENUM;
    targetId: string;
  }): Promise<void>;
  replaceAll(pins: TSummaryPin[]): Promise<void>;
}
