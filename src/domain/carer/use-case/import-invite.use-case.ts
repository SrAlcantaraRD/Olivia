import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { CACHE_KEY_ENUM } from '@/domain/core/port/cache.port';
import { ErrorWhenImportInvite } from '@/domain/carer/error/carer-create.errors';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import type { IInvitePort } from '@/domain/carer/port/invite.port';
import type { TCarerCreate } from '@/domain/carer/entity/carer.entity';
import {
  RequestImportInviteSchema,
  type TRequestImportInvite,
  type TResponseImportInvite,
} from '@/domain/carer/use-case-schema/import-invite.use-case-schema';

export class ImportInviteUseCase extends BaseUseCase<
  TRequestImportInvite,
  TResponseImportInvite
> {
  constructor(
    loggerAdapter: TLoggerPort,
    private readonly inviteAdapter: IInvitePort,
    private readonly carerAdapter: ICarerPort,
    private readonly cacheAdapter: ICachePort,
    private readonly secureStoreAdapter: ICachePort
  ) {
    super('import-invite', loggerAdapter);
  }

  public async execute(
    request: TRequestImportInvite
  ): Promise<IBaseResponse<TResponseImportInvite>> {
    this.logDebug('ImportInviteUseCase', request);

    const parseResult = RequestImportInviteSchema.safeParse(request);

    if (!parseResult.success) {
      this.logError('ImportInviteUseCase', parseResult.error.format());
      throw new ErrorWhenImportInvite(
        'INVALID_PAYLOAD',
        parseResult.error.message
      );
    }

    const { bundle } = parseResult.data;

    const isValid = await this.inviteAdapter.verifyInviteBundle(bundle);

    if (!isValid) {
      throw new ErrorWhenImportInvite(
        'INVALID_BUNDLE',
        'El bundle de invitación es inválido o ha caducado'
      );
    }

    const carerPayload: TCarerCreate = {
      name: bundle.payload.carer.name,
      type: bundle.payload.carer.type,
      isPrimary: false,
      pinHash: '',
    };

    try {
      const createdCarer = await this.carerAdapter.create(carerPayload);

      await this.cacheAdapter.set(CACHE_KEY_ENUM.CARER, createdCarer);

      if (createdCarer.pinHash) {
        await this.secureStoreAdapter.set(
          CACHE_KEY_ENUM.CARER_PIN_HASH,
          createdCarer.pinHash
        );
      }

      return {
        success: true,
        message: 'common.success',
        details: { carerId: createdCarer.id },
      };
    } catch (error) {
      this.logError('ImportInviteUseCase', error);
      throw new ErrorWhenImportInvite(
        'FAILED_IMPORT',
        'No se pudo importar la invitación'
      );
    }
  }
}
