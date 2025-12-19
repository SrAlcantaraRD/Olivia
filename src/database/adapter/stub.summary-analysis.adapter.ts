import type { ISummaryAnalysisPort } from '@/domain/summary/port/summary-analysis.port';

export class StubSummaryAnalysisAdapter implements ISummaryAnalysisPort {
  public async generateAnalysis(input: unknown): Promise<string> {
    // Placeholder implementation
    return 'This is a placeholder analysis. AI integration pending.';
  }
}
