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

    // TODO: Add this validation to all use-cases.
    const parse = this.parseRequest(RequestCreateCarerSchema, request);

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
