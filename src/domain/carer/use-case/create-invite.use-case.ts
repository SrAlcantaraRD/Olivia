import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { ErrorWhenCreateInvite } from '@/domain/carer/error/carer-create.errors';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import type { IInvitePort } from '@/domain/carer/port/invite.port';
import {
  RequestCreateInviteSchema,
  type TRequestCreateInvite,
  type TResponseCreateInvite,
} from '@/domain/carer/use-case-schema/create-invite.use-case-schema';

export class CreateInviteUseCase extends BaseUseCase<
  TRequestCreateInvite,
  TResponseCreateInvite
> {
  constructor(
    loggerAdapter: TLoggerPort,
    private readonly carerAdapter: ICarerPort,
    private readonly inviteAdapter: IInvitePort
  ) {
    super('create-invite', loggerAdapter);
  }

  public async execute(
    request: TRequestCreateInvite
  ): Promise<IBaseResponse<TResponseCreateInvite>> {
    this.logDebug('CreateInviteUseCase', request);

    const parseResult = RequestCreateInviteSchema.safeParse(request);

    if (!parseResult.success) {
      this.logError('CreateInviteUseCase', parseResult.error.format());
      throw new ErrorWhenCreateInvite(
        'INVALID_PAYLOAD',
        parseResult.error.message
      );
    }

    const carer = await this.carerAdapter.getById(parseResult.data.carerId);

    if (!carer) {
      throw new ErrorWhenCreateInvite('CARER_NOT_FOUND', 'Carer not found');
    }

    try {
      const bundle = await this.inviteAdapter.createInviteBundle({
        carer: {
          name: carer.name,
          type: carer.type,
          note: carer.isPrimary ? 'Primary carer invite' : undefined,
        },
      });

      return {
        success: true,
        message: 'common.success',
        details: bundle,
      };
    } catch (error) {
      this.logError('CreateInviteUseCase', error);
      throw new ErrorWhenCreateInvite(
        'FAILED_CREATE',
        'No se pudo generar la invitación'
      );
    }
  }
}
