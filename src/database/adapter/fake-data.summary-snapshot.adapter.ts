import type { TSummarySnapshot } from '@/domain/summary/entity/summary-snapshot.entity';
import type { ISummarySnapshotPort } from '@/domain/summary/port/summary-snapshot.port';

let SNAPSHOT_STORE: TSummarySnapshot | null = null;

export class FakeDataSummarySnapshotAdapter implements ISummarySnapshotPort {
  public async getSnapshot(): Promise<TSummarySnapshot | null> {
    return SNAPSHOT_STORE;
  }

  public async setSnapshot(snapshot: TSummarySnapshot): Promise<void> {
    SNAPSHOT_STORE = snapshot;
  }
}
