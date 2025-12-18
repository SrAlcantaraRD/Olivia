import type { TSummaryHighlight } from '@/domain/summary/entity/summary-highlight.entity';
import type { ISummaryHighlightPort } from '@/domain/summary/port/summary-highlight.port';

const HIGHLIGHTS: TSummaryHighlight[] = [
  {
    id: 'highlight-cic-high',
    titleKey: 'summary.highlight.cic.high.title',
    descriptionKey: 'summary.highlight.cic.high.description',
    moduleId: 1,
  },
  {
    id: 'highlight-urine-up',
    titleKey: 'summary.highlight.urine.up.title',
    descriptionKey: 'summary.highlight.urine.up.description',
    moduleId: 2,
  },
];

export class FakeDataSummaryHighlightAdapter implements ISummaryHighlightPort {
  public async listSummaryHighlights(): Promise<TSummaryHighlight[]> {
    return HIGHLIGHTS;
  }
}
