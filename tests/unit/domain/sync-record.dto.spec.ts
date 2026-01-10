import { RecordSyncBundleSchema } from '@/domain/core/dto/sync-record.dto';
import { QR_KEY } from '@/domain/core/enum/qr-key.enum';

describe('RecordSyncBundleSchema', () => {
  it('validates a minimal bundle', () => {
    const dto = {
      [QR_KEY.ORIGIN_CARER_ID]: 1,
      [QR_KEY.BUNDLE_ID]: 'bundle_1',
      [QR_KEY.RECORDS]: [
        {
          [QR_KEY.RECORD_MODULE_ID]: 1,
          [QR_KEY.RECORD_DATE]: '2025-12-23',
          [QR_KEY.RECORD_FIELDS]: [
            {
              [QR_KEY.RECORD_FIELD_ID]: 1,
              [QR_KEY.RECORD_FIELD_VALUE]: '42',
              ts: new Date().toISOString(),
            },
          ],
        },
      ],
      ts: new Date().toISOString(),
    };

    const parsed = RecordSyncBundleSchema.safeParse(dto);
    expect(parsed.success).toBe(true);
  });
});
