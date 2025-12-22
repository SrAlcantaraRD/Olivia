import type { TBaseEntity } from '@/domain/core/entity/base-entity.entity';
import { BaseError } from '@/domain/core/entity/base-error';
import { ERROR_CODE_ENUM } from '@/domain/core/enum/error-code.enum';

export class ErrorEntityNotFoundBy extends BaseError {
  constructor(
    entity: string,
    field: keyof TBaseEntity | string,
    value: string | number
  ) {
    super(
      ERROR_CODE_ENUM.ENTITY_NOT_FOUND,
      entity,
      `Could not find entity "${entity}" by "${field}" equal to "${value}".`
    );
  }
}
