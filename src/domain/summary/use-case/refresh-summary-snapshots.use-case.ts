import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import {
  RequestRefreshSummarySnapshotsSchema,
  type TRequestRefreshSummarySnapshots,
  type TResponseRefreshSummarySnapshots,
} from '@/domain/summary/use-case-schema/refresh-summary-snapshots.use-case-schema';

export class RefreshSummarySnapshotsUseCase extends BaseUseCase<
  TRequestRefreshSummarySnapshots,
  TResponseRefreshSummarySnapshots
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
    }
  ) {
    super('refresh-summary-snapshots', adapters.loggerAdapter);
  }

  public async execute(
    request: TRequestRefreshSummarySnapshots
  ): Promise<IBaseResponse<TResponseRefreshSummarySnapshots>> {
    // const [modules, trends, highlights] = await Promise.all([
    //   this.adapters.summaryModuleAdapter.getModuleSummaries(data.moduleIds),
    //   this.adapters.summaryTrendAdapter.listSummaryTrends(),
    //   this.adapters.summaryHighlightAdapter.listSummaryHighlights(),
    // ]);

    const parse = this.parseRequest(
      RequestRefreshSummarySnapshotsSchema,
      request
    );

    const { moduleIds } = parse.data;

    this.adapters.loggerAdapter.info(
      `[RefreshSummarySnapshotsUseCase] Refreshing summary snapshots for modules: ${moduleIds.join(
        ', '
      )}`
    );

    // await 1s to simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const snapshot: TResponseRefreshSummarySnapshots = {
      modules: [],
      trends: [],
      highlights: [],
      updatedAt: new Date().toISOString(),
    };

    // await this.adapters.summarySnapshotAdapter.setSnapshot(snapshot);

    return {
      success: true,
      message: 'common.success',
      details: snapshot,
    };
  }
}
