import {
  buildAdapterClient,
  type TAppDatabase,
} from '@/database/config/database.config';
import type { TSummaryHighlight } from '@/domain/summary/entity/summary-highlight.entity';
import type { ISummaryHighlightPort } from '@/domain/summary/port/summary-highlight.port';

export class SQLiteSummaryHighlightAdapter implements ISummaryHighlightPort {
  private readonly database: TAppDatabase;

  constructor(database?: TAppDatabase) {
    this.database = database ?? buildAdapterClient('SummaryHighlight');
  }

  public async listSummaryHighlights(): Promise<TSummaryHighlight[]> {
    // Placeholder: return predefined highlights
    return [
      {
        id: 'highlight1',
        titleKey: 'summary.highlight.record.title',
        descriptionKey: 'summary.highlight.record.description',
        moduleId: 1, // Example
      },
      {
        id: 'highlight2',
        titleKey: 'summary.highlight.streak.title',
        descriptionKey: 'summary.highlight.streak.description',
        fieldId: 1, // Example
      },
    ];
  }
}
