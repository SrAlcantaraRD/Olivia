import z from 'zod';

import type { ICarerPort } from '@/domain/carer/port/carer.port';
import {
  RequestDeleteCarerSchema,
  type TRequestDeleteCarer,
  type TResponseDeleteCarer,
} from '@/domain/carer/use-case-schema/delete-carer.use-case-schema';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';

export class DeleteCarerUseCase extends BaseUseCase<
  TRequestDeleteCarer,
  TResponseDeleteCarer
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
    request: TRequestDeleteCarer
  ): Promise<IBaseResponse<TResponseDeleteCarer>> {
    this.logDebug('DeleteCarerUseCase', request);

    const parse = RequestDeleteCarerSchema.safeParse(request);

    if (!parse.success) {
      // TODO: Generate a wrapper to encapsulate safeParse and errors return [avoid code duplication on parsing requests at abstract BaseUseCase]
      const errorList = z.treeifyError(parse.error).errors;
      this.logError('Error on parsing request', errorList.join(', '));

      return {
        success: false,
        message: 'use-case.delete-carer.invalid-request',
      };
    }

    await this.adapters.carerAdapter.updateStatus(
      parse.data.carerID,
      STATUS_ENUM.INACTIVE
    );

    return {
      success: true,
      message: 'common.success',
      details: true,
    };
  }
}
