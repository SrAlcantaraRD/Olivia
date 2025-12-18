import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import { SUMMARY_DETAIL_TYPE_ENUM } from '@/domain/summary/enum/summary-detail-type.enum';
import type { ISummaryDataPort } from '@/domain/summary/port/summary-data.port';
import type {
  TRequestGetSummaryDetail,
  TResponseGetSummaryDetail,
} from '@/domain/summary/use-case-schema/get-summary-detail.use-case-schema';

export class GetSummaryDetailUseCase extends BaseUseCase<
  TRequestGetSummaryDetail,
  TResponseGetSummaryDetail
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      summaryDataAdapter: ISummaryDataPort;
    }
  ) {
    super('get-summary-detail', adapters.loggerAdapter);
  }

  public async execute(
    data: TRequestGetSummaryDetail
  ): Promise<IBaseResponse<TResponseGetSummaryDetail>> {
    if (data.type === SUMMARY_DETAIL_TYPE_ENUM.MODULE && data.moduleId) {
      const detail =
        await this.adapters.summaryDataAdapter.getSummaryDetailByModule({
          moduleId: data.moduleId,
          period: data.period,
        });

      return {
        success: true,
        message: 'common.success',
        details: detail,
      };
    }

    if (
      data.type === SUMMARY_DETAIL_TYPE_ENUM.FIELD &&
      data.moduleId &&
      data.fieldId
    ) {
      const detail =
        await this.adapters.summaryDataAdapter.getSummaryDetailByField({
          moduleId: data.moduleId,
          fieldId: data.fieldId,
          period: data.period,
        });

      return {
        success: true,
        message: 'common.success',
        details: detail,
      };
    }

    if (data.type === SUMMARY_DETAIL_TYPE_ENUM.TREND && data.trendId) {
      const detail =
        await this.adapters.summaryDataAdapter.getSummaryDetailByTrend({
          trendId: data.trendId,
          period: data.period,
        });

      return {
        success: true,
        message: 'common.success',
        details: detail,
      };
    }

    return {
      success: false,
      message: 'summary.detail.invalid-params',
    };
  }
}
