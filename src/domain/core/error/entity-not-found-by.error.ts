import { ERROR_CODE } from '@/domain/core';
import { BaseError, type TBaseEntity } from '@/domain/core/entity';

export class ErrorEntityNotFoundBy extends BaseError {
  constructor(
    entity: string,
    field: keyof TBaseEntity | string,
    value: string | number
  ) {
    super(
      ERROR_CODE.ENTITY_NOT_FOUND,
      entity,
      `Could not find entity "${entity}" by "${field}" equal to "${value}".`
    );
  }
}
