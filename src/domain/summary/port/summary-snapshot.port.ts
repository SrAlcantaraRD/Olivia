import type { TSummarySnapshot } from '@/domain/summary/entity/summary-snapshot.entity';

export interface ISummarySnapshotPort {
  // TODO: Integrate getSnapshot to avoid recompute summary
  getSnapshot(): Promise<TSummarySnapshot | null>;
  setSnapshot(snapshot: TSummarySnapshot): Promise<void>;
}
