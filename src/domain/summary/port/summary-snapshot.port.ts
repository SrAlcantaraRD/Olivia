import type { TSummarySnapshot } from '@/domain/summary/entity/summary-snapshot.entity';

export interface ISummarySnapshotPort {
  getSnapshot(): Promise<TSummarySnapshot | null>;
  setSnapshot(snapshot: TSummarySnapshot): Promise<void>;
}
