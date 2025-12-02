import { BaseError } from '@/domain/core/entity/base-error';
import { ERROR_CODE_ENUM } from '@/domain/core/enum/error-code.enum';

export class ErrorDatabaseDefault extends BaseError {
  constructor(code: string, description: string) {
    super(ERROR_CODE_ENUM.DEFAULT_ERROR, code, description);
  }
}
