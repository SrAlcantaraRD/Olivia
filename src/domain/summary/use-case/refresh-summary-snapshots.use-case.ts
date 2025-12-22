import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ISummaryHighlightPort } from '@/domain/summary/port/summary-highlight.port';
import type { ISummaryModulePort } from '@/domain/summary/port/summary-module.port';
import type { ISummarySnapshotPort } from '@/domain/summary/port/summary-snapshot.port';
import type { ISummaryTrendPort } from '@/domain/summary/port/summary-trend.port';
import type {
  TRequestRefreshSummarySnapshots,
  TResponseRefreshSummarySnapshots,
} from '@/domain/summary/use-case-schema/refresh-summary-snapshots.use-case-schema';

export class RefreshSummarySnapshotsUseCase extends BaseUseCase<
  TRequestRefreshSummarySnapshots,
  TResponseRefreshSummarySnapshots
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      summaryModuleAdapter: ISummaryModulePort;
      summaryTrendAdapter: ISummaryTrendPort;
      summaryHighlightAdapter: ISummaryHighlightPort;
      summarySnapshotAdapter: ISummarySnapshotPort;
    }
  ) {
    super('refresh-summary-snapshots', adapters.loggerAdapter);
  }

  public async execute(
    data: TRequestRefreshSummarySnapshots
  ): Promise<IBaseResponse<TResponseRefreshSummarySnapshots>> {
    const [modules, trends, highlights] = await Promise.all([
      this.adapters.summaryModuleAdapter.getModuleSummaries(data.moduleIds),
      this.adapters.summaryTrendAdapter.listSummaryTrends(),
      this.adapters.summaryHighlightAdapter.listSummaryHighlights(),
    ]);

    const snapshot: TResponseRefreshSummarySnapshots = {
      modules,
      trends,
      highlights,
      updatedAt: new Date().toISOString(),
    };

    await this.adapters.summarySnapshotAdapter.setSnapshot(snapshot);

    return {
      success: true,
      message: 'common.success',
      details: snapshot,
    };
  }
}
