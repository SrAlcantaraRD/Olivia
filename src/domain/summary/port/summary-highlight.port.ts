import type { TSummaryHighlight } from '@/domain/summary/entity/summary-highlight.entity';

export interface ISummaryHighlightPort {
  listSummaryHighlights(): Promise<TSummaryHighlight[]>;
}
