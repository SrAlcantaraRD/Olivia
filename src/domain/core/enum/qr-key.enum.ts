import z from 'zod';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

export enum QR_KEY {
  METADATA = 'm',
  PAYLOAD = 'p',
  RECORD_FIELD_ID = 'f',
  RECORD_FIELD_VALUE = 'v',
  RECORD_MODULE_ID = 'rm',
  RECORD_DATE = 'd',
  RECORD_FIELDS = 'rs',
  ORIGIN_CARER_ID = 'oi',
  ORIGIN_CARER_NAME = 'on',
  ORIGIN_CARER_EXPIRES_AT = 'oe',
  BUNDLE_ID = 'b',
  RECORDS = 'rs',
  SIGNATURE = 's',

  // Module access keys
  MODULE_LIST = 'ml',
  MODULE_ID = 'mi',
  MODULE_FIELD_LIST = 'mf',

  // Chunk-specific keys
  CHUNK_INDEX = 'i',
  CHUNK_TOTAL = 't',
  CHUNK_DATA = 'd',
  VERSION = 'v',
}

export const QRKeySchema = z.enum(QR_KEY);

export const getQRKeyFromValue = (value: string): QR_KEY => {
  const values = Object.values(QR_KEY) as QR_KEY[];
  const found = values.find((v) => v === value);

  if (typeof found === 'undefined') {
    throw new ErrorCannotParseSchema(
      'QRKeyEnum',
      `Value "${value}" is not a valid QRKeyEnum.`
    );
  }

  return found;
};
