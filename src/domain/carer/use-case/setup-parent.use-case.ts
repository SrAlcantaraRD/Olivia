import { ErrorWhenSetupParent } from '@/domain/carer/error/carer-create.errors';
import type { ICarerPort } from '@/domain/carer/port/carer.port';
import {
  RequestSetupParentSchema,
  type TRequestSetupParent,
  type TResponseSetupParent,
} from '@/domain/carer/use-case-schema/setup-parent.use-case-schema';
import type { TLoggerPort } from '@/domain/core/adapter/logger.adapter';
import { BaseError } from '@/domain/core/entity/base-error';
import type { IBaseResponse } from '@/domain/core/interface/base-response.interface';
import { BaseUseCase } from '@/domain/core/interface/base-use-case.interface';
import type { ICachePort } from '@/domain/core/port/cache.port';
import { CACHE_KEY_ENUM } from '@/domain/core/port/cache.port';
import type { IModulePort } from '@/domain/module/port/module.port';
import type { IPatientPort } from '@/domain/patient/port/patient.port';

export class SetupParentUseCase extends BaseUseCase<
  TRequestSetupParent,
  TResponseSetupParent
> {
  constructor(
    loggerAdapter: TLoggerPort,
    private readonly carerAdapter: ICarerPort,
    private readonly patientAdapter: IPatientPort,
    private readonly moduleAdapter: IModulePort,
    private readonly cacheAdapter: ICachePort,
    private readonly secureStoreAdapter: ICachePort
  ) {
    super('setup-parent', loggerAdapter);
  }

  public async execute(
    request: TRequestSetupParent
  ): Promise<IBaseResponse<TResponseSetupParent>> {
    this.logDebug(
      'SetupParentUseCase',
      `Starting setup parent process with data: ${JSON.stringify(request)}`
    );

    const parse = RequestSetupParentSchema.safeParse(request);

    if (!parse.success) {
      const details = parse.error.message;

      this.logError('SetupParentUseCase', details);

      throw new ErrorWhenSetupParent('INVALID_PAYLOAD', details);
    }

    const { parent, patient, moduleList } = parse.data;

    try {
      const createdCarer = await this.carerAdapter.create(parent);

      await this.patientAdapter.create(patient);

      await this.moduleAdapter.batchActivate(moduleList);

      // persist cache for quick access (non-sensitive in regular cache, sensitive pin in secure store)
      const cachedCarer = {
        id: createdCarer.id,
        name: createdCarer.name,
        type: createdCarer.type,
        isPrimary: createdCarer.isPrimary,
      } as const;

      await this.cacheAdapter.set(CACHE_KEY_ENUM.CARER, cachedCarer);

      // pinHash is sensitive; persist in secure store
      if (createdCarer.pinHash) {
        await this.secureStoreAdapter.set(
          CACHE_KEY_ENUM.CARER_PIN_HASH,
          createdCarer.pinHash
        );
      }
    } catch (error) {
      let details = error instanceof Error ? error.message : 'Unexpected error';
      if (!(error instanceof BaseError)) {
        details = 'Unexpected error not instance of BaseError';
      }
      this.logError('SetupParentUseCase', error);
      this.logError('SetupParentUseCase', details);

      throw new ErrorWhenSetupParent(
        'FAILED_SETUP_PARENT',
        `Could not complete parent setup: ${details}`
      );
    }

    return {
      success: true,
      message: 'common.success',
      details: undefined,
    };
  }
}
