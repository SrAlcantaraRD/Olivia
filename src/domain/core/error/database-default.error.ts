import { BaseError } from '@/domain/core/entity/base-error';
import { ERROR_CODE } from '@/domain/core/enum/error-code.enum';

export class ErrorDatabaseDefault extends BaseError {
  constructor(code: string, description: string) {
    super(ERROR_CODE.DEFAULT_ERROR, code, description);
  }
}
