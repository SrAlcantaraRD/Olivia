import type { TSummaryTrend } from '@/domain/summary/entity/summary-trend.entity';
import type { ISummaryTrendPort } from '@/domain/summary/port/summary-trend.port';

const TRENDS: TSummaryTrend[] = [
  {
    id: 'trend-cic-up',
    titleKey: 'summary.trend.cic.up.title',
    descriptionKey: 'summary.trend.cic.up.description',
    moduleId: 1,
  },
  {
    id: 'trend-stool-stable',
    titleKey: 'summary.trend.stool.stable.title',
    descriptionKey: 'summary.trend.stool.stable.description',
    moduleId: 3,
  },
];

export class FakeDataSummaryTrendAdapter implements ISummaryTrendPort {
  public async listSummaryTrends(): Promise<TSummaryTrend[]> {
    return TRENDS;
  }
}
