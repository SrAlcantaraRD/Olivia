import {
  buildAdapterClient,
  type TAppDatabase,
} from '@/database/config/database.config';
import type { TSummaryTrend } from '@/domain/summary/entity/summary-trend.entity';
import type { ISummaryTrendPort } from '@/domain/summary/port/summary-trend.port';

export class SQLiteSummaryTrendAdapter implements ISummaryTrendPort {
  private readonly database: TAppDatabase;

  constructor(database?: TAppDatabase) {
    this.database = database ?? buildAdapterClient('SummaryTrend');
  }

  public async listSummaryTrends(): Promise<TSummaryTrend[]> {
    // Placeholder: return predefined trends
    // In real implementation, this could be from a trends table or config
    return [
      {
        id: 'trend1',
        titleKey: 'summary.trend.increasing.title',
        descriptionKey: 'summary.trend.increasing.description',
        moduleId: 1, // Example
      },
      {
        id: 'trend2',
        titleKey: 'summary.trend.decreasing.title',
        descriptionKey: 'summary.trend.decreasing.description',
        fieldId: 1, // Example
      },
    ];
  }
}
