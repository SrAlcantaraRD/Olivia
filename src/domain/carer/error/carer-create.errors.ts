import { ERROR_CODE_ENUM } from '@/domain/carer/enum/error-code.enum';
import { BaseError } from '@/domain/core/entity/base-error';

export class ErrorWhenSetupParent extends BaseError {
  constructor(code: string, description: string) {
    super(ERROR_CODE_ENUM.WHEN_SETUP_PARENT, code, description);
  }
}
