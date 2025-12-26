import { z } from 'zod';

import { QR_KEY } from '@/domain/core/enum/qr-key.enum';
import { IDSchema } from '@/domain/core/schemas/id.schema';

// Record Field
export const RecordFieldSyncSchema = z.object({
  [QR_KEY.RECORD_FIELD_ID]: IDSchema,
  [QR_KEY.RECORD_FIELD_VALUE]: z.string(), //When RECORD_FIELD is RELATED TO MODULE_FILED of type SELECT, the value is the index of the selected option
});

// Record
export const RecordSyncSchema = z.object({
  [QR_KEY.RECORD_MODULE_ID]: IDSchema,
  [QR_KEY.RECORD_DATE]: z.string().min(1),
  [QR_KEY.RECORD_FIELDS]: z.array(RecordFieldSyncSchema).min(1),
});

// Bundle
export const RecordSyncBundleSchema = z.object({
  [QR_KEY.ORIGIN_CARER_ID]: IDSchema,
  [QR_KEY.RECORDS]: z.array(RecordSyncSchema).min(1),
});

export type TRecordFieldSync = z.infer<typeof RecordFieldSyncSchema>;
export type TRecordSync = z.infer<typeof RecordSyncSchema>;
export type TRecordSyncBundle = z.infer<typeof RecordSyncBundleSchema>;
