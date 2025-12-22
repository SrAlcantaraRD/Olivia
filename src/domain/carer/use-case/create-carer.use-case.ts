import z from 'zod';

import type { TCarerCreate } from '@/domain/carer/entity/carer.entity';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import {
  RequestCreateCarerSchema,
  type TRequestCreateCarer,
  type TResponseCreateCarer,
} from '@/domain/carer/use-case-schema/create-carer.use-case-schema';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';

export class CreateCarerUseCase extends BaseUseCase<
  TRequestCreateCarer,
  TResponseCreateCarer
> {
  constructor(
    private readonly adapters: {
      loggerAdapter: TLoggerPort;
      carerAdapter: ICarerPort;
    }
  ) {
    super('delete-carer', adapters.loggerAdapter);
  }

  public async execute(
    request: TRequestCreateCarer
  ): Promise<IBaseResponse<TResponseCreateCarer>> {
    this.logDebug('DeleteCarerUseCase', request);

    const parse = RequestCreateCarerSchema.safeParse(request);

    if (!parse.success) {
      // TODO: Generate a wrapper to encapsulate safeParse and errors return [avoid code duplication on parsing requests at abstract BaseUseCase]
      const errorList = z.treeifyError(parse.error).errors;
      this.logError('Error on parsing request', errorList.join(', '));

      return {
        success: false,
        message: 'use-case.create-carer.invalid-request',
      };
    }

    const { isPrimary, name, pinHash, type } = parse.data;

    const dto = {
      isPrimary,
      name,
      pinHash,
      type,
    } satisfies TCarerCreate;

    const carer = await this.adapters.carerAdapter.create(dto);

    return {
      success: true,
      message: 'common.success',
      details: carer,
    };
  }
}
