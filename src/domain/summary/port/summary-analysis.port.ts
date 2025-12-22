export interface ISummaryAnalysisPort {
  generateAnalysis(input: unknown): Promise<string>;
}
