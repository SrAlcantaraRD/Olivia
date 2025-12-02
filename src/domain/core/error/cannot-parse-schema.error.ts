import { BaseError } from '@/domain/core/entity';

export class ErrorCannotParseSchema extends BaseError {
  constructor(schemaName: string, message: string) {
    super(
      'CANNOT_PARSE_SCHEMA',
      `Error when parsing schema "${schemaName}"`,
      message
    );
  }
}
