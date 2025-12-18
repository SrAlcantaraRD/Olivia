import { z } from 'zod';

import { ErrorCannotParseSchema } from '@/domain/core/error/cannot-parse-schema.error';

export enum SUMMARY_DETAIL_TYPE_ENUM {
  MODULE = 'module',
  FIELD = 'field',
  TREND = 'trend',
}

export const SummaryDetailTypeSchema = z.enum(SUMMARY_DETAIL_TYPE_ENUM);

export const getSummaryDetailTypeFromValue = (
  value: string
): SUMMARY_DETAIL_TYPE_ENUM => {
  const types: SUMMARY_DETAIL_TYPE_ENUM[] = Object.values(
    SUMMARY_DETAIL_TYPE_ENUM
  );

  const type = types.find((item) => item === value);

  if (typeof type === 'undefined') {
    throw new ErrorCannotParseSchema(
      'SUMMARY_DETAIL_TYPE',
      `Value "${value}" is not a valid summary detail type.`
    );
  }

  return type;
};
