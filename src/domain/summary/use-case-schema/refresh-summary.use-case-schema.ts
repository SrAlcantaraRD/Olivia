import z from 'zod';

export const RequestRefreshSummarySchema = z.object({
  moduleIds: z.array(z.number().int()),
});

export const ResponseRefreshSummarySchema = z.void();

export type TRequestRefreshSummary = z.infer<
  typeof RequestRefreshSummarySchema
>;

export type TResponseRefreshSummary = z.infer<
  typeof ResponseRefreshSummarySchema
>;
